import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://recomvia-ai-visibility.omarghazi85.chatgpt.site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Recomvia — AI Visibility Optimization Platform", template: "%s | Recomvia" },
  description: "See how AI sees you. Fix what holds you back.",
  icons: { icon: "/favicon.svg" },
  alternates: { canonical: siteUrl },
  robots: { index: true, follow: true },
  openGraph: { title: "Recomvia — AI Visibility Optimization Platform", description: "See how AI sees you. Fix what holds you back.", type: "website", url: siteUrl, siteName: "Recomvia" },
  twitter: { card: "summary", title: "Recomvia — AI Visibility Optimization Platform", description: "See how AI sees you. Fix what holds you back." },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organization={"@context":"https://schema.org","@type":"Organization","@id":`${siteUrl}/#organization`,name:"Recomvia",url:siteUrl,logo:`${siteUrl}/favicon.svg`,description:"AI Visibility Optimization Platform"};
  const website={"@context":"https://schema.org","@type":"WebSite","@id":`${siteUrl}/#website`,name:"Recomvia",url:siteUrl,publisher:{"@id":`${siteUrl}/#organization`},inLanguage:["en","ar"]};
  return (
    <html lang="en">
      <body><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify([organization,website]).replace(/</g,"\\u003c")}}/>{children}</body>
    </html>
  );
}
