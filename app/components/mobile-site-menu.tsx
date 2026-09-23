"use client";

import Link from "next/link";
import { ArrowRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export type SiteNavItem = { href: string; label: string };

export function MobileSiteMenu({
  items,
  menuLabel = "Open menu",
  ctaLabel,
  ctaHref = "/",
  direction = "ltr",
}: {
  items: SiteNavItem[];
  menuLabel?: string;
  ctaLabel?: string;
  ctaHref?: string;
  direction?: "ltr" | "rtl";
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-xl border-slate-200 bg-white lg:hidden" aria-label={menuLabel}>
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side={direction === "rtl" ? "right" : "left"} className="w-[310px] gap-0 border-slate-200 bg-white p-0" dir={direction}>
        <SheetHeader className="border-b border-slate-200 px-6 py-6 text-start">
          <SheetTitle className="text-xl font-extrabold tracking-[-.04em]">recomvia</SheetTitle>
          <SheetDescription>{direction === "rtl" ? "القائمة الرئيسية" : "Main navigation"}</SheetDescription>
        </SheetHeader>
        <nav className="flex flex-1 flex-col gap-1 p-4" aria-label={menuLabel}>
          {items.map((item) => (
            <SheetClose key={`${item.href}-${item.label}`} asChild>
              <Link href={item.href} className="flex min-h-12 items-center justify-between rounded-xl px-4 text-base font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700">
                {item.label}<ArrowRight className={`size-4 ${direction === "rtl" ? "rotate-180" : ""}`} />
              </Link>
            </SheetClose>
          ))}
        </nav>
        {ctaLabel && (
          <div className="border-t border-slate-200 p-4">
            <SheetClose asChild><Button asChild className="h-12 w-full rounded-xl bg-blue-600 font-bold"><Link href={ctaHref}>{ctaLabel}<ArrowRight className={`size-4 ${direction === "rtl" ? "rotate-180" : ""}`} /></Link></Button></SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
