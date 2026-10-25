import Link from "next/link";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProtectedPage } from "@/components/dashboard/protected-page";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatTime } from "@/lib/format";
import { listCameras } from "@/lib/vision/client";

export const metadata = { title: "Cameras" };

async function CameraTable() {
  const cameras = await listCameras();
  if (cameras.length === 0) return <EmptyState title="No cameras registered" />;

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Camera</TableHead>
            <TableHead>Zone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Stream</TableHead>
            <TableHead className="text-right">Detections today</TableHead>
            <TableHead>Last seen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cameras.map((c) => (
            <TableRow key={c.id}>
              <TableCell>
                <Link href={`/cameras/${c.id}`} className="font-medium underline-offset-4 hover:underline">
                  {c.name}
                </Link>
                <p className="text-xs text-muted-foreground">{c.location}</p>
              </TableCell>
              <TableCell>{c.zone}</TableCell>
              <TableCell><StatusBadge value={c.status} /></TableCell>
              <TableCell className="text-muted-foreground">{c.resolution} · {c.fps} fps</TableCell>
              <TableCell className="text-right tabular-nums">{c.detections_today}</TableCell>
              <TableCell>{c.last_seen_at ? formatTime(c.last_seen_at) : "Never"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function CamerasPage() {
  return (
    <ProtectedPage>
      <PageHeader title="Cameras" description="All registered campus cameras." />
      <CameraTable />
    </ProtectedPage>
  );
}