"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const ticketStorageKey = "recomvia-support-ticket";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("Product & sales");
  const [message, setMessage] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSending(true);
    setError("");
    try {
      const question = `[${category}] ${message.trim()}`;
      const response = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, question, pageUrl: "/contact", companyWebsite }),
      });
      const data = (await response.json()) as { reference?: string; accessKey?: string; status?: string; error?: string };
      if (!response.ok || !data.reference || !data.accessKey) throw new Error(data.error || "Your message could not be sent.");
      window.localStorage.setItem(ticketStorageKey, JSON.stringify({ reference: data.reference, accessKey: data.accessKey, question, status: data.status || "open" }));
      setReference(data.reference);
      setMessage("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Your message could not be sent.");
    } finally {
      setSending(false);
    }
  }

  if (reference) {
    return (
      <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-7 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-emerald-600 text-white"><CheckCircle2 className="size-6" /></span>
        <h2 className="mt-5 text-2xl font-extrabold text-slate-900">Your message is with our team</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">تم إنشاء تذكرة خدمة عملاء، ويمكنك متابعة الرد البشري من خلال مساعد Recomvia في هذا المتصفح.</p>
        <p className="mx-auto mt-5 w-fit rounded-xl border border-emerald-200 bg-white px-4 py-2 font-mono text-sm font-extrabold text-emerald-800">{reference}</p>
        <Button type="button" variant="outline" onClick={() => setReference("")} className="mt-5 rounded-xl border-emerald-200 bg-white font-bold">Send another message</Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5 rounded-[26px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(7,17,31,.08)] sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-bold text-slate-700">Name / الاسم<Input value={name} onChange={(event) => setName(event.target.value)} minLength={2} maxLength={80} required placeholder="Your name" className="h-12 rounded-xl font-normal" /></label>
        <label className="space-y-2 text-sm font-bold text-slate-700">Email / البريد الإلكتروني<Input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required placeholder="you@company.com" className="h-12 rounded-xl font-normal" dir="ltr" /></label>
      </div>
      <label className="block space-y-2 text-sm font-bold text-slate-700">Topic / الموضوع<Select value={category} onValueChange={setCategory}><SelectTrigger className="h-12 w-full rounded-xl font-normal"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Product & sales">Product & sales / المنتج والمبيعات</SelectItem><SelectItem value="Technical support">Technical support / الدعم التقني</SelectItem><SelectItem value="Expert services">Expert services / خدمات الخبراء</SelectItem><SelectItem value="Partnerships & media">Partnerships & media / الشراكات والإعلام</SelectItem></SelectContent></Select></label>
      <label className="block space-y-2 text-sm font-bold text-slate-700">Message / الرسالة<Textarea value={message} onChange={(event) => setMessage(event.target.value)} minLength={10} maxLength={2000} required placeholder="Tell us what you need / اكتب ما تحتاج إليه" className="min-h-40 rounded-xl font-normal" dir="auto" /></label>
      <div className="hidden" aria-hidden="true"><label>Company website<input tabIndex={-1} autoComplete="off" value={companyWebsite} onChange={(event) => setCompanyWebsite(event.target.value)} /></label></div>
      {error && <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700" role="alert">{error}</p>}
      <Button type="submit" disabled={sending} className="h-12 w-full rounded-xl bg-blue-600 text-base font-bold hover:bg-blue-700">{sending ? <><Loader2 className="size-4 animate-spin" />Sending…</> : <><Send className="size-4" />Send to our team / إرسال إلى فريقنا</>}</Button>
      <p className="text-center text-xs leading-5 text-slate-400">A private tracking reference is created for every message. No public conversation is created.</p>
    </form>
  );
}
