"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { AuthField } from "@/components/auth/auth-field";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { signInSchema, type SignInValues } from "@/lib/auth-validation";

export function SignInForm({ next }: { next: string }) {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const busy = isSubmitting || redirecting;

  async function onSubmit(values: SignInValues) {
    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    });

    if (error) {
      toast.error(
        error.status === 429
          ? "Too many attempts. Please wait a few minutes and try again."
          : error.status === 403
            ? "This account cannot sign in. Contact an administrator."
            : "Invalid email or password.",
      );
      return;
    }

    toast.success("Signed in successfully.");
    setRedirecting(true);
    router.replace(next);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <AuthField
        label="Institutional email"
        type="email"
        autoComplete="username"
        inputMode="email"
        placeholder="name@std.iu.ac.bd"
        error={errors.email?.message}
        {...register("email")}
      />
      <AuthField
        label="Password"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />
      <Button type="submit" className="w-full" disabled={busy}>
        {busy ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
        {busy ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}