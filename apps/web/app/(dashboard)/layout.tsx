import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { ShieldCheck } from "lucide-react";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { requireSession } from "@/lib/auth-helpers";
import { roleLabel } from "@/lib/role-labels";

async function GuardedLayout({ children }: { children: ReactNode }) {
  const { user } = await requireSession();

  return (
    <div className="flex min-h-svh flex-col md:flex-row">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:shadow"
      >
        Skip to content
      </a>

      <aside className="flex flex-col gap-4 border-b p-3 md:w-60 md:shrink-0 md:border-r md:border-b-0 md:p-4">
        <div className="flex items-center gap-2 px-1">
          <ShieldCheck className="size-5 text-primary" aria-hidden="true" />
          <span className="font-semibold tracking-tight">IURIS</span>
        </div>

        <DashboardNav />

        <div className="mt-auto hidden space-y-3 border-t pt-4 md:block">
          <div className="px-1 text-sm">
            <p className="truncate font-medium">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            <p className="mt-1 text-xs text-muted-foreground">{roleLabel(user.role)}</p>
          </div>
          <Link
            href="/sign-out"
            prefetch={false}
            className={buttonVariants({ variant: "outline", size: "sm", className: "w-full" })}
          >
            Sign out
          </Link>
        </div>
      </aside>

      <main id="main" className="min-w-0 flex-1 p-4 md:p-6">
        {children}
      </main>

      {/* Mobile account bar (the sidebar footer is hidden below md) */}
      <div className="flex items-center justify-between gap-3 border-t p-3 text-sm md:hidden">
        <span className="truncate text-muted-foreground">{user.name}</span>
        <Link
          href="/sign-out"
          prefetch={false}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          Sign out
        </Link>
      </div>
    </div>
  );
}

function LayoutFallback() {
  return (
    <div className="flex min-h-svh flex-col md:flex-row" aria-busy="true">
      <div className="space-y-3 border-b p-4 md:w-60 md:border-r md:border-b-0">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
      <div className="flex-1 space-y-4 p-6">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<LayoutFallback />}>
      <GuardedLayout>{children}</GuardedLayout>
    </Suspense>
  );
}