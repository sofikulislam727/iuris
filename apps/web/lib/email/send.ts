import "server-only";
import { Resend } from "resend";
import { env } from "@/lib/env";
import { passwordResetEmail } from "@/lib/email/templates";

const resend = new Resend(env.RESEND_API_KEY);

export async function sendPasswordResetEmail(args: {
  to: string;
  name: string;
  url: string;
}) {
  const { subject, text, html } = passwordResetEmail({
    name: args.name,
    url: args.url,
  });

  try {
    const { error } = await resend.emails.send({
      from: env.EMAIL_FROM,
      to: args.to,
      subject,
      text,
      html,
    });
    if (error) console.error("[email] delivery failed:", error.name);
  } catch {
    console.error("[email] delivery threw");
  }
}