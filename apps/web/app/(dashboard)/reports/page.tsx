import { Download } from "lucide-react";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProtectedPage } from "@/components/dashboard/protected-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime } from "@/lib/format";
import { listReports } from "@/lib/vision/client";

export const metadata = { title: "Reports" };

async function ReportTable() {
  const reports = await listReports();
  if (reports.length === 0) return <EmptyState title="No reports generated yet" />;

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Report</TableHead>
            <TableHead>Period</TableHead>
            <TableHead>Format</TableHead>
            <TableHead>Generated</TableHead>
            <TableHead className="text-right">Download</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="font-medium">{r.title}</TableCell>
              <TableCell>{r.period}</TableCell>
              <TableCell><Badge variant="outline">{r.format.toUpperCase()}</Badge></TableCell>
              <TableCell>{formatDateTime(r.generated_at)}</TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="outline" disabled aria-label={`Download ${r.title} (not available yet)`}>
                  <Download className="size-4" aria-hidden="true" />
                  {r.size_kb} KB
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <ProtectedPage>
      <PageHeader title="Reports" description="Generated security reports and exports." />
      <ReportTable />
    </ProtectedPage>
  );
}