import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleAlert, History, Radar, RefreshCw, ShieldCheck } from "lucide-react";
import { AppShell, StatusPill } from "@/app/components/app-shell";
import { requireChatGPTUser } from "@/app/chatgpt-auth";
import { getLatestScanForUser, listScansForUser } from "@/db/product";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export const metadata: Metadata = {
  title: "Private beta workspace",
  robots: { index: false, follow: false },
};

function compactDate(value: string) {
  try {
    const normalized = /(?:Z|[+-]\d\d:\d\d)$/.test(value) ? value : `${value.replace(" ", "T")}Z`;
    return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(normalized));
  } catch { return value; }
}

export default async function DashboardPage() {
  const user = await requireChatGPTUser("/dashboard");
  const [latest, scans] = await Promise.all([getLatestScanForUser(user.userId), listScansForUser(user.userId)]);

  return <AppShell title="Visibility workspace" description="Live readiness evidence is stored by account. Actual AI answer visibility remains separate until named engine surfaces are connected." workspaceLabel={user.displayName} siteLabel={latest ? `${latest.host} · last live scan ${compactDate(latest.createdAt)}` : "No live scan yet"} userInitial={user.displayName} action={<Button asChild className="h-11 rounded-xl bg-blue-600 font-bold"><Link href="/"><RefreshCw className="size-4" />Run live scan</Link></Button>}>
    {!latest ? <Card className="rounded-[26px] border-dashed border-slate-300 py-0 shadow-none"><CardContent className="grid min-h-[420px] place-items-center p-8 text-center"><div><span className="mx-auto grid size-16 place-items-center rounded-2xl bg-blue-50 text-blue-700"><Radar className="size-7" /></span><h2 className="mt-5 text-2xl font-extrabold">Start with a real website crawl.</h2><p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-500">Recomvia will fetch the public page, robots policy, and sitemap, then save an evidence-backed readiness report. No fixed or representative score will be created.</p><Button asChild className="mt-6 rounded-xl bg-[#07111f]"><Link href="/">Run the first scan <ArrowRight className="size-4" /></Link></Button></div></CardContent></Card> : <>
      <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-900"><strong>Live evidence:</strong> the latest score was calculated from fetched website data using {latest.methodologyVersion}. Recommendation, mention, and citation rates are intentionally empty.</div>
      <div className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
        <Card className="rounded-[24px] border-slate-200 shadow-none"><CardContent className="grid gap-8 p-6 sm:p-8 md:grid-cols-[190px_1fr]"><div className="flex flex-col items-center justify-center rounded-2xl bg-[#07111f] px-5 py-7 text-white"><div className="grid size-32 place-items-center rounded-full bg-blue-600/20"><div><strong className="text-4xl tracking-[-.06em]">{latest.readinessScore}</strong><span className="text-sm text-white/50">/100</span></div></div><p className="mt-5 text-center text-sm font-bold">Live AI Readiness Score</p><span className="mt-2 text-xs text-cyan-300">{latest.confidence}% evidence confidence</span></div><div><div className="mb-5"><h2 className="text-lg font-extrabold">Readiness composition</h2><p className="mt-1 text-xs text-slate-500">Observed readiness only; not actual AI visibility.</p></div><div className="space-y-4">{[
          ["Technical AEO", latest.categoryScores["Technical AEO"] ?? 0, "[&>div]:bg-emerald-500"],
          ["Content readiness", latest.categoryScores["Content readiness"] ?? 0, "[&>div]:bg-cyan-500"],
          ["Authority & entity", latest.categoryScores["Authority & entity"] ?? 0, "[&>div]:bg-violet-500"],
        ].map(([label,value,color])=><div key={label as string}><div className="mb-1.5 flex justify-between text-sm"><span className="font-semibold text-slate-600">{label as string}</span><strong>{value as number}</strong></div><Progress value={value as number} className={`h-2 ${color as string}`} /></div>)}</div></div></CardContent></Card>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
          <Card className="rounded-[24px] border-slate-200 shadow-none"><CardHeader className="pb-2"><CardTitle className="flex items-center justify-between text-base"><span className="flex items-center gap-2"><ShieldCheck className="size-4 text-blue-600" />Evidence coverage</span><StatusPill tone="good">Live</StatusPill></CardTitle></CardHeader><CardContent><div className="grid grid-cols-3 gap-3">{[[String(latest.findings.length),"checks"],[String(latest.issueCount),"issues"],[String(latest.requestCount),"requests"]].map(([value,label])=><div key={label}><p className="text-3xl font-extrabold">{value}</p><p className="mt-1 text-xs text-slate-500">{label}</p></div>)}</div><Button asChild variant="outline" className="mt-5 w-full rounded-xl"><Link href={`/report?scan=${encodeURIComponent(latest.id)}`}>Open evidence report <ArrowRight className="size-4" /></Link></Button></CardContent></Card>
          <Card className="rounded-[24px] border-amber-200 bg-amber-50/60 py-0 shadow-none"><CardContent className="flex items-start gap-4 p-5"><span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white text-amber-700"><Radar className="size-5" /></span><div><p className="text-sm font-bold">Actual AI visibility</p><p className="mt-1 text-xs leading-5 text-amber-900">Not measured. No engine, recommendation, mention, or citation result is inferred from readiness.</p></div></CardContent></Card>
        </div>
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
        <Card className="rounded-[24px] border-slate-200 shadow-none"><CardHeader className="border-b border-slate-100"><div className="flex items-center justify-between"><div><CardTitle>Highest-priority findings</CardTitle><p className="mt-1 text-xs text-slate-500">Ordered from the stored live evidence.</p></div><Button asChild variant="ghost" className="text-blue-700"><Link href={`/report?scan=${encodeURIComponent(latest.id)}`}>View all <ArrowRight className="size-4" /></Link></Button></div></CardHeader><CardContent className="divide-y p-0">{latest.findings.filter((finding)=>finding.status!=="pass").slice(0,3).map((finding,index)=><div key={finding.id} className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center"><span className={`grid size-9 place-items-center rounded-xl text-sm font-bold ${finding.severity === "critical" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>{index+1}</span><div className="flex-1"><p className="font-bold">{finding.title}</p><p className="mt-1 text-sm text-slate-500">{finding.evidence}</p><div className="mt-2 flex gap-2"><StatusPill tone={finding.severity === "critical" ? "bad" : "warn"}>{finding.severity}</StatusPill><StatusPill tone="info">{finding.category}</StatusPill></div></div></div>)}</CardContent></Card>
        <Card className="rounded-[24px] border-slate-200 shadow-none"><CardHeader><CardTitle className="flex items-center gap-2"><History className="size-4 text-blue-600" />Recent scans</CardTitle></CardHeader><CardContent className="space-y-3">{scans.slice(0,5).map((scan)=><Link key={scan.id} href={`/report?scan=${encodeURIComponent(scan.id)}`} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-blue-300"><span className={`grid size-9 place-items-center rounded-lg ${scan.status === "completed" ? "bg-emerald-50 text-emerald-700" : scan.status === "failed" ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"}`}>{scan.status === "completed" ? <CheckCircle2 className="size-4" /> : <CircleAlert className="size-4" />}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{scan.host}</p><p className="text-xs text-slate-400">{compactDate(scan.createdAt)} · {scan.language}</p></div><strong>{scan.readinessScore ?? "—"}</strong></Link>)}</CardContent></Card>
      </div>
    </>}
  </AppShell>;
}
