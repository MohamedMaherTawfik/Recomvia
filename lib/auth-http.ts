export const SESSION_COOKIE = "recomvia_session";
export const OAUTH_STATE_COOKIE = "recomvia_oauth_state";
export const OAUTH_VERIFIER_COOKIE = "recomvia_oauth_verifier";
export const OAUTH_NONCE_COOKIE = "recomvia_oauth_nonce";
export const OAUTH_RETURN_COOKIE = "recomvia_oauth_return";

const RESERVED_AUTH_PATHS = new Set([
  "/auth/google",
  "/auth/google/callback",
  "/auth/signout",
  "/signin-with-chatgpt",
  "/signout-with-chatgpt",
  "/callback",
]);

export function safeReturnPath(value: string | null | undefined) {
  if (!value?.startsWith("/") || value.startsWith("//")) return "/";
  try {
    const url = new URL(value, "https://app.local");
    if (url.origin !== "https://app.local" || RESERVED_AUTH_PATHS.has(url.pathname)) return "/";
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "/";
  }
}

export function parseCookies(request: Request) {
  const output = new Map<string, string>();
  for (const part of (request.headers.get("Cookie") || "").split(";")) {
    const separator = part.indexOf("=");
    if (separator < 1) continue;
    const name = part.slice(0, separator).trim();
    const value = part.slice(separator + 1).trim();
    try { output.set(name, decodeURIComponent(value)); }
    catch { output.set(name, value); }
  }
  return output;
}

export function serializeCookie(name: string, value: string, options: {
  maxAge: number;
  path?: string;
  secure: boolean;
}) {
  return [
    `${name}=${encodeURIComponent(value)}`,
    `Path=${options.path || "/"}`,
    `Max-Age=${Math.max(0, Math.floor(options.maxAge))}`,
    "HttpOnly",
    "SameSite=Lax",
    options.secure ? "Secure" : "",
  ].filter(Boolean).join("; ");
}

export function clearCookie(name: string, secure: boolean, path = "/") {
  return serializeCookie(name, "", { maxAge: 0, path, secure });
}

export function randomToken(bytes = 32) {
  const values = crypto.getRandomValues(new Uint8Array(bytes));
  let binary = "";
  for (const value of values) binary += String.fromCharCode(value);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export async function sha256Base64Url(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  let binary = "";
  for (const byte of new Uint8Array(digest)) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function timingSafeEqual(left: string, right: string) {
  const leftBytes = new TextEncoder().encode(left);
  const rightBytes = new TextEncoder().encode(right);
  let difference = leftBytes.length ^ rightBytes.length;
  const length = Math.max(leftBytes.length, rightBytes.length);
  for (let index = 0; index < length; index++) {
    difference |= (leftBytes[index] || 0) ^ (rightBytes[index] || 0);
  }
  return difference === 0;
}

export function redirectResponse(location: string, cookies: string[] = []) {
  const headers = new Headers({ Location: location, "Cache-Control": "private, no-store" });
  for (const cookie of cookies) headers.append("Set-Cookie", cookie);
  return new Response(null, { status: 302, headers });
}

export function applicationUrl(rawValue: string | undefined) {
  if (!rawValue) throw new Error("APP_URL is not configured.");
  const url = new URL(rawValue);
  const localhost = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if (url.protocol !== "https:" && !localhost) throw new Error("APP_URL must use HTTPS.");
  return new URL(url.origin);
}
