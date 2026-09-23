import { env } from "cloudflare:workers";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { replyToSupportTicket } from "@/db/support";

export const runtime = "edge";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getChatGPTUser();
  if (!user || !env.RECOMVIA_ADMIN_USER_ID || user.userId !== env.RECOMVIA_ADMIN_USER_ID) {
    return Response.json({ error: "Not found." }, { status: 404 });
  }

  const { id: rawId } = await context.params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id < 1) {
    return Response.json({ error: "Invalid ticket." }, { status: 400 });
  }

  let payload: { reply?: unknown };
  try {
    payload = (await request.json()) as { reply?: unknown };
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }
  const reply = typeof payload.reply === "string" ? payload.reply.trim() : "";
  if (reply.length < 5 || reply.length > 4000) {
    return Response.json({ error: "Reply must be between 5 and 4,000 characters." }, { status: 400 });
  }

  try {
    const updated = await replyToSupportTicket(id, reply, user.userId);
    if (!updated) return Response.json({ error: "Ticket not found." }, { status: 404 });
    return Response.json({ ok: true, status: "answered" });
  } catch {
    return Response.json({ error: "Reply could not be saved." }, { status: 503 });
  }
}
