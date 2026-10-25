import { Suspense, type ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { requireRole } from "@/lib/auth-helpers";
import { APP_ROLES, type AppRole } from "@/lib/permissions";

async function RoleGate({
  roles,
  children,
}: {
  roles: readonly AppRole[];
  children: ReactNode;
}) {
  await requireRole(roles);
  return <>{children}</>;
}

function PageSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-4 w-80 max-w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}

export function ProtectedPage({
  roles = APP_ROLES,
  children,
}: {
  roles?: readonly AppRole[];
  children: ReactNode;
}) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <RoleGate roles={roles}>{children}</RoleGate>
    </Suspense>
  );
}