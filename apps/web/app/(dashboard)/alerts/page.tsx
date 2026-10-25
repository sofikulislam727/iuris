import Link from "next/link";
import { EmptyState } from "@/components/dashboard/empty-state";
import { FilterTabs } from "@/components/dashboard/filter-tabs";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProtectedPage } from "@/components/dashboard/protected-page";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateTime, titleCase } from "@/lib/format";
import { listAlerts } from "@/lib/vision/client";
import { ALERT_STATUSES } from "@/lib/vision/types";

export const metadata = { title: "Alerts" };

async function AlertFeed({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const filter = ALERT_STATUSES.find((s) => s === status);
  const alerts = await listAlerts(filter);

  return (
    <>
      <FilterTabs
        label="Filter alerts by status"
        items={[
          { label: "All", href: "/alerts", active: !filter },
          ...ALERT_STATUSES.map((s) => ({
            label: titleCase(s),
            href: `/alerts?status=${s}`,
            active: filter === s,
          })),
        ]}
      />
      {alerts.length === 0 ? (
        <EmptyState title="No alerts found" />
      ) : (
        <ul className="space-y-3">
          {alerts.map((a) => (
            <li key={a.id}>
              <Card>
                <CardContent className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <p className="font-medium">{a.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {titleCase(a.kind)} · {a.camera_name} · {formatDateTime(a.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge value={a.severity} />
                    <StatusBadge value={a.status} />
                    {a.incident_id ? (
                      <Link href={`/incidents/${a.incident_id}`} className="text-sm underline underline-offset-4 hover:text-primary">
                        View incident
                      </Link>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default function AlertsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  return (
    <ProtectedPage>
      <PageHeader title="Alerts" description="Active and past security alerts." />
      <AlertFeed searchParams={searchParams} />
    </ProtectedPage>
  );
}