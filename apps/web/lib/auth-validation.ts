import { z } from "zod";
import { APP_ROLES } from "@/lib/permissions";

const email = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Email is required")
  .max(254, "Email is too long")
  .email("Enter a valid email address");

export const passwordSchema = z
  .string()
  .min(12, "Use at least 12 characters")
  .max(128, "Use at most 128 characters")
  .refine(
    (p) => /[a-z]/i.test(p) && /\d/.test(p),
    "Include at least one letter and one number",
  );

export const signInSchema = z.object({
  email,
  password: z.string().min(1, "Password is required").max(128),
});

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const provisionUserSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  email,
  role: z.enum(APP_ROLES),
});

export type SignInValues = z.infer<typeof signInSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
export type ProvisionUserValues = z.infer<typeof provisionUserSchema>;