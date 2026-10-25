import { CameraTile } from "@/components/dashboard/camera-tile";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProtectedPage } from "@/components/dashboard/protected-page";
import { listCameras } from "@/lib/vision/client";

export const metadata = { title: "Monitoring" };

async function Wall() {
  const cameras = await listCameras();
  if (cameras.length === 0) {
    return <EmptyState title="No cameras registered" description="Add cameras in the vision service." />;
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cameras.map((c) => (
        <CameraTile key={c.id} camera={c} />
      ))}
    </div>
  );
}

export default function MonitoringPage() {
  return (
    <ProtectedPage>
      <PageHeader title="Live monitoring" description="Select a camera for details." />
      <Wall />
    </ProtectedPage>
  );
}