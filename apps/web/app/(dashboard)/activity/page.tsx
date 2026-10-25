import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProtectedPage } from "@/components/dashboard/protected-page";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { listRecentActivity } from "@/lib/activity";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata = { title: "Activity" };

const EVENT_LABELS: Record<string, string> = {
  sign_in_success: "Signed in",
  sign_in_failed: "Failed sign-in",
  sign_out: "Signed out",
  password_reset_requested: "Password reset requested",
  password_reset_completed: "Password reset completed",
  password_reset_failed: "Password reset failed",
  admin_action: "Admin action",
  user_provisioned: "Account created",
};

async function ActivityTable() {
  const rows = await listRecentActivity(50);
  if (rows.length === 0) return <EmptyState title="No activity recorded yet" />;

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>When</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>IP</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => {
            const meta = r.metadata as { path?: string; role?: string | null } | null;
            const failed = r.event.endsWith("_failed");
            return (
              <TableRow key={r.id}>
                <TableCell className="whitespace-nowrap">{formatDateTime(r.createdAt)}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(failed && "border-red-500/40 bg-red-500/15 text-red-300")}
                  >
                    {EVENT_LABELS[r.event] ?? r.event}
                  </Badge>
                </TableCell>
                <TableCell>
                  {r.actorName ?? <span className="text-muted-foreground">Unknown</span>}
                  {r.actorEmail ? <p className="text-xs text-muted-foreground">{r.actorEmail}</p> : null}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {meta?.path ? `${meta.path}${meta.role ? ` → ${meta.role}` : ""}` : ""}
                </TableCell>
                <TableCell className="font-mono text-xs">{r.ip ?? ""}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default function ActivityPage() {
  return (
    <ProtectedPage roles={["admin"]}>
      <PageHeader title="Activity" description="Recent sign-ins and administrative actions." />
      <ActivityTable />
    </ProtectedPage>
  );
}