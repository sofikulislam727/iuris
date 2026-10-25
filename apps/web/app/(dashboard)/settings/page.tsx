import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProtectedPage } from "@/components/dashboard/protected-page";
import { requireSession } from "@/lib/auth-helpers";
import { hasAnyRole } from "@/lib/permissions";

export const metadata = { title: "Settings · IURIS" };

async function SettingsLinks() {
  const { user } = await requireSession();
  const isAdmin = hasAnyRole(user.role, ["admin"]);

  const links = [
    { href: "/settings/profile", title: "Profile", text: "Your account details." },
    ...(isAdmin
      ? [
          { href: "/settings/users", title: "Users", text: "Create accounts, change roles, disable access." },
          { href: "/settings/system", title: "System", text: "Authentication and security policy." },
        ]
      : []),
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="block rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <Card className="h-full transition-colors hover:bg-accent/50">
            <CardHeader>
              <CardTitle>{l.title}</CardTitle>
              <CardDescription>{l.text}</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <ProtectedPage>
      <PageHeader title="Settings" description="Account and system settings." />
      <SettingsLinks />
    </ProtectedPage>
  );
}