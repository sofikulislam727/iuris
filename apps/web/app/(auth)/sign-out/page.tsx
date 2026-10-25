import { AuthShell } from "@/components/auth/auth-shell";
import { SignOutRunner } from "@/components/auth/sign-out-runner";

export const metadata = { title: "Signing out · IURIS" };

export default function SignOutPage() {
  return (
    <AuthShell title="Signing out">
      <SignOutRunner />
    </AuthShell>
  );
}