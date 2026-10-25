import { ComingSoon } from "@/components/dashboard/coming-soon";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProtectedPage } from "@/components/dashboard/protected-page";

export const metadata = { title: "Intelligence · IURIS" };

export default function IntelligencePage() {
  return (
    <ProtectedPage>
      <PageHeader title="Intelligence" description="AI-assisted analysis and insights." />
      <ComingSoon module="Intelligence" />
    </ProtectedPage>
  );
}