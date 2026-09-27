import { env } from "cloudflare:workers";
import {
  applicationUrl,
  OAUTH_NONCE_COOKIE,
  OAUTH_RETURN_COOKIE,
  OAUTH_STATE_COOKIE,
  OAUTH_VERIFIER_COOKIE,
  randomToken,
  redirectResponse,
  safeReturnPath,
  serializeCookie,
  sha256Base64Url,
} from "@/lib/auth-http";

export const runtime = "edge";

export async function GET(request: Request) {
  const clientId = env.GOOGLE_CLIENT_ID?.trim();
  if (!clientId) return Response.json({ error: "Google sign-in is not configured." }, { status: 503 });

  let appUrl: URL;
  try { appUrl = applicationUrl(env.APP_URL); }
  catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "APP_URL is invalid." }, { status: 503 });
  }

  const requestUrl = new URL(request.url);
  const state = randomToken();
  const nonce = randomToken();
  const verifier = randomToken(48);
  const returnTo = safeReturnPath(requestUrl.searchParams.get("return_to"));
  const redirectUri = new URL("/auth/google/callback", appUrl).toString();
  const authorizationUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authorizationUrl.search = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    nonce,
    code_challenge: await sha256Base64Url(verifier),
    code_challenge_method: "S256",
    prompt: "select_account",
  }).toString();

  const secure = appUrl.protocol === "https:";
  const cookieOptions = { maxAge: 600, path: "/auth/google/callback", secure };
  return redirectResponse(authorizationUrl.toString(), [
    serializeCookie(OAUTH_STATE_COOKIE, state, cookieOptions),
    serializeCookie(OAUTH_NONCE_COOKIE, nonce, cookieOptions),
    serializeCookie(OAUTH_VERIFIER_COOKIE, verifier, cookieOptions),
    serializeCookie(OAUTH_RETURN_COOKIE, returnTo, cookieOptions),
  ]);
}
