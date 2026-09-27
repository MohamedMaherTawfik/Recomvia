import { env } from "cloudflare:workers";
import type { ChatGPTUser } from "@/app/chatgpt-auth";
import { createId } from "@/lib/ids";

function database() {
  if (!env.DB) throw new Error("Authentication storage is unavailable.");
  return env.DB;
}

function authSecret() {
  const secret = env.AUTH_SECRET?.trim();
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET must contain at least 32 characters.");
  }
  return secret;
}

async function sessionTokenHash(token: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(authSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(token));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function upsertGoogleUser(input: {
  subject: string;
  email: string;
  displayName: string;
}): Promise<ChatGPTUser> {
  const db = database();
  const existing = await db.prepare(`
    SELECT id FROM users
    WHERE auth_provider = 'google' AND provider_subject = ?
    LIMIT 1
  `).bind(input.subject).first<{ id: string }>();

  if (existing) {
    await db.prepare(`
      UPDATE users
      SET email = ?, display_name = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND auth_provider = 'google' AND provider_subject = ?
    `).bind(input.email.toLowerCase(), input.displayName, existing.id, input.subject).run();
    return {
      userId: existing.id,
      email: input.email.toLowerCase(),
      displayName: input.displayName,
      fullName: input.displayName,
    };
  }

  const proposedId = createId("usr");
  await db.prepare(`
    INSERT INTO users (id, auth_provider, provider_subject, email, display_name)
    VALUES (?, 'google', ?, ?, ?)
    ON CONFLICT(auth_provider, provider_subject) DO UPDATE SET
      email = excluded.email,
      display_name = excluded.display_name,
      updated_at = CURRENT_TIMESTAMP
  `).bind(proposedId, input.subject, input.email.toLowerCase(), input.displayName).run();

  const user = await db.prepare(`
    SELECT id, email, display_name AS displayName
    FROM users
    WHERE auth_provider = 'google' AND provider_subject = ?
    LIMIT 1
  `).bind(input.subject).first<{ id: string; email: string; displayName: string | null }>();
  if (!user) throw new Error("Google user could not be created.");

  const displayName = user.displayName?.trim() || user.email;
  return { userId: user.id, email: user.email, displayName, fullName: user.displayName };
}

export async function createSession(userId: string, rawToken: string, expiresAt: Date) {
  await database().prepare(`
    INSERT INTO sessions (token_hash, user_id, expires_at)
    VALUES (?, ?, ?)
  `).bind(await sessionTokenHash(rawToken), userId, expiresAt.toISOString()).run();
}

export async function findSessionUser(rawToken: string): Promise<ChatGPTUser | null> {
  if (!rawToken || rawToken.length > 256) return null;
  const tokenHash = await sessionTokenHash(rawToken);
  const row = await database().prepare(`
    SELECT u.id AS userId, u.email, u.display_name AS fullName
    FROM sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.token_hash = ? AND datetime(s.expires_at) > CURRENT_TIMESTAMP
    LIMIT 1
  `).bind(tokenHash).first<{
    userId: string;
    email: string;
    fullName: string | null;
  }>();
  if (!row) return null;

  return {
    userId: row.userId,
    email: row.email,
    displayName: row.fullName?.trim() || row.email,
    fullName: row.fullName,
  };
}

export async function deleteSession(rawToken: string) {
  if (!rawToken || rawToken.length > 256) return;
  await database().prepare("DELETE FROM sessions WHERE token_hash = ?")
    .bind(await sessionTokenHash(rawToken)).run();
}
