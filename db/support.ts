import { env } from "cloudflare:workers";

export type SupportTicket = {
  id: number;
  publicId: string;
  requesterName: string;
  requesterEmail: string;
  question: string;
  pageUrl: string;
  status: string;
  humanReply: string | null;
  createdAt: string;
  updatedAt: string;
  answeredAt: string | null;
};

function database() {
  if (!env.DB) throw new Error("Support storage is temporarily unavailable.");
  return env.DB;
}

export async function createSupportTicket(input: {
  publicId: string;
  accessKeyHash: string;
  requesterName: string;
  requesterEmail: string;
  authenticatedUserId: string | null;
  question: string;
  pageUrl: string;
}) {
  await database().prepare(`
    INSERT INTO support_tickets
      (public_id, access_key_hash, requester_name, requester_email, authenticated_user_id, question, page_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(input.publicId,input.accessKeyHash,input.requesterName,input.requesterEmail,input.authenticatedUserId,input.question,input.pageUrl).run();
  return { publicId: input.publicId };
}

export async function findTicketForRequester(publicId: string, accessKeyHash: string) {
  return database().prepare(`
    SELECT public_id AS publicId, status, human_reply AS humanReply,
      created_at AS createdAt, updated_at AS updatedAt, answered_at AS answeredAt
    FROM support_tickets
    WHERE public_id = ? AND access_key_hash = ?
    LIMIT 1
  `).bind(publicId,accessKeyHash).first<Pick<SupportTicket,"publicId"|"status"|"humanReply"|"createdAt"|"updatedAt"|"answeredAt">>();
}

export async function listSupportTickets() {
  const result=await database().prepare(`
    SELECT id, public_id AS publicId, requester_name AS requesterName,
      requester_email AS requesterEmail, question, page_url AS pageUrl,
      status, human_reply AS humanReply, created_at AS createdAt,
      updated_at AS updatedAt, answered_at AS answeredAt
    FROM support_tickets
    ORDER BY CASE status WHEN 'open' THEN 0 ELSE 1 END, created_at DESC
    LIMIT 100
  `).all<SupportTicket>();
  return result.results;
}

export async function replyToSupportTicket(id: number, reply: string, answeredBy: string) {
  const result=await database().prepare(`
    UPDATE support_tickets
    SET human_reply = ?, answered_by = ?, status = 'answered',
      answered_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(reply,answeredBy,id).run();
  return result.meta.changes > 0;
}
