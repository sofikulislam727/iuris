import { parseRoles, type AppRole } from "@/lib/permissions";

const LABELS: Record<AppRole, string> = {
  admin: "Administrator",
  security_officer: "Security officer",
};

export function roleLabel(role: string | null | undefined): string {
  const roles = parseRoles(role);
  if (roles.length === 0) return "No role";
  return roles.map((r) => LABELS[r as AppRole] ?? r).join(", ");
}