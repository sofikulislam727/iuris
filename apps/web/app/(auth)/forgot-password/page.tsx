import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata = { title: "Forgot password · IURIS" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Forgot password"
      description="Enter your institutional email to receive a reset link."
      footer={
        <Link href="/sign-in" className="underline underline-offset-4">
          Back to sign in
        </Link>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}