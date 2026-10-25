import { Badge } from "@/components/ui/badge";
import { titleCase } from "@/lib/format";
import { cn } from "@/lib/utils";

const GREEN = "border-emerald-500/40 bg-emerald-500/15 text-emerald-300";
const RED = "border-red-500/40 bg-red-500/15 text-red-300";
const ORANGE = "border-orange-500/40 bg-orange-500/15 text-orange-300";
const AMBER = "border-amber-500/40 bg-amber-500/15 text-amber-300";
const SKY = "border-sky-500/40 bg-sky-500/15 text-sky-300";
const GREY = "border-zinc-500/40 bg-zinc-500/15 text-zinc-300";

const TONES: Record<string, string> = {
  critical: RED, high: ORANGE, medium: AMBER, low: SKY,
  online: GREEN, degraded: AMBER, offline: GREY,
  healthy: GREEN, down: RED,
  open: RED, investigating: AMBER, resolved: GREEN, false_positive: GREY,
  new: RED, acknowledged: AMBER, dismissed: GREY,
};

export function StatusBadge({ value, className }: { value: string; className?: string }) {
  return (
    <Badge variant="outline" className={cn("whitespace-nowrap", TONES[value] ?? GREY, className)}>
      {titleCase(value)}
    </Badge>
  );
}