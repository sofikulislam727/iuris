"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Archive,
  Bell,
  Brain,
  Camera,
  ChartColumn,
  FileText,
  History,
  LayoutDashboard,
  Radio,
  Settings,
  Siren,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/monitoring", label: "Monitoring", icon: Radio },
  { href: "/cameras", label: "Cameras", icon: Camera },
  { href: "/incidents", label: "Incidents", icon: Siren },
  { href: "/alerts", label: "Alerts", icon: Bell },
  { href: "/intelligence", label: "Intelligence", icon: Brain },
  { href: "/evidence", label: "Evidence", icon: Archive },
  { href: "/analytics", label: "Analytics", icon: ChartColumn },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/activity", label: "Activity", icon: History, adminOnly: true },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export function DashboardNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const items = ITEMS.filter((i) => !("adminOnly" in i) || isAdmin);

  return (
    <nav aria-label="Main" className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              "focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none",
              active && "bg-sidebar-accent text-sidebar-accent-foreground",
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}