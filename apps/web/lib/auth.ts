import "server-only";
import { after } from "next/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin as adminPlugin } from "better-auth/plugins";
import { APIError, createAuthMiddleware } from "better-auth/api";

import { db } from "@/db/drizzle";
import * as schema from "@/db/schema";
import { env } from "@/lib/env";
import { writeAudit } from "@/lib/audit";
import { sendPasswordResetEmail } from "@/lib/email/send";
import { passwordSchema } from "@/lib/auth-validation";
import { ac, adminRole, securityOfficerRole } from "@/lib/permissions";

/** Run without awaiting (avoids timing leaks); keep alive on serverless. */
function dispatch(task: () => Promise<void>) {
  try {
    after(task);
  } catch {
    void task(); // outside a request scope
  }
}

function clientInfo(headers?: Headers) {
  return {
    ip: headers?.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    userAgent: headers?.get("user-agent") ?? null,
  };
}

export const auth = betterAuth({
  appName: "IURIS",
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: [env.BETTER_AUTH_URL],

  database: drizzleAdapter(db, { provider: "pg", schema }),

  emailAndPassword: {
    enabled: true,
    disableSignUp: true, // no public registration
    minPasswordLength: 12,
    maxPasswordLength: 128,
    requireEmailVerification: false, // see note in the answer
    resetPasswordTokenExpiresIn: 60 * 60, // 1 hour
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      dispatch(() =>
        sendPasswordResetEmail({ to: user.email, name: user.name, url }),
      );
    },
  },

  session: {
    expiresIn: 60 * 60 * 8, // 8 hours
    updateAge: 60 * 60, // refresh at most hourly
    // cookieCache is intentionally NOT enabled, so bans and role
    // changes take effect on the very next request.
  },

  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    cookiePrefix: "iuris",
  },

  rateLimit: {
    enabled: true, // by default it is only on in production
    storage: "database", // survives restarts / works across serverless instances
    window: 60,
    max: 100,
    customRules: {
      "/sign-in/email": { window: 300, max: 5 },
      "/request-password-reset": { window: 3600, max: 3 },
      "/reset-password": { window: 300, max: 5 },
    },
  },

  plugins: [
    adminPlugin({
      ac,
      roles: { admin: adminRole, security_officer: securityOfficerRole },
      defaultRole: "security_officer", // the built-in "user" role no longer exists
      adminRoles: ["admin"],
    }),
    nextCookies(), // must be the last plugin
  ],

  hooks: {
    // Server-side password policy (the client check alone is not enough).
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/reset-password") {
        const body = ctx.body as { newPassword?: unknown } | undefined;
        if (!passwordSchema.safeParse(body?.newPassword).success) {
          throw new APIError("BAD_REQUEST", {
            message: "Password does not meet the requirements.",
          });
        }
      }
    }),

    // Audit trail. Only whitelisted fields are logged, never bodies.
    after: createAuthMiddleware(async (ctx) => {
      const failed = ctx.context.returned instanceof APIError;
      const info = clientInfo(ctx.headers);

      if (ctx.path === "/sign-in/email") {
        await writeAudit({
          event: failed ? "sign_in_failed" : "sign_in_success",
          actorUserId: ctx.context.newSession?.user.id ?? null,
          ...info,
        });
      } else if (ctx.path === "/sign-out") {
        await writeAudit({
          event: "sign_out",
          actorUserId: ctx.context.session?.user.id ?? null,
          ...info,
        });
      } else if (ctx.path === "/request-password-reset") {
        await writeAudit({ event: "password_reset_requested", ...info });
      } else if (ctx.path === "/reset-password") {
        await writeAudit({
          event: failed ? "password_reset_failed" : "password_reset_completed",
          ...info,
        });
      } else if (ctx.path.startsWith("/admin/") && !failed) {
        const body = ctx.body as
          | { userId?: string; role?: string | string[] }
          | undefined;
        await writeAudit({
          event: "admin_action",
          actorUserId: ctx.context.session?.user.id ?? null,
          targetUserId: body?.userId ?? null,
          metadata: {
            path: ctx.path,
            role: Array.isArray(body?.role)
              ? body.role.join(",")
              : (body?.role ?? null),
          },
          ...info,
        });
      }
    }),
  },
});

export type Session = typeof auth.$Infer.Session;