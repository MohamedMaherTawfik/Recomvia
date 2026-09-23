import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, CircleAlert, Clock3, Download, ExternalLink, FileSearch, LockKeyhole, Radar, ShieldCheck, X } from "lucide-react";
import { AppShell, StatusPill } from "@/app/components/app-shell";
import { requireChatGPTUser } from "@/app/chatgpt-auth";
import { getLatestScanForUser, getScanForUser } from "@/db/product";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export const metadata: Metadata = {
  title: "Private readiness report",
  robots: { index: false, follow: false },
};

function formatDate(value: string | null) {
  if (!value) return "In progress";
  try {
    const normalized = /(?:Z|[+-]\d\d:\d\d)$/.test(value) ? value : `${value.replace(" ", "T")}Z`;
    return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(new Date(normalized));
  } catch { return value; }
}

function tone(status: string): "good" | "warn" | "bad" {
  return status === "pass" ? "good" : status === "partial" ? "warn" : "bad";
}

export default async function ReportPage({ searchParams }: { searchParams: Promise<{ scan?: string }> }) {
  const { scan: scanId } = await searchParams;
  const user = await requireChatGPTUser(scanId ? `/report?scan=${encodeURIComponent(scanId)}` : "/report");
  const scan = scanId ? await getScanForUser(user.userId, scanId) : await getLatestScanForUser(user.userId);

  if (!scan) {
    return <AppShell title="No live report yet" description="Run the first live website readiness scan to create an evidence-backed report." workspaceLabel={user.displayName} userInitial={user.displayName} action={<Button asChild className="h-11 rounded-xl bg-blue-600 font-bold"><Link href="/">Run live scan <ArrowRight className="size-4" /></Link></Button>}>
      <Card className="rounded-[26px] border-dashed border-slate-300 py-0 shadow-none"><CardContent className="grid min-h-80 place-items-center p-8 text-center"><div><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-blue-50 text-blue-700"><FileSearch className="size-6" /></span><h2 className="mt-5 text-xl font-extrabold">Your evidence will appear here.</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">The report will contain the fetched URL, crawl context, methodology version, score components, and every finding with its source.</p></div></CardContent></Card>
    </AppShell>;
  }

  const technical = scan.categoryScores["Technical AEO"] ?? 0;
  const content = scan.categoryScores["Content readiness"] ?? 0;
  const entity = scan.categoryScores["Authority & entity"] ?? 0;
  const score = scan.readinessScore ?? 0;
  const passed = scan.findings.filter((finding) => finding.status === "pass").length;
  const label = score >= 80 ? "Strong foundation" : score >= 60 ? "Focused improvements needed" : "Needs attention";

  return <AppShell title="Live website readiness report" description="This report measures observable website readiness. It does not claim to measure recommendation or citation inside live AI answers." workspaceLabel={user.displayName} siteLabel={`${scan.host} · ${scan.language} / ${scan.country}`} userInitial={user.displayName} action={<div className="flex gap-2"><Button disabled variant="outline" className="h-11 rounded-xl" title="PDF export is not active in private beta"><Download className="size-4" />PDF coming later</Button><Button asChild className="h-11 rounded-xl bg-[#07111f] font-bold"><Link href="/fix-center">Review fix catalog <ArrowRight className="size-4" /></Link></Button></div>}>
    <div className="mb-5 flex flex-wrap items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/60 px-4 py-3 text-xs text-emerald-900"><StatusPill tone="good">Live website evidence</StatusPill><span>{scan.language} · {scan.country}</span><span>•</span><span>{scan.requestCount} fetched resources</span><span>•</span><span>{formatDate(scan.completedAt)} UTC</span><span>•</span><span>{scan.methodologyVersion}</span></div>
    <Tabs defaultValue="summary" className="gap-5">
      <TabsList className="h-auto flex-wrap rounded-xl bg-slate-200/60 p-1"><TabsTrigger value="summary" className="px-4 py-2.5">Score summary</TabsTrigger><TabsTrigger value="evidence" className="px-4 py-2.5">Finding evidence</TabsTrigger><TabsTrigger value="visibility" className="px-4 py-2.5">Actual AI visibility</TabsTrigger></TabsList>
      <TabsContent value="summary" className="space-y-5">
        <div className="grid gap-5 lg:grid-cols-[.72fr_1.28fr]">
          <Card className="rounded-[24px] border-slate-200 bg-[#07111f] text-white shadow-none"><CardContent className="p-7"><p className="text-xs font-bold uppercase tracking-[.14em] text-cyan-300">Live AI Readiness Score</p><div className="mt-5 flex items-end gap-2"><strong className="text-7xl tracking-[-.07em]">{score}</strong><span className="pb-2 text-xl text-white/40">/100</span></div><p className="mt-3 text-lg font-bold text-amber-300">{label}</p><p className="mt-4 text-sm leading-6 text-slate-400">Calculated from the fetched page, robots policy, sitemap, structured data, content, and entity signals.</p><div className="mt-7 grid grid-cols-3 gap-2 border-t border-white/10 pt-5 text-center">{[[String(passed),"checks passed"],[String(scan.issueCount),"issues"],[`${scan.confidence}%`,"confidence"]].map(([value,itemLabel])=><div key={itemLabel}><strong className="block text-xl">{value}</strong><span className="text-[11px] text-slate-500">{itemLabel}</span></div>)}</div></CardContent></Card>
          <Card className="rounded-[24px] border-slate-200 shadow-none"><CardHeader><CardTitle>Readiness components</CardTitle></CardHeader><CardContent className="space-y-5">{[
            ["Technical AEO", technical, "Crawl policy, canonical, language, structured data", "[&>div]:bg-emerald-500"],
            ["Content readiness", content, "Titles, headings, answer structure, visible context", "[&>div]:bg-cyan-500"],
            ["Authority & entity", entity, "Organization identity and verification paths", "[&>div]:bg-violet-500"],
          ].map(([name,value,note,color])=><div key={name as string}><div className="mb-2 flex items-end justify-between"><div><p className="text-sm font-bold">{name as string}</p><p className="mt-0.5 text-xs text-slate-500">{note as string}</p></div><strong>{value as number}</strong></div><Progress value={value as number} className={`h-2.5 ${color as string}`} /></div>)}</CardContent></Card>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          <Card className="rounded-[22px] border-red-200 bg-red-50/40 py-0 shadow-none"><CardContent className="p-6"><CircleAlert className="size-5 text-red-600" /><p className="mt-5 text-xs font-bold uppercase tracking-wider text-red-600">Priority</p><h3 className="mt-2 font-extrabold">{scan.criticalCount ? `${scan.criticalCount} critical crawl issue${scan.criticalCount === 1 ? "" : "s"}` : "No critical crawl block detected"}</h3><p className="mt-2 text-sm leading-6 text-slate-600">Open the evidence tab to see exactly what was fetched and why each check passed or failed.</p></CardContent></Card>
          <Card className="rounded-[22px] border-emerald-200 bg-emerald-50/40 py-0 shadow-none"><CardContent className="p-6"><ShieldCheck className="size-5 text-emerald-600" /><p className="mt-5 text-xs font-bold uppercase tracking-wider text-emerald-600">Evidence</p><h3 className="mt-2 font-extrabold">Every score point maps to a check</h3><p className="mt-2 text-sm leading-6 text-slate-600">The report stores the source URL, check weight, awarded points, and evidence text.</p></CardContent></Card>
          <Card className="rounded-[22px] border-blue-200 bg-blue-50/40 py-0 shadow-none"><CardContent className="p-6"><Clock3 className="size-5 text-blue-600" /><p className="mt-5 text-xs font-bold uppercase tracking-wider text-blue-600">Cache</p><h3 className="mt-2 font-extrabold">24-hour identical-context reuse</h3><p className="mt-2 text-sm leading-6 text-slate-600">The same domain, language, country, and methodology reuse recent evidence to control cost.</p></CardContent></Card>
        </div>
      </TabsContent>
      <TabsContent value="evidence"><div className="space-y-3">{scan.findings.map((finding)=><Card key={finding.id} className="rounded-[20px] border-slate-200 py-0 shadow-none"><CardContent className="grid gap-4 p-5 md:grid-cols-[44px_1fr_auto] md:items-start"><span className={`grid size-10 place-items-center rounded-xl ${finding.status === "pass" ? "bg-emerald-50 text-emerald-700" : finding.status === "partial" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"}`}>{finding.status === "pass" ? <Check className="size-5" /> : finding.status === "partial" ? <CircleAlert className="size-5" /> : <X className="size-5" />}</span><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-extrabold">{finding.title}</h3><StatusPill tone={tone(finding.status)}>{finding.status}</StatusPill><StatusPill tone="info">{finding.category}</StatusPill></div><p className="mt-2 text-sm leading-6 text-slate-600">{finding.explanation}</p><div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm font-semibold text-slate-700">{finding.evidence}</div><a href={finding.sourceUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-blue-700">Open source <ExternalLink className="size-3" /></a></div><div className="rounded-xl border border-slate-200 px-3 py-2 text-center"><strong>{finding.awardedPoints}/{finding.weight}</strong><p className="text-[11px] text-slate-400">points</p></div></CardContent></Card>)}</div></TabsContent>
      <TabsContent value="visibility"><Card className="rounded-[26px] border-amber-200 bg-amber-50/60 py-0 shadow-none"><CardContent className="grid min-h-80 place-items-center p-8 text-center"><div><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-white text-amber-700"><Radar className="size-6" /></span><p className="mt-5 text-xs font-bold uppercase tracking-[.14em] text-amber-700">Not measured</p><h2 className="mt-2 text-2xl font-extrabold">No AI answer-surface result is claimed.</h2><p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">This run inspected the live website only. Recommendation rate, mention rate, citations, position, and cross-engine coverage will remain empty until named AI surfaces are connected and their prompt evidence is stored.</p><div className="mx-auto mt-6 flex max-w-xl items-start gap-3 rounded-2xl bg-white p-4 text-start text-sm text-slate-600"><LockKeyhole className="mt-0.5 size-5 shrink-0 text-blue-600" /><p><strong className="text-slate-900">Methodology safeguard:</strong> readiness cannot be presented as actual visibility, even when the readiness score is high.</p></div></div></CardContent></Card></TabsContent>
    </Tabs>
  </AppShell>;
}
