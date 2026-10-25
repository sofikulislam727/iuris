import { ComingSoon } from "@/components/dashboard/coming-soon";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProtectedPage } from "@/components/dashboard/protected-page";

export const metadata = { title: "Incidents · IURIS" };

export default function IncidentsPage() {
  return (
    <ProtectedPage>
      <PageHeader title="Incidents" description="Security incidents under review." />
      <ComingSoon module="Incidents" />
    </ProtectedPage>
  );
}