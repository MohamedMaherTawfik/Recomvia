type GoogleIdClaims = {
  iss?: unknown;
  aud?: unknown;
  azp?: unknown;
  sub?: unknown;
  email?: unknown;
  email_verified?: unknown;
  name?: unknown;
  nonce?: unknown;
  exp?: unknown;
  iat?: unknown;
};

type GoogleJwk = JsonWebKey & { kid?: string; alg?: string; use?: string };

let cachedKeys: { expiresAt: number; keys: GoogleJwk[] } | null = null;

function decodeBase64Url(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(base64);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function decodeJson<T>(value: string): T {
  return JSON.parse(new TextDecoder().decode(decodeBase64Url(value))) as T;
}

async function googleKeys() {
  if (cachedKeys && cachedKeys.expiresAt > Date.now()) return cachedKeys.keys;
  const response = await fetch("https://www.googleapis.com/oauth2/v3/certs", {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error("Google signing keys are unavailable.");
  const payload = await response.json() as { keys?: GoogleJwk[] };
  if (!Array.isArray(payload.keys) || payload.keys.length === 0) {
    throw new Error("Google signing keys are invalid.");
  }
  const maxAge = /max-age=(\d+)/i.exec(response.headers.get("Cache-Control") || "")?.[1];
  cachedKeys = { expiresAt: Date.now() + Math.min(Number(maxAge || 300), 3600) * 1000, keys: payload.keys };
  return payload.keys;
}

function stringClaim(value: unknown, name: string) {
  if (typeof value !== "string" || !value) throw new Error(`Google ID token is missing ${name}.`);
  return value;
}

export async function exchangeGoogleCode(input: {
  code: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  codeVerifier: string;
}) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: input.code,
      client_id: input.clientId,
      client_secret: input.clientSecret,
      redirect_uri: input.redirectUri,
      code_verifier: input.codeVerifier,
    }),
  });
  const payload = await response.json() as { id_token?: unknown; error?: unknown };
  if (!response.ok || typeof payload.id_token !== "string") {
    throw new Error(`Google token exchange failed${typeof payload.error === "string" ? `: ${payload.error}` : "."}`);
  }
  return payload.id_token;
}

export async function verifyGoogleIdToken(idToken: string, input: {
  clientId: string;
  nonce: string;
}) {
  const parts = idToken.split(".");
  if (parts.length !== 3) throw new Error("Google ID token is malformed.");
  const [encodedHeader, encodedClaims, encodedSignature] = parts;
  const header = decodeJson<{ alg?: unknown; kid?: unknown }>(encodedHeader);
  if (header.alg !== "RS256" || typeof header.kid !== "string") {
    throw new Error("Google ID token uses an unsupported signature.");
  }
  const jwk = (await googleKeys()).find((candidate) => candidate.kid === header.kid && candidate.alg === "RS256");
  if (!jwk) throw new Error("Google ID token signing key was not found.");
  const key = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"],
  );
  const valid = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    key,
    decodeBase64Url(encodedSignature),
    new TextEncoder().encode(`${encodedHeader}.${encodedClaims}`),
  );
  if (!valid) throw new Error("Google ID token signature is invalid.");

  const claims = decodeJson<GoogleIdClaims>(encodedClaims);
  if (claims.iss !== "https://accounts.google.com" && claims.iss !== "accounts.google.com") {
    throw new Error("Google ID token issuer is invalid.");
  }
  const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  if (!audiences.includes(input.clientId)) throw new Error("Google ID token audience is invalid.");
  if (audiences.length > 1 && claims.azp !== input.clientId) throw new Error("Google ID token authorized party is invalid.");
  const now = Math.floor(Date.now() / 1000);
  if (typeof claims.exp !== "number" || claims.exp <= now - 30) throw new Error("Google ID token has expired.");
  if (typeof claims.iat !== "number" || claims.iat > now + 60) throw new Error("Google ID token issue time is invalid.");
  if (claims.nonce !== input.nonce) throw new Error("Google ID token nonce is invalid.");
  if (claims.email_verified !== true && claims.email_verified !== "true") {
    throw new Error("Google account email is not verified.");
  }

  const subject = stringClaim(claims.sub, "sub");
  const email = stringClaim(claims.email, "email").toLowerCase();
  const displayName = typeof claims.name === "string" && claims.name.trim() ? claims.name.trim() : email;
  return { subject, email, displayName };
}
