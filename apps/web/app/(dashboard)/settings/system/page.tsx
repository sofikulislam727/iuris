import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProtectedPage } from "@/components/dashboard/protected-page";

export const metadata = { title: "System · IURIS" };

const POLICY = [
  ["Registration", "Disabled (administrator-provisioned only)"],
  ["Session lifetime", "8 hours, refreshed at most hourly"],
  ["Minimum password length", "12 characters"],
  ["Sign-in rate limit", "5 attempts per 5 minutes"],
  ["Reset-request rate limit", "3 requests per hour"],
  ["Reset link validity", "1 hour, single use"],
  ["Sessions on password reset", "All sessions revoked"],
] as const;

export default function SystemPage() {
  return (
    <ProtectedPage roles={["admin"]}>
      <PageHeader title="System" description="Authentication and security policy." />
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Authentication policy</CardTitle>
          <CardDescription>Read-only. Configured in the server auth settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="space-y-3 text-sm">
            {POLICY.map(([label, value]) => (
              <div key={label} className="flex flex-wrap justify-between gap-2">
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </ProtectedPage>
  );
}