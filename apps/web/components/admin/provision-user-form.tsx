"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { provisionUserAction } from "@/app/(dashboard)/settings/users/actions";
import { AuthField } from "@/components/auth/auth-field";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  provisionUserSchema,
  type ProvisionUserValues,
} from "@/lib/auth-validation";

export function ProvisionUserForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProvisionUserValues>({
    resolver: zodResolver(provisionUserSchema),
    defaultValues: { name: "", email: "", role: "security_officer" },
  });

  async function onSubmit(values: ProvisionUserValues) {
    const result = await provisionUserAction(values);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Account created. A password-setup email has been sent.");
    reset();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid max-w-xl gap-4 sm:grid-cols-2">
      <AuthField label="Full name" autoComplete="off" error={errors.name?.message} {...register("name")} />
      <AuthField label="Institutional email" type="email" autoComplete="off" error={errors.email?.message} {...register("email")} />

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <select
          id="role"
          className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          {...register("role")}
        >
          <option value="security_officer">Security officer</option>
          <option value="admin">Administrator</option>
        </select>
        {errors.role ? (
          <p role="alert" className="text-sm text-destructive">{errors.role.message}</p>
        ) : null}
      </div>

      <div className="flex items-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
          {isSubmitting ? "Creating…" : "Create account"}
        </Button>
      </div>
    </form>
  );
}