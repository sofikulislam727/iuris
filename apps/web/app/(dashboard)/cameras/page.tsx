import { ComingSoon } from "@/components/dashboard/coming-soon";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProtectedPage } from "@/components/dashboard/protected-page";

export const metadata = { title: "Cameras · IURIS" };

export default function CamerasPage() {
  return (
    <ProtectedPage>
      <PageHeader title="Cameras" description="All registered campus cameras." />
      <ComingSoon module="Cameras" />
    </ProtectedPage>
  );
}