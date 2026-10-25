export function HourBars({ values }: { values: number[] }) {
  if (values.length === 0) return <p className="text-sm text-muted-foreground">No data.</p>;
  const max = Math.max(...values, 1);
  const peak = values.indexOf(Math.max(...values));

  return (
    <figure>
      <div
        role="img"
        aria-label={`Detections per hour. Peak at ${String(peak).padStart(2, "0")}:00 with ${values[peak]}.`}
        className="flex h-40 items-end gap-1"
      >
        {values.map((v, h) => (
          <div
            key={h}
            title={`${String(h).padStart(2, "0")}:00: ${v}`}
            className="flex-1 rounded-t bg-primary/70 transition-colors hover:bg-primary"
            style={{ height: `${Math.max((v / max) * 100, 2)}%` }}
          />
        ))}
      </div>
      <figcaption className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>00:00</span>
        <span>12:00</span>
        <span>23:00</span>
      </figcaption>
    </figure>
  );
}

export function BarList({ items }: { items: { label: string; value: number }[] }) {
  if (items.length === 0) return <p className="text-sm text-muted-foreground">No data.</p>;
  const max = Math.max(...items.map((i) => i.value), 1);

  return (
    <ul className="space-y-3">
      {items.map((i) => (
        <li key={i.label} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>{i.label}</span>
            <span className="tabular-nums text-muted-foreground">{i.value}</span>
          </div>
          <div className="h-2 rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-primary"
              style={{ width: `${(i.value / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}