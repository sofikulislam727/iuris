export function safeRedirectPath(
  value: string | null | undefined,
  fallback = "/dashboard",
): string {
  if (!value) return fallback;
  if (!value.startsWith("/")) return fallback;
  if (value.startsWith("//") || value.includes("\\")) return fallback;
  if (Array.from(value).some((c) => c.charCodeAt(0) < 32)) return fallback;
  if (value.startsWith("/sign-in") || value.startsWith("/sign-out")) {
    return fallback;
  }

  try {
    const url = new URL(value, "http://localhost");
    if (url.origin !== "http://localhost") return fallback;
    return url.pathname + url.search + url.hash;
  } catch {
    return fallback;
  }
}