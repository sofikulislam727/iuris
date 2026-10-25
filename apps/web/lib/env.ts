import "server-only";
import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().min(1),
  BETTER_AUTH_SECRET: z.string().min(32, "must be at least 32 characters"),
  BETTER_AUTH_URL: z.string().url(),
  RESEND_API_KEY: z.string().min(1),
  EMAIL_FROM: z.string().min(3),
  ALLOWED_EMAIL_DOMAINS: z.string().optional().default(""),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  // Field names only. Values are never printed.
  console.error(
    "Invalid environment variables:",
    Object.keys(parsed.error.flatten().fieldErrors).join(", "),
  );
  throw new Error("Invalid environment variables");
}

export const env = {
  ...parsed.data,
  allowedEmailDomains: parsed.data.ALLOWED_EMAIL_DOMAINS.split(",")
    .map((d) => d.trim().toLowerCase().replace(/^@/, ""))
    .filter(Boolean),
};