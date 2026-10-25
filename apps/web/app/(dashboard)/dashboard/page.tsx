import Link from "next/link";
import { Activity, Bell, Camera, Siren } from "lucide-react";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProtectedPage } from "@/components/dashboard/protected-page";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTime } from "@/lib/format";
import { getOverview, listAlerts, listIncidents } from "@/lib/vision/client";

export const metadata = { title: "Dashboard" };

async function Overview() {
  const [overview, incidents, alerts] = await Promise.all([
    getOverview(),
    listIncidents(),
    listAlerts("new"),
  ]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Cameras online" value={`${overview.cameras_online}/${overview.cameras_total}`} icon={<Camera className="size-5" />} />
        <StatCard label="Open incidents" value={overview.open_incidents} icon={<Siren className="size-5" />} />
        <StatCard label="New alerts" value={overview.active_alerts} icon={<Bell className="size-5" />} />
        <StatCard label="Detections today" value={overview.detections_today} icon={<Activity className="size-5" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent incidents</CardTitle>
            <CardDescription>Latest incidents raised by the vision service.</CardDescription>
          </CardHeader>
          <CardContent>
            {incidents.length === 0 ? (
              <EmptyState title="No incidents" description="Nothing has been raised yet." />
            ) : (
              <ul className="divide-y">
                {incidents.slice(0, 5).map((i) => (
                  <li key={i.id}>
                    <Link
                      href={`/incidents/${i.id}`}
                      className="flex items-center justify-between gap-3 py-3 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">{i.title}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {i.camera_name} · {formatTime(i.detected_at)}
                        </p>
                      </div>
                      <StatusBadge value={i.severity} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vision service</CardTitle>
              <CardDescription>Inference pipeline health.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <StatusBadge value={overview.vision.status} />
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Latency</span>
                <span>{overview.vision.avg_latency_ms} ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Throughput</span>
                <span>{overview.vision.fps} fps</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Model</span>
                <span>{overview.vision.model_version}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>New alerts</CardTitle>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No new alerts.</p>
              ) : (
                <ul className="space-y-3">
                  {alerts.slice(0, 4).map((a) => (
                    <li key={a.id} className="flex items-start justify-between gap-2 text-sm">
                      <span className="min-w-0">
                        <span className="block truncate">{a.message}</span>
                        <span className="text-xs text-muted-foreground">{a.camera_name}</span>
                      </span>
                      <StatusBadge value={a.severity} />
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedPage>
      <PageHeader title="Command overview" description="Live status of campus security." />
      <Overview />
    </ProtectedPage>
  );
}