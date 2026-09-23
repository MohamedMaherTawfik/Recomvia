import { getChatGPTUser } from "@/app/chatgpt-auth";
import { createSupportTicket } from "@/db/support";

export const runtime = "edge";

type TicketRequest = {
  name?: unknown;
  email?: unknown;
  question?: unknown;
  pageUrl?: unknown;
  companyWebsite?: unknown;
};

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function validEmail(value: string) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function safePageUrl(value: string) {
  if (!value || value.length > 500) return "";
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    const url = new URL(value);
    return url.pathname + url.search;
  } catch {
    return "";
  }
}

function randomToken(bytes = 18) {
  const values = crypto.getRandomValues(new Uint8Array(bytes));
  return Array.from(values, (value) => value.toString(16).padStart(2, "0")).join("");
}

async function hash(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: Request) {
  let payload: TicketRequest;
  try {
    payload = (await request.json()) as TicketRequest;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (clean(payload.companyWebsite)) {
    return Response.json({ error: "Request rejected." }, { status: 400 });
  }

  const name = clean(payload.name);
  const email = clean(payload.email).toLowerCase();
  const question = clean(payload.question);
  const pageUrl = safePageUrl(clean(payload.pageUrl));

  if (name.length < 2 || name.length > 80) {
    return Response.json({ error: "Please enter a valid name." }, { status: 400 });
  }
  if (!validEmail(email)) {
    return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (question.length < 10 || question.length > 2000) {
    return Response.json({ error: "Question must be between 10 and 2,000 characters." }, { status: 400 });
  }

  const accessKey = randomToken();
  const publicId = `RCV-${Date.now().toString(36).toUpperCase()}-${randomToken(3).toUpperCase()}`;
  const user = await getChatGPTUser();

  try {
    await createSupportTicket({
      publicId,
      accessKeyHash: await hash(accessKey),
      requesterName: name,
      requesterEmail: email,
      authenticatedUserId: user?.userId ?? null,
      question,
      pageUrl,
    });
  } catch {
    return Response.json({ error: "Support is temporarily unavailable. Please try again shortly." }, { status: 503 });
  }

  return Response.json(
    {
      reference: publicId,
      accessKey,
      status: "open",
      message: "Your question is in the human support queue.",
    },
    { status: 201, headers: { "Cache-Control": "no-store" } },
  );
}
