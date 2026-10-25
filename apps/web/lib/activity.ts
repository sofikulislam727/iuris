import "server-only";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { auditLog, user } from "@/db/schema";

export type ActivityRow = Awaited<ReturnType<typeof listRecentActivity>>[number];

export async function listRecentActivity(limit = 50) {
  return db
    .select({
      id: auditLog.id,
      createdAt: auditLog.createdAt,
      event: auditLog.event,
      actorName: user.name,
      actorEmail: user.email,
      ip: auditLog.ip,
      metadata: auditLog.metadata,
    })
    .from(auditLog)
    .leftJoin(user, eq(auditLog.actorUserId, user.id))
    .orderBy(desc(auditLog.createdAt))
    .limit(limit);
}