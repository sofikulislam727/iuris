import type { ReactNode } from "react";

export function DetailList({ items }: { items: [string, ReactNode][] }) {
  return (
    <dl className="space-y-3 text-sm">
      {items.map(([label, value]) => (
        <div key={label} className="flex flex-wrap justify-between gap-x-4 gap-y-1">
          <dt className="text-muted-foreground">{label}</dt>
          <dd className="text-right font-medium wrap-break-word">{value}</dd>
        </div>
      ))}
    </dl>
  );
}