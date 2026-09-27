import { env } from "cloudflare:workers";
import { createSession, deleteSession, upsertGoogleUser } from "@/db/auth";
import { ensureWorkspace } from "@/db/product";
import {
  applicationUrl,
  clearCookie,
  OAUTH_NONCE_COOKIE,
  OAUTH_RETURN_COOKIE,
  OAUTH_STATE_COOKIE,
  OAUTH_VERIFIER_COOKIE,
  parseCookies,
  randomToken,
  redirectResponse,
  safeReturnPath,
  serializeCookie,
  SESSION_COOKIE,
  timingSafeEqual,
} from "@/lib/auth-http";
import { exchangeGoogleCode, verifyGoogleIdToken } from "@/lib/google-oidc";

export const runtime = "edge";

const SESSION_SECONDS = 60 * 60 * 24 * 30;

function clearedOAuthCookies(secure: boolean) {
  return [OAUTH_STATE_COOKIE, OAUTH_NONCE_COOKIE, OAUTH_VERIFIER_COOKIE, OAUTH_RETURN_COOKIE]
    .map((name) => clearCookie(name, secure, "/auth/google/callback"));
}

export async function GET(request: Request) {
  let appUrl: URL;
  try { appUrl = applicationUrl(env.APP_URL); }
  catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "APP_URL is invalid." }, { status: 503 });
  }
  const secure = appUrl.protocol === "https:";
  const requestUrl = new URL(request.url);
  const cookies = parseCookies(request);
  const state = requestUrl.searchParams.get("state") || "";
  const expectedState = cookies.get(OAUTH_STATE_COOKIE) || "";
  const code = requestUrl.searchParams.get("code") || "";
  const verifier = cookies.get(OAUTH_VERIFIER_COOKIE) || "";
  const nonce = cookies.get(OAUTH_NONCE_COOKIE) || "";
  const returnTo = safeReturnPath(cookies.get(OAUTH_RETURN_COOKIE));
  const clearOAuth = clearedOAuthCookies(secure);

  if (requestUrl.searchParams.has("error")) {
    return redirectResponse(new URL("/?auth_error=google_denied", appUrl).toString(), clearOAuth);
  }
  if (!state || !expectedState || !timingSafeEqual(state, expectedState) || !code || !verifier || !nonce) {
    return redirectResponse(new URL("/?auth_error=invalid_oauth_state", appUrl).toString(), clearOAuth);
  }

  const clientId = env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = env.GOOGLE_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) {
    return Response.json({ error: "Google sign-in is not configured." }, { status: 503 });
  }

  try {
    const redirectUri = new URL("/auth/google/callback", appUrl).toString();
    const idToken = await exchangeGoogleCode({ code, clientId, clientSecret, redirectUri, codeVerifier: verifier });
    const profile = await verifyGoogleIdToken(idToken, { clientId, nonce });
    const user = await upsertGoogleUser(profile);
    await ensureWorkspace(user);

    const existingSession = cookies.get(SESSION_COOKIE);
    if (existingSession) await deleteSession(existingSession).catch(() => undefined);
    const rawSessionToken = randomToken(48);
    await createSession(user.userId, rawSessionToken, new Date(Date.now() + SESSION_SECONDS * 1000));

    return redirectResponse(new URL(returnTo, appUrl).toString(), [
      ...clearOAuth,
      serializeCookie(SESSION_COOKIE, rawSessionToken, { maxAge: SESSION_SECONDS, secure }),
    ]);
  } catch (error) {
    console.error("Google OAuth callback failed", error instanceof Error ? error.message : "Unknown error");
    return redirectResponse(new URL("/?auth_error=google_callback_failed", appUrl).toString(), clearOAuth);
  }
}
