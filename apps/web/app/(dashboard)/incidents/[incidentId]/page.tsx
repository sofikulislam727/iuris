import { ComingSoon } from "@/components/dashboard/coming-soon";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProtectedPage } from "@/components/dashboard/protected-page";

export const metadata = { title: "Incident · IURIS" };

async function IncidentDetail({ params }: { params: Promise<{ incidentId: string }> }) {
  const { incidentId } = await params;
  return (
    <>
      <PageHeader title={`Incident ${incidentId}`} description="Timeline, evidence and notes." />
      <ComingSoon module="Incident detail" />
    </>
  );
}

export default function IncidentDetailPage({
  params,
}: {
  params: Promise<{ incidentId: string }>;
}) {
  return (
    <ProtectedPage>
      <IncidentDetail params={params} />
    </ProtectedPage>
  );
}
