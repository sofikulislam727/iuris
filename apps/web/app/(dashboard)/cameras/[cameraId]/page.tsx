import { ComingSoon } from "@/components/dashboard/coming-soon";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProtectedPage } from "@/components/dashboard/protected-page";

export const metadata = { title: "Camera · IURIS" };

async function CameraDetail({ params }: { params: Promise<{ cameraId: string }> }) {
  const { cameraId } = await params;
  return (
    <>
      <PageHeader title={`Camera ${cameraId}`} description="Camera details and recent activity." />
      <ComingSoon module="Camera detail" />
    </>
  );
}

export default function CameraDetailPage({
  params,
}: {
  params: Promise<{ cameraId: string }>;
}) {
  return (
    <ProtectedPage>
      <CameraDetail params={params} />
    </ProtectedPage>
  );
}