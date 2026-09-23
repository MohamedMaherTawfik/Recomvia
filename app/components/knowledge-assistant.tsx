"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Headphones,
  Loader2,
  MessageCircleQuestion,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type ModelContext = {
  registerTool: (tool: Record<string, unknown>, options?: { signal?: AbortSignal }) => void | Promise<void>;
};

type KnowledgeResult = {
  answered: boolean;
  answer?: string;
  title?: string;
  sourceUrl?: string;
  sourceLabel?: string;
  confidence: number;
  language: "ar" | "en";
  suggestedQuestion?: string;
};

type StoredTicket = {
  reference: string;
  accessKey: string;
  question: string;
  status: string;
  humanReply?: string | null;
  updatedAt?: string;
};

const suggestionsEn = [
  "What does the free score include?",
  "What is the difference between subscriptions and Fix Credits?",
  "Can you guarantee an AI recommendation?",
];

const suggestionsAr = [
  "ماذا يشمل الفحص المجاني؟",
  "ما الفرق بين الاشتراك ونقاط الإصلاح؟",
  "هل تضمنون توصية من الذكاء الاصطناعي؟",
];

const ticketStorageKey = "recomvia-support-ticket";

export function KnowledgeAssistant() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [lastQuestion, setLastQuestion] = useState("");
  const [result, setResult] = useState<KnowledgeResult | null>(null);
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState("");
  const [showEscalation, setShowEscalation] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [supportQuestion, setSupportQuestion] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [sending, setSending] = useState(false);
  const [ticket, setTicket] = useState<StoredTicket | null>(null);
  const [checking, setChecking] = useState(false);
  const [pageArabic, setPageArabic] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const syncLanguage = () => setPageArabic(root.lang.toLowerCase().startsWith("ar"));
    syncLanguage();
    const observer = new MutationObserver(syncLanguage);
    observer.observe(root, { attributes: true, attributeFilter: ["lang"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(ticketStorageKey);
        if (saved) setTicket(JSON.parse(saved) as StoredTicket);
      } catch {
        // Ticket lookup still works when the visitor keeps the reference manually.
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const ask = useCallback(async (value: string) => {
    const cleanQuestion = value.trim();
    if (cleanQuestion.length < 2) return null;
    setOpen(true);
    setAsking(true);
    setError("");
    setResult(null);
    setShowEscalation(false);
    setLastQuestion(cleanQuestion);
    setSupportQuestion(cleanQuestion);
    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: cleanQuestion }),
      });
      const data = (await response.json()) as KnowledgeResult & { error?: string };
      if (!response.ok) throw new Error(data.error || "The assistant could not answer right now.");
      setResult(data);
      if (!data.answered) setShowEscalation(true);
      return data;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The assistant could not answer right now.");
      return null;
    } finally {
      setAsking(false);
    }
  }, []);

  useEffect(() => {
    const context = (document as Document & { modelContext?: ModelContext }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const registration = context.registerTool(
      {
        name: "ask_recomvia_knowledge",
        title: "Ask Recomvia knowledge",
        description: "Ask a question using only approved Recomvia FAQ and research content. If the knowledge base has no supported answer, the assistant offers a human support request without inventing one.",
        inputSchema: {
          type: "object",
          properties: { question: { type: "string", minLength: 2, maxLength: 600 } },
          required: ["question"],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute: async (input: unknown) => {
          const value = input && typeof input === "object" ? (input as { question?: unknown }).question : "";
          if (typeof value !== "string") throw new Error("question is required.");
          const answer = await ask(value);
          return answer ?? { answered: false, error: "Knowledge assistant unavailable." };
        },
      },
      { signal: lifecycle.signal },
    );
    Promise.resolve(registration).catch(() => undefined);
    return () => lifecycle.abort();
  }, [ask]);

  function submitQuestion(event: FormEvent) {
    event.preventDefault();
    void ask(question);
  }

  async function sendToHuman(event: FormEvent) {
    event.preventDefault();
    setSending(true);
    setError("");
    try {
      const response = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          question: supportQuestion,
          pageUrl: window.location.pathname + window.location.search,
          companyWebsite: honeypot,
        }),
      });
      const data = (await response.json()) as { reference?: string; accessKey?: string; status?: string; error?: string };
      if (!response.ok || !data.reference || !data.accessKey) throw new Error(data.error || "The request could not be sent.");
      const stored: StoredTicket = {
        reference: data.reference,
        accessKey: data.accessKey,
        question: supportQuestion,
        status: data.status || "open",
      };
      setTicket(stored);
      window.localStorage.setItem(ticketStorageKey, JSON.stringify(stored));
      setShowEscalation(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The request could not be sent.");
    } finally {
      setSending(false);
    }
  }

  async function checkTicket() {
    if (!ticket) return;
    setChecking(true);
    setError("");
    try {
      const response = await fetch("/api/support/tickets/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: ticket.reference, accessKey: ticket.accessKey }),
      });
      const data = (await response.json()) as { status?: string; humanReply?: string | null; updatedAt?: string; error?: string };
      if (!response.ok) throw new Error(data.error || "The ticket could not be checked.");
      const updated = { ...ticket, status: data.status || ticket.status, humanReply: data.humanReply, updatedAt: data.updatedAt };
      setTicket(updated);
      window.localStorage.setItem(ticketStorageKey, JSON.stringify(updated));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The ticket could not be checked.");
    } finally {
      setChecking(false);
    }
  }

  const arabic = result?.language === "ar" || /[\u0600-\u06ff]/.test(lastQuestion) || (!lastQuestion && pageArabic);
  const suggestions = pageArabic ? suggestionsAr : suggestionsEn;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="fixed bottom-5 right-5 z-40 h-12 rounded-full bg-[#07111f] px-4 font-bold text-white shadow-[0_18px_50px_rgba(7,17,31,.3)] hover:bg-blue-700 sm:h-13 sm:px-5" aria-label={pageArabic ? "اسأل Recomvia" : "Ask Recomvia"}>
          <MessageCircleQuestion className="size-5" />
          <span className="hidden sm:inline">{pageArabic ? "اسأل Recomvia" : "Ask Recomvia"}</span>
        </Button>
      </SheetTrigger>
      <SheetContent dir={pageArabic ? "rtl" : "ltr"} className="w-full gap-0 border-slate-200 bg-slate-50 p-0 sm:max-w-[480px]">
        <SheetHeader className="border-b border-white/10 bg-[#07111f] px-6 py-6 text-white">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-lg"><Bot className="size-5" /></span>
            <div>
              <SheetTitle className="text-lg text-white">{pageArabic ? "مساعد Recomvia" : "Recomvia Assistant"}</SheetTitle>
              <SheetDescription className="mt-1 flex items-center gap-1.5 text-xs text-slate-300"><ShieldCheck className="size-3.5 text-cyan-300" />{pageArabic ? "إجابات من المحتوى المعتمد" : "Grounded in our approved knowledge"}</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700"><Sparkles className="size-4" /></span>
              <div>
                <p className="text-sm font-extrabold text-slate-900">{pageArabic ? "اسأل بالعربية أو الإنجليزية" : "Ask in English or Arabic"}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">{pageArabic ? "أجيب من الأسئلة الشائعة وأبحاث Recomvia المعتمدة. وإذا لم توجد إجابة موثوقة أحيل السؤال إلى إنسان." : "I answer from Recomvia’s FAQs and research. If the answer is not there, I route it to a human."}</p>
              </div>
            </div>
          </div>

          {!lastQuestion && (
            <div className="mt-5 space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-[.14em] text-slate-400">{pageArabic ? "جرّب سؤالًا" : "Try a question"}</p>
              {suggestions.map((item) => (
                <button key={item} type="button" onClick={() => { setQuestion(item); void ask(item); }} className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700">
                  <span dir={/[\u0600-\u06ff]/.test(item) ? "rtl" : "ltr"}>{item}</span><ArrowRight className="size-4 shrink-0" />
                </button>
              ))}
            </div>
          )}

          {lastQuestion && (
            <div className="mt-5 rounded-2xl bg-[#07111f] p-4 text-sm leading-6 text-white" dir={arabic ? "rtl" : "ltr"}>
              {lastQuestion}
            </div>
          )}

          {asking && <div className="mt-4 flex items-center gap-2 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm font-semibold text-blue-700"><Loader2 className="size-4 animate-spin" />{arabic ? "نبحث في المحتوى المعتمد…" : "Searching approved content…"}</div>}

          {result?.answered && (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm" dir={result.language === "ar" ? "rtl" : "ltr"}>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.12em] text-emerald-700"><CheckCircle2 className="size-4" />{result.language === "ar" ? "إجابة موثقة" : "Supported answer"}</div>
              {result.title && <h3 className="mt-3 font-extrabold text-slate-900">{result.title}</h3>}
              <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">{result.answer}</p>
              {result.sourceUrl && <Link href={result.sourceUrl} className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-blue-700">{result.sourceLabel || (result.language === "ar" ? "عرض المصدر" : "View source")}<ExternalLink className="size-3.5" /></Link>}
            </div>
          )}

          {result && !result.answered && (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-5" dir={result.language === "ar" ? "rtl" : "ltr"}>
              <div className="flex items-center gap-2 text-sm font-extrabold text-amber-900"><Headphones className="size-4" />{result.language === "ar" ? "هذا السؤال يحتاج إلى إنسان" : "This question needs a human"}</div>
              <p className="mt-2 text-sm leading-6 text-amber-800">{result.language === "ar" ? "لم أجد إجابة موثوقة داخل المحتوى المعتمد، لذلك لن أخمّن. يمكنك إرسال السؤال إلى خدمة العملاء." : "I could not find a supported answer in the approved content, so I will not guess. You can send it to customer service."}</p>
            </div>
          )}

          {showEscalation && (
            <form onSubmit={sendToHuman} className="mt-4 space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" dir={arabic ? "rtl" : "ltr"}>
              <div><p className="font-extrabold text-slate-900">{arabic ? "إرسال إلى خدمة العملاء" : "Send to customer service"}</p><p className="mt-1 text-xs leading-5 text-slate-500">{arabic ? "سننشئ تذكرة خاصة برقم متابعة، وسيظهر الرد البشري داخل المساعد." : "We’ll create a private ticket with a tracking reference. The human reply will appear here."}</p></div>
              <Input value={name} onChange={(event) => setName(event.target.value)} placeholder={arabic ? "الاسم" : "Name"} minLength={2} maxLength={80} required className="h-11 rounded-xl" />
              <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder={arabic ? "البريد الإلكتروني" : "Email address"} type="email" required className="h-11 rounded-xl" dir="ltr" />
              <Textarea value={supportQuestion} onChange={(event) => setSupportQuestion(event.target.value)} minLength={10} maxLength={2000} required className="min-h-28 rounded-xl" />
              <div className="sr-only" aria-hidden="true"><label>Company website<input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} /></label></div>
              <Button type="submit" disabled={sending} className="h-11 w-full rounded-xl bg-blue-600 font-bold">{sending ? <><Loader2 className="size-4 animate-spin" />{arabic ? "جارٍ الإرسال…" : "Sending…"}</> : <><Send className="size-4" />{arabic ? "إنشاء تذكرة" : "Create support ticket"}</>}</Button>
            </form>
          )}

          {ticket && (
            <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-5" dir={pageArabic ? "rtl" : "ltr"}>
              <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.12em] text-blue-600">{pageArabic ? "الدعم البشري" : "Human support"}</p><p className="mt-1 font-mono text-sm font-extrabold text-slate-900">{ticket.reference}</p></div><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${ticket.status === "answered" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{ticket.status === "answered" ? (pageArabic ? "تم الرد" : "Answered") : (pageArabic ? "بانتظار الرد" : "Waiting")}</span></div>
              <p className="mt-3 text-xs leading-5 text-slate-600">{pageArabic ? "احتفظ بهذا الرقم. يُحفظ مفتاح الوصول الخاص في هذا المتصفح فقط لتسهيل متابعة الحالة." : "Save this reference. Your private access key is stored only in this browser for convenient status checks."}</p>
              {ticket.humanReply ? <div className="mt-4 rounded-xl border border-emerald-200 bg-white p-4"><p className="text-xs font-bold text-emerald-700">{pageArabic ? "رد خدمة العملاء" : "Human reply"}</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{ticket.humanReply}</p></div> : <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-600"><Clock3 className="size-3.5" />{pageArabic ? "سيظهر الرد هنا بعد أن يجيب الفريق." : "A reply will appear here after the team answers."}</div>}
              <Button type="button" variant="outline" onClick={() => void checkTicket()} disabled={checking} className="mt-4 h-10 w-full rounded-xl border-blue-200 bg-white font-bold text-blue-700">{checking ? <><Loader2 className="size-4 animate-spin" />{pageArabic ? "جارٍ التحقق…" : "Checking…"}</> : (pageArabic ? "تحقق من الرد البشري" : "Check for a human reply")}</Button>
            </div>
          )}

          {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700" role="alert">{error}</p>}
        </div>

        <form onSubmit={submitQuestion} className="border-t border-slate-200 bg-white p-4">
          <div className="flex gap-2">
            <Input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask a question / اكتب سؤالك" maxLength={600} className="h-11 rounded-xl" />
            <Button type="submit" size="icon" disabled={asking || question.trim().length < 2} className="size-11 shrink-0 rounded-xl bg-blue-600" aria-label={pageArabic ? "أرسل السؤال" : "Send question"}><Send className="size-4" /></Button>
          </div>
          <p className="mt-2 text-center text-[11px] text-slate-400">{pageArabic ? "تعتمد الإجابات على محتوى Recomvia، وتُحال الأسئلة غير المدعومة إلى إنسان." : "Answers cite Recomvia content. Unsupported questions go to a human."}</p>
        </form>
      </SheetContent>
    </Sheet>
  );
}
