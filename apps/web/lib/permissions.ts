import { createAccessControl } from "better-auth/plugins/access";

export const APP_ROLES = ["admin", "security_officer"] as const;
export type AppRole = (typeof APP_ROLES)[number];

// Resources/actions. "user" and "session" mirror the Admin plugin's built-ins;
// "surveillance" is IURIS-specific.
export const statement = {
  user: ["create", "list", "get", "update", "set-role", "ban"],
  session: ["list", "revoke"],
  surveillance: ["view", "manage"],
} as const;

export const ac = createAccessControl(statement);

// Deliberately NOT granted: impersonate, impersonate-admins, delete,
// set-password, set-email. Disable accounts with ban instead of deleting.
export const adminRole = ac.newRole({
  user: ["create", "list", "get", "update", "set-role", "ban"],
  session: ["list", "revoke"],
  surveillance: ["view", "manage"],
});

export const securityOfficerRole = ac.newRole({
  surveillance: ["view"],
});

/** Admin plugin stores multiple roles as a comma-separated string. */
export function parseRoles(role: string | null | undefined): string[] {
  return (role ?? "")
    .split(",")
    .map((r) => r.trim())
    .filter(Boolean);
}

export function hasAnyRole(
  role: string | null | undefined,
  allowed: readonly AppRole[],
): boolean {
  const roles = parseRoles(role);
  return allowed.some((a) => roles.includes(a));
}