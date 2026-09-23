import type { Metadata } from "next";
import { Bot, Headphones, MessagesSquare, ShieldCheck } from "lucide-react";
import { PublicShell } from "@/app/components/public-shell";
import { ContactForm } from "./contact-form";
import { SITE_URL } from "@/lib/articles";

export const metadata: Metadata = {
  title: { absolute: "Contact Recomvia — Product, Support & Partnerships" },
  description: "Contact Recomvia about AI visibility analysis, subscriptions, Fix Credits, expert services, technical support, partnerships, or media enquiries.",
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: { title: "Contact Recomvia", description: "Reach the Recomvia team about product, support, expert services, partnerships, or media.", type: "website", url: `${SITE_URL}/contact` },
};

export default function ContactPage() {
  const schema = { "@context": "https://schema.org", "@type": "ContactPage", name: "Contact Recomvia", url: `${SITE_URL}/contact`, about: { "@id": `${SITE_URL}/#organization` } };
  return (
    <PublicShell>
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
        <section className="relative overflow-hidden border-b border-slate-200 bg-[#07111f] text-white"><div className="signal-grid absolute inset-0 opacity-20" /><div className="relative mx-auto max-w-[1000px] px-5 py-16 sm:px-8 sm:py-20"><p className="text-sm font-bold uppercase tracking-[.16em] text-cyan-300">Contact Recomvia</p><h1 className="mt-4 max-w-4xl text-4xl font-extrabold tracking-[-.05em] sm:text-6xl">A direct path to the right answer.</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">تواصل معنا بشأن المنتج أو الاشتراكات أو خدمات الخبراء أو الدعم التقني، وستتحول رسالتك مباشرة إلى فريق خدمة العملاء برقم متابعة خاص.</p></div></section>
        <section className="mx-auto grid max-w-[1080px] gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[.7fr_1.3fr]">
          <div><p className="text-sm font-bold uppercase tracking-[.14em] text-blue-600">Human support</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight">Tell us what you need.</h2><p className="mt-4 text-base leading-7 text-slate-600">Start with the assistant for an immediate, source-backed answer. If your question needs judgment or account support, use this form and a human will answer through the same secure ticket flow.</p><div className="mt-8 space-y-3">{[[Bot,"Knowledge first","The assistant checks approved FAQs and research."],[Headphones,"Human when needed","Unsupported questions enter the support inbox."],[ShieldCheck,"Private tracking","Every request receives a private reference."],[MessagesSquare,"One continuous thread","The reply appears inside the assistant on this browser."]].map(([Icon,title,description])=><div key={title as string} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700"><Icon className="size-4" /></span><div><p className="text-sm font-extrabold text-slate-900">{title as string}</p><p className="mt-1 text-xs leading-5 text-slate-500">{description as string}</p></div></div>)}</div></div>
          <ContactForm />
        </section>
      </main>
    </PublicShell>
  );
}
