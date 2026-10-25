const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export function passwordResetEmail({ name, url }: { name: string; url: string }) {
  const subject = "Set or reset your IURIS password";

  const text = [
    `Hello ${name},`,
    "",
    "Use the link below to set or reset your IURIS password.",
    "The link expires in 1 hour and can be used once.",
    "",
    url,
    "",
    "If you did not expect this email, you can ignore it.",
  ].join("\n");

  const html = `<!doctype html>
<html><body style="font-family:system-ui,sans-serif;background:#f4f4f5;padding:24px">
  <table role="presentation" width="100%" style="max-width:480px;margin:auto;background:#ffffff;border-radius:8px;padding:24px">
    <tr><td>
      <h1 style="font-size:18px;margin:0 0 16px">IURIS &mdash; Campus Security</h1>
      <p>Hello ${esc(name)},</p>
      <p>Use the button below to set or reset your password. The link expires in 1 hour and can be used once.</p>
      <p style="margin:24px 0"><a href="${esc(url)}" style="background:#111827;color:#ffffff;padding:10px 16px;border-radius:6px;text-decoration:none;display:inline-block">Set password</a></p>
      <p style="font-size:12px;color:#6b7280">If you did not expect this email, you can ignore it.</p>
    </td></tr>
  </table>
</body></html>`;

  return { subject, text, html };
}