"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Clock3, ExternalLink, Inbox, Loader2, Mail, MessageSquareReply } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import type { SupportTicket } from "@/db/support";

function formatDate(value: string) {
  try {
    const normalized = /(?:Z|[+-]\d\d:\d\d)$/.test(value) ? value : `${value.replace(" ", "T")}Z`;
    return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(new Date(normalized));
  } catch {
    return value;
  }
}

export function SupportInbox({ initialTickets }: { initialTickets: SupportTicket[] }) {
  const [tickets, setTickets] = useState(initialTickets);
  const [filter, setFilter] = useState<"open" | "answered" | "all">("open");
  const [selected, setSelected] = useState<SupportTicket | null>(null);
  const [reply, setReply] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const visible = useMemo(() => tickets.filter((ticket) => filter === "all" || ticket.status === filter), [filter, tickets]);
  const openCount = tickets.filter((ticket) => ticket.status === "open").length;

  function startReply(ticket: SupportTicket) {
    setSelected(ticket);
    setReply(ticket.humanReply || "");
    setError("");
  }

  async function saveReply() {
    if (!selected) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/support/tickets/${selected.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Reply could not be saved.");
      const updated: SupportTicket = { ...selected, humanReply: reply.trim(), status: "answered", answeredAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      setTickets((current) => current.map((ticket) => ticket.id === selected.id ? updated : ticket));
      setSelected(null);
      setReply("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Reply could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5"><div className="flex items-center gap-2 text-sm font-bold text-amber-700"><Clock3 className="size-4" />Awaiting reply</div><p className="mt-3 text-3xl font-extrabold text-slate-900">{openCount}</p></div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5"><div className="flex items-center gap-2 text-sm font-bold text-emerald-700"><CheckCircle2 className="size-4" />Answered</div><p className="mt-3 text-3xl font-extrabold text-slate-900">{tickets.length - openCount}</p></div>
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5"><div className="flex items-center gap-2 text-sm font-bold text-blue-700"><Inbox className="size-4" />Total retained</div><p className="mt-3 text-3xl font-extrabold text-slate-900">{tickets.length}</p></div>
      </div>

      <div className="mt-6 overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 className="font-extrabold">Customer questions</h2><p className="mt-1 text-xs text-slate-500">Most recent 100 tickets · times shown in UTC</p></div>
          <div className="flex rounded-xl bg-slate-100 p-1">{(["open", "answered", "all"] as const).map((item) => <Button key={item} type="button" variant="ghost" onClick={() => setFilter(item)} className={`h-9 rounded-lg px-4 text-xs font-bold capitalize ${filter === item ? "bg-white text-blue-700 shadow-sm" : "text-slate-500"}`}>{item}</Button>)}</div>
        </div>

        {visible.length ? (
          <Table>
            <TableHeader><TableRow className="bg-slate-50"><TableHead className="px-5">Ticket</TableHead><TableHead>Customer</TableHead><TableHead className="min-w-[320px]">Question</TableHead><TableHead>Status</TableHead><TableHead className="pr-5 text-right">Action</TableHead></TableRow></TableHeader>
            <TableBody>{visible.map((ticket) => <TableRow key={ticket.id}>
              <TableCell className="px-5 align-top"><p className="font-mono text-xs font-bold text-blue-700">{ticket.publicId}</p><p className="mt-1 text-xs text-slate-400">{formatDate(ticket.createdAt)}</p></TableCell>
              <TableCell className="align-top"><p className="font-bold text-slate-900">{ticket.requesterName}</p><a href={`mailto:${ticket.requesterEmail}`} className="mt-1 flex items-center gap-1 text-xs text-slate-500 hover:text-blue-700"><Mail className="size-3" />{ticket.requesterEmail}</a></TableCell>
              <TableCell className="max-w-[480px] whitespace-normal align-top"><p className="line-clamp-3 text-sm leading-6 text-slate-700">{ticket.question}</p>{ticket.pageUrl && <a href={ticket.pageUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-blue-700">Source page <ExternalLink className="size-3" /></a>}</TableCell>
              <TableCell className="align-top"><Badge variant="outline" className={ticket.status === "answered" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"}>{ticket.status}</Badge></TableCell>
              <TableCell className="pr-5 text-right align-top"><Button type="button" variant={ticket.status === "open" ? "default" : "outline"} onClick={() => startReply(ticket)} className={`rounded-xl font-bold ${ticket.status === "open" ? "bg-blue-600" : ""}`}><MessageSquareReply className="size-4" />{ticket.status === "open" ? "Reply" : "Edit reply"}</Button></TableCell>
            </TableRow>)}</TableBody>
          </Table>
        ) : <div className="py-20 text-center"><Inbox className="mx-auto size-8 text-slate-300" /><p className="mt-4 font-extrabold text-slate-900">No {filter === "all" ? "" : filter} tickets</p><p className="mt-1 text-sm text-slate-500">New assistant escalations will appear here.</p></div>}
      </div>

      <Dialog open={Boolean(selected)} onOpenChange={(value) => { if (!value) setSelected(null); }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader><DialogTitle>Reply to {selected?.publicId}</DialogTitle><DialogDescription>The visitor can retrieve this reply securely from the Recomvia Assistant using the ticket credentials stored in their browser.</DialogDescription></DialogHeader>
          {selected && <div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs font-bold uppercase tracking-[.12em] text-slate-400">Customer question</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{selected.question}</p></div>}
          <Textarea value={reply} onChange={(event) => setReply(event.target.value)} minLength={5} maxLength={4000} placeholder="Write a clear, complete human reply…" className="min-h-44 rounded-xl" />
          {error && <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
          <DialogFooter><Button type="button" variant="outline" onClick={() => setSelected(null)} className="rounded-xl">Cancel</Button><Button type="button" onClick={() => void saveReply()} disabled={saving || reply.trim().length < 5} className="rounded-xl bg-blue-600 font-bold">{saving ? <><Loader2 className="size-4 animate-spin" />Saving…</> : "Publish human reply"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
