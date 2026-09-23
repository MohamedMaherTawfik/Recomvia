import type { ReactNode } from "react";
import Link from "next/link";
import { BrandMark } from "@/app/scan-experience";
import { KnowledgeAssistant } from "@/app/components/knowledge-assistant";
import { MobileSiteMenu, type SiteNavItem } from "@/app/components/mobile-site-menu";
import { Button } from "@/components/ui/button";

const navigation: SiteNavItem[] = [
  { href: "/dashboard", label: "Platform" },
  { href: "/pricing", label: "Subscriptions" },
  { href: "/blog", label: "Blog" },
  { href: "/methodology", label: "Methodology" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#07111f]">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between gap-4 px-5 sm:px-8">
          <Link href="/" className="shrink-0"><BrandMark /></Link>
          <nav className="hidden items-center gap-5 text-sm font-semibold text-slate-600 lg:flex" aria-label="Main navigation">
            {navigation.map((item) => <Link key={item.href} href={item.href} className="transition hover:text-blue-700">{item.label}</Link>)}
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild className="hidden rounded-xl bg-[#07111f] font-bold sm:inline-flex"><Link href="/">Run free score</Link></Button>
            <MobileSiteMenu items={navigation} ctaLabel="Run free score" />
          </div>
        </div>
      </header>
      {children}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.4fr_repeat(3,.65fr)]">
          <div><BrandMark /><p className="mt-4 max-w-md text-sm leading-6 text-slate-500">Recomvia measures how AI systems find, understand, cite, and recommend brands, then turns evidence into prioritized improvements.</p></div>
          <div><p className="text-sm font-extrabold text-slate-900">Platform</p><nav className="mt-4 flex flex-col gap-3 text-sm font-semibold text-slate-500"><Link href="/dashboard">Overview</Link><Link href="/report">Sample report</Link><Link href="/fix-center">Fix Center</Link></nav></div>
          <div><p className="text-sm font-extrabold text-slate-900">Resources</p><nav className="mt-4 flex flex-col gap-3 text-sm font-semibold text-slate-500"><Link href="/blog">Blog</Link><Link href="/methodology">Methodology</Link><Link href="/faq">FAQ & help</Link></nav></div>
          <div><p className="text-sm font-extrabold text-slate-900">Company</p><nav className="mt-4 flex flex-col gap-3 text-sm font-semibold text-slate-500"><Link href="/pricing">Subscriptions</Link><Link href="/contact">Contact us</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/billing-policy">Billing policy</Link></nav></div>
        </div>
        <div className="border-t border-slate-100"><div className="mx-auto max-w-[1240px] px-5 py-5 text-xs text-slate-400 sm:px-8">© 2026 Recomvia. No guaranteed AI recommendation or citation.</div></div>
      </footer>
      <KnowledgeAssistant />
    </div>
  );
}
