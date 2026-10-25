import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { APP_ROLES, hasAnyRole, type AppRole } from "@/lib/permissions";

/** Current session or null (deduplicated per request in RSC). */
export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);

/** Page/layout guard: authenticated, not banned, has some valid app role. */
export async function requireSession() {
  const session = await getSession();
  if (!session || session.user.banned) redirect("/sign-in");
  // Signed in but holding no valid IURIS role: end the session.
  if (!hasAnyRole(session.user.role, APP_ROLES)) redirect("/sign-out");
  return session;
}

/** Page/layout guard for specific roles. */
export async function requireRole(allowed: readonly AppRole[]) {
  const session = await requireSession();
  if (!hasAnyRole(session.user.role, allowed)) {
    // Authenticated but not permitted: hide the route's existence.
    notFound();
  }
  return session;
}

/** Route-handler guard: returns a Response instead of redirecting. */
export async function authorizeApi(allowed: readonly AppRole[]) {
  const session = await getSession();
  if (!session || session.user.banned) {
    return {
      ok: false as const,
      response: Response.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  if (!hasAnyRole(session.user.role, allowed)) {
    return {
      ok: false as const,
      response: Response.json({ error: "Forbidden" }, { status: 403 }),
    };
  }
  return { ok: true as const, session };
}