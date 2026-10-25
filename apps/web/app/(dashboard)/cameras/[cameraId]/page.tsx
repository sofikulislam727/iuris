import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { FeedPlaceholder } from "@/components/dashboard/camera-tile";
import { DetailList } from "@/components/dashboard/detail-list";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProtectedPage } from "@/components/dashboard/protected-page";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime, formatTime } from "@/lib/format";
import { getCamera, listIncidents } from "@/lib/vision/client";

export const metadata = { title: "Camera" };

async function CameraDetail({ params }: { params: Promise<{ cameraId: string }> }) {
  const { cameraId } = await params;
  const camera = await getCamera(cameraId);
  if (!camera) notFound();

  const incidents = (await listIncidents()).filter((i) => i.camera_id === camera.id);

  return (
    <>
      <PageHeader
        title={camera.name}
        description={camera.location}
        actions={
          <Link href="/cameras" className={buttonVariants({ variant: "outline", size: "sm" })}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            Cameras
          </Link>
        }
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="overflow-hidden lg:col-span-2">
          <FeedPlaceholder status={camera.status} />
        </Card>

        <Card>
          <CardHeader><CardTitle>Details</CardTitle></CardHeader>
          <CardContent>
            <DetailList
              items={[
                ["Status", <StatusBadge key="s" value={camera.status} />],
                ["Zone", camera.zone],
                ["Resolution", camera.resolution],
                ["Frame rate", `${camera.fps} fps`],
                ["Detections today", camera.detections_today],
                ["Last seen", camera.last_seen_at ? formatDateTime(camera.last_seen_at) : "Never"],
              ]}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader><CardTitle>Incidents from this camera</CardTitle></CardHeader>
          <CardContent>
            {incidents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No incidents.</p>
            ) : (
              <ul className="divide-y">
                {incidents.map((i) => (
                  <li key={i.id}>
                    <Link href={`/incidents/${i.id}`} className="flex items-center justify-between gap-3 py-3 hover:text-primary">
                      <span className="min-w-0">
                        <span className="block truncate font-medium">{i.title}</span>
                        <span className="text-xs text-muted-foreground">{formatTime(i.detected_at)}</span>
                      </span>
                      <StatusBadge value={i.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default function CameraDetailPage({ params }: { params: Promise<{ cameraId: string }> }) {
  return (
    <ProtectedPage>
      <CameraDetail params={params} />
    </ProtectedPage>
  );
}