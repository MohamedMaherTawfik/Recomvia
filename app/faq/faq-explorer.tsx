"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type PublicFaq = {
  id: string;
  category: string;
  question: string;
  answer: string;
  questionAr: string;
  answerAr: string;
};

const categoryLabels: Record<string, string> = {
  All: "الكل",
  Platform: "المنصة",
  Reports: "التقارير",
  Optimization: "التحسين",
  Measurement: "القياس",
  Billing: "الأسعار",
  Trust: "الثقة",
};

export function FaqExplorer({ entries }: { entries: PublicFaq[] }) {
  const [language, setLanguage] = useState<"en" | "ar">("ar");
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const categories = ["All", ...Array.from(new Set(entries.map((entry) => entry.category)))];

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return entries.filter((entry) => {
      if (category !== "All" && entry.category !== category) return false;
      if (!needle) return true;
      return [entry.question, entry.answer, entry.questionAr, entry.answerAr].join(" ").toLocaleLowerCase().includes(needle);
    });
  }, [category, entries, query]);

  return (
    <div>
      <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={language === "ar" ? "ابحث في الأسئلة والإجابات…" : "Search questions and answers…"} className="h-12 rounded-xl border-slate-200 pl-10" dir={language === "ar" ? "rtl" : "ltr"} />
          </div>
          <div className="flex rounded-xl bg-slate-100 p-1">
            <Button type="button" variant="ghost" onClick={() => setLanguage("ar")} className={`h-10 flex-1 rounded-lg px-5 font-bold sm:flex-none ${language === "ar" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500"}`}>العربية</Button>
            <Button type="button" variant="ghost" onClick={() => setLanguage("en")} className={`h-10 flex-1 rounded-lg px-5 font-bold sm:flex-none ${language === "en" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500"}`}>English</Button>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
          <SlidersHorizontal className="mr-1 size-4 shrink-0 text-slate-400" />
          {categories.map((item) => (
            <button key={item} type="button" onClick={() => setCategory(item)} className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold transition ${category === item ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-blue-300"}`}>
              {language === "ar" ? categoryLabels[item] : item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-[24px] border border-slate-200 bg-white px-5 shadow-sm sm:px-7" dir={language === "ar" ? "rtl" : "ltr"}>
        {filtered.length ? (
          <Accordion type="multiple">
            {filtered.map((entry) => (
              <AccordionItem key={entry.id} value={entry.id} id={entry.id} className="scroll-mt-28 border-slate-200">
                <AccordionTrigger className={`py-6 text-base font-extrabold text-slate-900 hover:no-underline ${language === "ar" ? "text-right" : "text-left"}`}>
                  <span><span className="mb-1 block text-[10px] font-bold uppercase tracking-[.14em] text-blue-600">{language === "ar" ? categoryLabels[entry.category] : entry.category}</span>{language === "ar" ? entry.questionAr : entry.question}</span>
                </AccordionTrigger>
                <AccordionContent className="max-w-3xl pb-6 text-sm leading-7 text-slate-600 sm:text-base">
                  {language === "ar" ? entry.answerAr : entry.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="py-16 text-center"><p className="font-extrabold text-slate-900">{language === "ar" ? "لا توجد إجابة مطابقة" : "No matching answer"}</p><p className="mt-2 text-sm text-slate-500">{language === "ar" ? "اسأل مساعد Recomvia ليبحث في المدونة أيضًا أو يحوّل السؤال إلى إنسان." : "Ask the Recomvia Assistant to search the research library too, or route the question to a human."}</p></div>
        )}
      </div>
      <p className="mt-4 text-center text-xs text-slate-400">{filtered.length} {language === "ar" ? "إجابة موثقة" : filtered.length === 1 ? "documented answer" : "documented answers"}</p>
    </div>
  );
}
