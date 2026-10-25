import Link from "next/link";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProtectedPage } from "@/components/dashboard/protected-page";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime, titleCase } from "@/lib/format";
import { listEvidence } from "@/lib/vision/client";

export const metadata = { title: "Evidence" };

async function EvidenceTable() {
  const items = await listEvidence();
  if (items.length === 0) return <EmptyState title="No evidence stored" />;

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Camera</TableHead>
            <TableHead>Captured</TableHead>
            <TableHead className="text-right">Size</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((e) => (
            <TableRow key={e.id}>
              <TableCell>
                <Link href={`/evidence/${e.id}`} className="font-medium underline-offset-4 hover:underline">
                  {e.title}
                </Link>
                <p className="text-xs text-muted-foreground">{e.id}</p>
              </TableCell>
              <TableCell><Badge variant="outline">{titleCase(e.type)}</Badge></TableCell>
              <TableCell>{e.camera_name}</TableCell>
              <TableCell>{formatDateTime(e.captured_at)}</TableCell>
              <TableCell className="text-right tabular-nums">{e.size_mb} MB</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function EvidencePage() {
  return (
    <ProtectedPage>
      <PageHeader title="Evidence" description="Stored clips and snapshots linked to incidents." />
      <EvidenceTable />
    </ProtectedPage>
  );
}