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
import {
  resetPasswordSchema,
  type ResetPasswordValues,
} from "@/lib/auth-validation";

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const busy = isSubmitting || done;

  async function onSubmit(values: ResetPasswordValues) {
    const { error } = await authClient.resetPassword({
      newPassword: values.password,
      token,
    });

    if (error) {
      toast.error(
        error.status === 429
          ? "Too many attempts. Please wait and try again."
          : "This link is invalid or has expired, or the password was rejected. Request a new link if needed.",
      );
      return;
    }

    toast.success("Password updated. Please sign in.");
    setDone(true);
    router.replace("/sign-in");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <AuthField
        label="New password"
        type="password"
        autoComplete="new-password"
        description="At least 12 characters, with a letter and a number."
        error={errors.password?.message}
        {...register("password")}
      />
      <AuthField
        label="Confirm new password"
        type="password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />
      <Button type="submit" className="w-full" disabled={busy}>
        {busy ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
        {busy ? "Saving…" : "Set password"}
      </Button>
    </form>
  );
}