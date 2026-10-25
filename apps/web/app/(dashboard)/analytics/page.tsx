import { Activity, Siren, Target } from "lucide-react";
import { BarList, HourBars } from "@/components/dashboard/bars";
import { FilterTabs } from "@/components/dashboard/filter-tabs";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProtectedPage } from "@/components/dashboard/protected-page";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPercent, titleCase } from "@/lib/format";
import { getAnalytics } from "@/lib/vision/client";
import { ANALYTICS_RANGES } from "@/lib/vision/types";

export const metadata = { title: "Analytics" };

const RANGE_LABELS = { "24h": "Last 24 hours", "7d": "Last 7 days", "30d": "Last 30 days" } as const;

async function AnalyticsContent({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const { range } = await searchParams;
  const selected = ANALYTICS_RANGES.find((r) => r === range) ?? "24h";
  const data = await getAnalytics(selected);

  return (
    <>
      <FilterTabs
        label="Select time range"
        items={ANALYTICS_RANGES.map((r) => ({
          label: RANGE_LABELS[r],
          href: `/analytics?range=${r}`,
          active: selected === r,
        }))}
      />
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Detections" value={data.total_detections} icon={<Activity className="size-5" />} />
          <StatCard label="Incidents" value={data.total_incidents} icon={<Siren className="size-5" />} />
          <StatCard label="Average confidence" value={formatPercent(data.avg_confidence)} icon={<Target className="size-5" />} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detections by hour</CardTitle>
            <CardDescription>Hours are in Asia/Dhaka time.</CardDescription>
          </CardHeader>
          <CardContent><HourBars values={data.detections_by_hour} /></CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Incidents by type</CardTitle></CardHeader>
            <CardContent>
              <BarList items={data.incidents_by_kind.map((k) => ({ label: titleCase(k.kind), value: k.count }))} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Busiest cameras</CardTitle></CardHeader>
            <CardContent>
              <BarList items={data.top_cameras.map((c) => ({ label: c.camera_name, value: c.count }))} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

export default function AnalyticsPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  return (
    <ProtectedPage>
      <PageHeader title="Analytics" description="Trends across cameras, incidents and detections." />
      <AnalyticsContent searchParams={searchParams} />
    </ProtectedPage>
  );
}