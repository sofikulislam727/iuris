"use server";

import { randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { writeAudit } from "@/lib/audit";
import { provisionUserSchema } from "@/lib/auth-validation";
import { getSession } from "@/lib/auth-helpers";
import { env } from "@/lib/env";
import { APP_ROLES, hasAnyRole } from "@/lib/permissions";

export type ActionResult = { ok: true } | { ok: false; error: string };

const NOT_AUTHORIZED: ActionResult = { ok: false, error: "Not authorized." };

async function getAdminActor() {
  const session = await getSession();
  if (
    !session ||
    session.user.banned ||
    !hasAnyRole(session.user.role, ["admin"])
  ) {
    return null;
  }
  return session;
}

export async function provisionUserAction(input: unknown): Promise<ActionResult> {
  const actor = await getAdminActor();
  if (!actor) return NOT_AUTHORIZED;

  const parsed = provisionUserSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const { name, email, role } = parsed.data;

  // Typo guard only; the admin-provisioned account is the real authorization.
  if (env.allowedEmailDomains.length > 0) {
    const domain = email.split("@")[1] ?? "";
    if (!env.allowedEmailDomains.includes(domain)) {
      return { ok: false, error: "Email domain is not allowed." };
    }
  }

  try {
    const { user } = await auth.api.createUser({
      body: {
        email,
        name,
        role,
        password: randomBytes(32).toString("base64url"), // never shown
      },
      headers: await headers(),
    });

    await auth.api.requestPasswordReset({
      body: { email, redirectTo: `${env.BETTER_AUTH_URL}/reset-password` },
    });

    await writeAudit({
      event: "user_provisioned",
      actorUserId: actor.user.id,
      targetUserId: user.id,
      metadata: { role },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not create the account. It may already exist." };
  }
}

const roleSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(APP_ROLES),
});

export async function setUserRoleAction(input: unknown): Promise<ActionResult> {
  const actor = await getAdminActor();
  if (!actor) return NOT_AUTHORIZED;

  const parsed = roleSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid request." };
  const { userId, role } = parsed.data;

  if (userId === actor.user.id) {
    return { ok: false, error: "You can't change your own role." };
  }

  try {
    const h = await headers();
    await auth.api.setRole({ body: { userId, role }, headers: h });
    // Force re-login so the new permissions apply everywhere immediately.
    await auth.api.revokeUserSessions({ body: { userId }, headers: h });
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not update the role." };
  }
}

const banSchema = z.object({
  userId: z.string().min(1),
  banned: z.boolean(),
  reason: z.string().trim().max(200).optional(),
});

export async function setUserBanAction(input: unknown): Promise<ActionResult> {
  const actor = await getAdminActor();
  if (!actor) return NOT_AUTHORIZED;

  const parsed = banSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid request." };
  const { userId, banned, reason } = parsed.data;

  if (userId === actor.user.id) {
    return { ok: false, error: "You can't disable your own account." };
  }

  try {
    const h = await headers();
    if (banned) {
      // banUser also revokes the user's existing sessions.
      await auth.api.banUser({
        body: { userId, banReason: reason || "Disabled by administrator" },
        headers: h,
      });
    } else {
      await auth.api.unbanUser({ body: { userId }, headers: h });
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not update the account." };
  }
}