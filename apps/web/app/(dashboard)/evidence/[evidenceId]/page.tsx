import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { DetailList } from "@/components/dashboard/detail-list";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProtectedPage } from "@/components/dashboard/protected-page";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatDateTime, titleCase } from "@/lib/format";
import { getEvidence } from "@/lib/vision/client";

export const metadata = { title: "Evidence item" };

async function EvidenceDetail({ params }: { params: Promise<{ evidenceId: string }> }) {
  const { evidenceId } = await params;
  const item = await getEvidence(evidenceId);
  if (!item) notFound();

  return (
    <>
      <PageHeader
        title={item.title}
        description={item.id}
        actions={
          <Link href="/evidence" className={buttonVariants({ variant: "outline", size: "sm" })}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            Evidence
          </Link>
        }
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardContent className="flex aspect-video items-center justify-center text-sm text-muted-foreground">
              Media preview is not available yet.
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Access log</CardTitle></CardHeader>
            <CardContent>
              {item.access_log.length === 0 ? (
                <p className="text-sm text-muted-foreground">Not accessed yet.</p>
              ) : (
                <ul className="divide-y text-sm">
                  {item.access_log.map((a, idx) => (
                    <li key={idx} className="flex justify-between gap-3 py-2">
                      <span>{a.actor} · {a.action}</span>
                      <span className="text-muted-foreground">{formatDateTime(a.at)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <DetailList
              items={[
                ["Type", titleCase(item.type)],
                ["Camera", <Link key="c" href={`/cameras/${item.camera_id}`} className="underline underline-offset-4">{item.camera_name}</Link>],
                ["Incident", item.incident_id ? <Link key="i" href={`/incidents/${item.incident_id}`} className="underline underline-offset-4">{item.incident_id}</Link> : "None"],
                ["Captured", formatDateTime(item.captured_at)],
                ["Duration", item.duration_seconds ? `${item.duration_seconds}s` : "n/a"],
                ["Size", `${item.size_mb} MB`],
                ["Retain until", formatDate(item.retention_until)],
              ]}
            />
            <div className="space-y-1 text-sm">
              <p className="text-muted-foreground">SHA-256 (integrity)</p>
              <p className="font-mono text-xs break-all">{item.sha256}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default function EvidenceDetailPage({ params }: { params: Promise<{ evidenceId: string }> }) {
  return (
    <ProtectedPage>
      <EvidenceDetail params={params} />
    </ProtectedPage>
  );
}