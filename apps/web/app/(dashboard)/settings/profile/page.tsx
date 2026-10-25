import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProtectedPage } from "@/components/dashboard/protected-page";
import { requireSession } from "@/lib/auth-helpers";
import { roleLabel } from "@/lib/role-labels";

export const metadata = { title: "Profile · IURIS" };

async function ProfileCard() {
  const { user } = await requireSession();
  const rows = [
    ["Name", user.name],
    ["Email", user.email],
    ["Role", roleLabel(user.role)],
  ] as const;

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Your account</CardTitle>
        <CardDescription>Only an administrator can change your name, email or role.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <dl className="space-y-3 text-sm">
          {rows.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="truncate font-medium">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="text-sm text-muted-foreground">
          To change your password, use{" "}
          <Link href="/forgot-password" className="underline underline-offset-4">
            Forgot password
          </Link>
          .
        </p>
      </CardContent>
    </Card>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedPage>
      <PageHeader title="Profile" description="Your account details." />
      <ProfileCard />
    </ProtectedPage>
  );
}