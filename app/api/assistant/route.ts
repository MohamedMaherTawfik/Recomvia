import { searchKnowledge } from "@/lib/knowledge-base";

export const runtime = "edge";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const question =
    payload && typeof payload === "object" && typeof (payload as { question?: unknown }).question === "string"
      ? (payload as { question: string }).question.trim()
      : "";

  if (question.length < 2 || question.length > 600) {
    return Response.json({ error: "Question must be between 2 and 600 characters." }, { status: 400 });
  }

  return Response.json(searchKnowledge(question), {
    headers: { "Cache-Control": "no-store" },
  });
}
