import Link from "next/link";
import { cn } from "@/lib/utils";

export function FilterTabs({
  label,
  items,
}: {
  label: string;
  items: { label: string; href: string; active: boolean }[];
}) {
  return (
    <nav aria-label={label} className="mb-4 flex flex-wrap gap-2">
      {items.map((i) => (
        <Link
          key={i.href}
          href={i.href}
          aria-current={i.active ? "page" : undefined}
          className={cn(
            "rounded-full border px-3 py-1 text-sm transition-colors hover:bg-accent",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
            i.active && "border-primary/50 bg-accent text-accent-foreground",
          )}
        >
          {i.label}
        </Link>
      ))}
    </nav>
  );
}