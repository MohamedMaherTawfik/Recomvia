import type { Metadata } from "next";
import { env } from "cloudflare:workers";
import { notFound } from "next/navigation";
import { AppShell } from "@/app/components/app-shell";
import { requireChatGPTUser } from "@/app/chatgpt-auth";
import { listSupportTickets } from "@/db/support";
import { SupportInbox } from "./support-inbox";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export const metadata: Metadata = {
  title: "Human Support Inbox",
  robots: { index: false, follow: false },
};

export default async function SupportInboxPage() {
  const user = await requireChatGPTUser("/support/inbox");
  if (!env.RECOMVIA_ADMIN_USER_ID || user.userId !== env.RECOMVIA_ADMIN_USER_ID) notFound();
  const tickets = await listSupportTickets();
  return <AppShell title="Human support inbox" description="Questions the grounded assistant could not answer. Review the original question and publish a reply that the visitor can retrieve privately."><SupportInbox initialTickets={tickets} /></AppShell>;
}
