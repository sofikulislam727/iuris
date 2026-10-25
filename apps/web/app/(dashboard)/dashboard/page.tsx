import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProtectedPage } from "@/components/dashboard/protected-page";
import { requireSession } from "@/lib/auth-helpers";
import { roleLabel } from "@/lib/role-labels";

export const metadata = { title: "Dashboard · IURIS" };

const MODULES = [
  { href: "/monitoring", title: "Live monitoring", text: "Watch live camera feeds and detections." },
  { href: "/cameras", title: "Cameras", text: "Browse and manage campus cameras." },
  { href: "/incidents", title: "Incidents", text: "Review and track security incidents." },
  { href: "/alerts", title: "Alerts", text: "See active and past alerts." },
  { href: "/evidence", title: "Evidence", text: "Access stored clips and snapshots." },
  { href: "/reports", title: "Reports", text: "Generate and download reports." },
];

async function Welcome() {
  const { user } = await requireSession();
  return (
    <PageHeader
      title={`Welcome, ${user.name}`}
      description={`Signed in as ${roleLabel(user.role)}.`}
    />
  );
}

export default function DashboardPage() {
  return (
    <ProtectedPage>
      <Welcome />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {MODULES.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="block rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <Card className="h-full transition-colors hover:bg-accent/50">
              <CardHeader>
                <CardTitle>{m.title}</CardTitle>
                <CardDescription>{m.text}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </ProtectedPage>
  );
}