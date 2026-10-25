import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { DetailList } from "@/components/dashboard/detail-list";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProtectedPage } from "@/components/dashboard/protected-page";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime, formatPercent, titleCase } from "@/lib/format";
import { getEvidence, getIncident } from "@/lib/vision/client";
import type { Evidence } from "@/lib/vision/types";

export const metadata = { title: "Incident" };

async function IncidentDetail({ params }: { params: Promise<{ incidentId: string }> }) {
  const { incidentId } = await params;
  const incident = await getIncident(incidentId);
  if (!incident) notFound();

  const evidence = (await Promise.all(incident.evidence_ids.map((id) => getEvidence(id)))).filter(
    (e): e is Evidence => e !== null,
  );

  return (
    <>
      <PageHeader
        title={incident.title}
        description={`${incident.id} · ${incident.camera_name}`}
        actions={
          <Link href="/incidents" className={buttonVariants({ variant: "outline", size: "sm" })}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            Incidents
          </Link>
        }
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex gap-2">
                <StatusBadge value={incident.severity} />
                <StatusBadge value={incident.status} />
              </div>
              <p>{incident.summary}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Timeline</CardTitle></CardHeader>
            <CardContent>
              <ol className="space-y-4 border-l pl-5">
                {incident.timeline.map((t, idx) => (
                  <li key={idx} className="relative text-sm">
                    <span className="absolute top-1.5 -left-[25px] size-2 rounded-full bg-primary" aria-hidden="true" />
                    <p className="font-medium">{t.label}</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(t.at)}</p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Details</CardTitle></CardHeader>
            <CardContent>
              <DetailList
                items={[
                  ["Type", titleCase(incident.kind)],
                  ["Confidence", formatPercent(incident.confidence)],
                  ["Camera", <Link key="c" href={`/cameras/${incident.camera_id}`} className="underline underline-offset-4">{incident.camera_name}</Link>],
                  ["Location", incident.location],
                  ["Detected", formatDateTime(incident.detected_at)],
                  ["Assigned to", incident.assigned_to ?? "Unassigned"],
                ]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Evidence</CardTitle></CardHeader>
            <CardContent>
              {evidence.length === 0 ? (
                <p className="text-sm text-muted-foreground">No evidence attached.</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {evidence.map((e) => (
                    <li key={e.id}>
                      <Link href={`/evidence/${e.id}`} className="underline underline-offset-4 hover:text-primary">
                        {e.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

export default function IncidentDetailPage({ params }: { params: Promise<{ incidentId: string }> }) {
  return (
    <ProtectedPage>
      <IncidentDetail params={params} />
    </ProtectedPage>
  );
}