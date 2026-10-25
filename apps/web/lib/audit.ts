import { db } from "@/db/drizzle";
import { auditLog } from "@/db/schema";
import "server-only";


export type AuditEvent =
  | "sign_in_success"
  | "sign_in_failed"
  | "sign_out"
  | "password_reset_requested"
  | "password_reset_completed"
  | "password_reset_failed"
  | "admin_action"
  | "user_provisioned";

export async function writeAudit(entry: {
  event: AuditEvent;
  actorUserId?: string | null;
  targetUserId?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, string | number | boolean | null>;
}) {
  try {
    await db.insert(auditLog).values({
      event: entry.event,
      actorUserId: entry.actorUserId ?? null,
      targetUserId: entry.targetUserId ?? null,
      ip: entry.ip ?? null,
      userAgent: entry.userAgent ?? null,
      metadata: entry.metadata ?? null,
    });
  } catch {
    console.error("[audit] failed to write event:", entry.event);
  }
}