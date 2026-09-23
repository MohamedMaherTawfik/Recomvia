import type { ReactNode } from "react";
import { PublicShell } from "@/app/components/public-shell";

export function PolicyPage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: ReactNode }) {
  return <PublicShell><main>
    <section className="border-b border-slate-200 bg-[#07111f] text-white"><div className="mx-auto max-w-[920px] px-5 py-16 sm:px-8 sm:py-20"><p className="text-sm font-bold uppercase tracking-[.15em] text-cyan-300">{eyebrow}</p><h1 className="mt-4 text-4xl font-extrabold tracking-[-.045em] sm:text-5xl">{title}</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">{intro}</p><p className="mt-6 text-xs font-semibold text-slate-500">Effective 21 September 2026 · Private beta</p></div></section>
    <article className="mx-auto max-w-[920px] space-y-10 px-5 py-16 text-base leading-8 text-slate-700 sm:px-8">{children}</article>
  </main></PublicShell>;
}

export function PolicySection({ title, children }: { title: string; children: ReactNode }) {
  return <section><h2 className="text-2xl font-extrabold tracking-[-.025em] text-[#07111f]">{title}</h2><div className="mt-4 space-y-4">{children}</div></section>;
}
