/**
 * Validates and sanitizes a redirect URL to prevent Open Redirect attacks.
 * Strictly permits only internal relative paths.
 * 
 * Rejects:
 * - https://malicious.com
 * - //evil.com (protocol-relative)
 * - javascript:alert(1)
 * - /\\evil.com
 * 
 * @param path - The requested redirect path
 * @param fallback - Safe default fallback path (defaults to '/account')
 * @returns A safe relative path
 */
export function validateRedirectPath(
  path?: string | null,
  fallback: string = "/account"
): string {
  if (!path || typeof path !== "string") {
    return fallback;
  }

  const trimmed = path.trim();

  // Must start with a single slash
  if (!trimmed.startsWith("/")) {
    return fallback;
  }

  // Must not start with // (protocol-relative) or /\ (backslash bypass)
  if (trimmed.startsWith("//") || trimmed.startsWith("/\\") || trimmed.includes("\\")) {
    return fallback;
  }

  // Must not contain URL scheme/protocol colons (e.g., javascript:, http:)
  if (trimmed.includes(":")) {
    return fallback;
  }

  // Must not redirect to /auth to prevent redirect loops
  if (trimmed === "/auth" || trimmed.startsWith("/auth?")) {
    return fallback;
  }

  return trimmed;
}
