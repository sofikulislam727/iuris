import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/sign-in-form";
import { getSession } from "@/lib/auth-helpers";
import { APP_ROLES, hasAnyRole } from "@/lib/permissions";
import { safeRedirectPath } from "@/lib/safe-redirect";

export const metadata = { title: "Sign in · IURIS" };

async function SignInContent({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await getSession();
  if (
    session &&
    !session.user.banned &&
    hasAnyRole(session.user.role, APP_ROLES)
  ) {
    redirect("/dashboard");
  }

  const { next } = await searchParams;
  return <SignInForm next={safeRedirectPath(next)} />;
}

export default function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  return (
    <AuthShell
      title="Sign in"
      description="Use your institutional email and password."
      footer={
        <Link href="/forgot-password" className="underline underline-offset-4">
          Forgot your password?
        </Link>
      }
    >
      <Suspense fallback={<SignInForm next="/dashboard" />}>
        <SignInContent searchParams={searchParams} />
      </Suspense>
    </AuthShell>
  );
}