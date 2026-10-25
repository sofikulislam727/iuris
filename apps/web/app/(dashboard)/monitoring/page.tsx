import { ComingSoon } from "@/components/dashboard/coming-soon";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProtectedPage } from "@/components/dashboard/protected-page";

export const metadata = { title: "Monitoring · IURIS" };

export default function MonitoringPage() {
  return (
    <ProtectedPage>
      <PageHeader title="Live monitoring" description="Real-time camera feeds and detections." />
      <ComingSoon module="Live monitoring" />
    </ProtectedPage>
  );
}