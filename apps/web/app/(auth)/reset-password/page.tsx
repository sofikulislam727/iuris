import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Reset password · IURIS",
  referrer: "no-referrer",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const { token, error } = await searchParams;

  if (!token || error) {
    return (
      <AuthShell title="Reset password">
        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertTitle>Link invalid or expired</AlertTitle>
            <AlertDescription>
              This password link can no longer be used. Request a new one.
            </AlertDescription>
          </Alert>
          <Button
            className="w-full"
            render={<Link href="/forgot-password" />}
            >
            Request a new link
            </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Set a new password"
      description="Choose a strong password you don't use elsewhere."
    >
      <ResetPasswordForm token={token} />
    </AuthShell>
  );
}