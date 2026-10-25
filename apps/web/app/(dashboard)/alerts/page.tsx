import { ComingSoon } from "@/components/dashboard/coming-soon";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProtectedPage } from "@/components/dashboard/protected-page";

export const metadata = { title: "Alerts · IURIS" };

export default function AlertsPage() {
  return (
    <ProtectedPage>
      <PageHeader title="Alerts" description="Active and past security alerts." />
      <ComingSoon module="Alerts" />
    </ProtectedPage>
  );
}