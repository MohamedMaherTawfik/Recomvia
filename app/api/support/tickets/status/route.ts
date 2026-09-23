import { findTicketForRequester } from "@/db/support";

export const runtime = "edge";

async function hash(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: Request) {
  let payload: { reference?: unknown; accessKey?: unknown };
  try {
    payload = (await request.json()) as { reference?: unknown; accessKey?: unknown };
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const reference = typeof payload.reference === "string" ? payload.reference.trim().toUpperCase() : "";
  const accessKey = typeof payload.accessKey === "string" ? payload.accessKey.trim() : "";
  if (!/^RCV-[A-Z0-9]+-[A-F0-9]{6}$/.test(reference) || accessKey.length !== 36) {
    return Response.json({ error: "Ticket not found." }, { status: 404 });
  }

  try {
    const ticket = await findTicketForRequester(reference, await hash(accessKey));
    if (!ticket) return Response.json({ error: "Ticket not found." }, { status: 404 });
    return Response.json(ticket, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Support status is temporarily unavailable." }, { status: 503 });
  }
}
