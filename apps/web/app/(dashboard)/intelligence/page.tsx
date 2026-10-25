import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProtectedPage } from "@/components/dashboard/protected-page";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime } from "@/lib/format";
import { getIntelligence } from "@/lib/vision/client";

export const metadata = { title: "Intelligence" };

async function Insights() {
  const { insights, models } = await getIntelligence();

  return (
    <div className="space-y-6">
      <section aria-labelledby="insights-heading" className="space-y-3">
        <h2 id="insights-heading" className="text-lg font-medium">Insights</h2>
        {insights.length === 0 ? (
          <EmptyState title="No insights yet" />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {insights.map((i) => (
              <Card key={i.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">{i.title}</CardTitle>
                    <StatusBadge value={i.severity} />
                  </div>
                  <CardDescription>{formatDateTime(i.generated_at)}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{i.description}</CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="models-heading" className="space-y-3">
        <h2 id="models-heading" className="text-lg font-medium">Models</h2>
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Latency</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {models.map((m) => (
                <TableRow key={m.name}>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell>{m.version}</TableCell>
                  <TableCell><StatusBadge value={m.status} /></TableCell>
                  <TableCell className="text-right tabular-nums">{m.avg_latency_ms} ms</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}

export default function IntelligencePage() {
  return (
    <ProtectedPage>
      <PageHeader title="Intelligence" description="AI-assisted analysis and model health." />
      <Insights />
    </ProtectedPage>
  );
}