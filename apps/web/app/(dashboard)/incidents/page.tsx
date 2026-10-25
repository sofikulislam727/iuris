import Link from "next/link";
import { EmptyState } from "@/components/dashboard/empty-state";
import { FilterTabs } from "@/components/dashboard/filter-tabs";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProtectedPage } from "@/components/dashboard/protected-page";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime, formatPercent, titleCase } from "@/lib/format";
import { listIncidents } from "@/lib/vision/client";
import { INCIDENT_STATUSES } from "@/lib/vision/types";

export const metadata = { title: "Incidents" };

async function IncidentList({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const filter = INCIDENT_STATUSES.find((s) => s === status);
  const incidents = await listIncidents(filter);

  return (
    <>
      <FilterTabs
        label="Filter incidents by status"
        items={[
          { label: "All", href: "/incidents", active: !filter },
          ...INCIDENT_STATUSES.map((s) => ({
            label: titleCase(s),
            href: `/incidents?status=${s}`,
            active: filter === s,
          })),
        ]}
      />
      {incidents.length === 0 ? (
        <EmptyState title="No incidents found" />
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Incident</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Camera</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Detected</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidents.map((i) => (
                <TableRow key={i.id}>
                  <TableCell>
                    <Link href={`/incidents/${i.id}`} className="font-medium underline-offset-4 hover:underline">
                      {i.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">{i.id}</p>
                  </TableCell>
                  <TableCell><StatusBadge value={i.severity} /></TableCell>
                  <TableCell><StatusBadge value={i.status} /></TableCell>
                  <TableCell>{i.camera_name}</TableCell>
                  <TableCell className="tabular-nums">{formatPercent(i.confidence)}</TableCell>
                  <TableCell>{formatDateTime(i.detected_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}

export default function IncidentsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  return (
    <ProtectedPage>
      <PageHeader title="Incidents" description="Security incidents raised by the vision service." />
      <IncidentList searchParams={searchParams} />
    </ProtectedPage>
  );
}