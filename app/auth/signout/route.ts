import { env } from "cloudflare:workers";
import { deleteSession } from "@/db/auth";
import {
  applicationUrl,
  clearCookie,
  parseCookies,
  redirectResponse,
  safeReturnPath,
  SESSION_COOKIE,
} from "@/lib/auth-http";

export const runtime = "edge";

export async function POST(request: Request) {
  let appUrl: URL;
  try { appUrl = applicationUrl(env.APP_URL); }
  catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "APP_URL is invalid." }, { status: 503 });
  }

  const origin = request.headers.get("Origin");
  if (origin && origin !== appUrl.origin) return Response.json({ error: "Forbidden." }, { status: 403 });
  const token = parseCookies(request).get(SESSION_COOKIE);
  if (token) await deleteSession(token).catch(() => undefined);

  const returnTo = safeReturnPath(new URL(request.url).searchParams.get("return_to"));
  return redirectResponse(new URL(returnTo, appUrl).toString(), [
    clearCookie(SESSION_COOKIE, appUrl.protocol === "https:"),
  ]);
}

export function GET() {
  return Response.json({ error: "Use POST to sign out." }, { status: 405, headers: { Allow: "POST" } });
}
