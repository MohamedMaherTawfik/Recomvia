export const READINESS_METHODOLOGY_VERSION = "readiness-v0.1";

export type ReadinessFinding = {
  code: string;
  category: "Technical AEO" | "Content readiness" | "Authority & entity";
  severity: "critical" | "high" | "medium" | "low";
  status: "pass" | "partial" | "fail";
  title: string;
  explanation: string;
  evidence: string;
  sourceUrl: string;
  weight: number;
  awardedPoints: number;
  sortOrder: number;
};

export type LiveReadinessResult = {
  sourceUrl: string;
  finalUrl: string;
  httpStatus: number;
  readinessScore: number;
  confidence: number;
  issueCount: number;
  criticalCount: number;
  bytesFetched: number;
  requestCount: number;
  methodologyVersion: string;
  actualVisibilityStatus: "not_measured";
  categoryScores: Record<ReadinessFinding["category"], number>;
  findings: ReadinessFinding[];
};

const MAX_HTML_BYTES = 1_500_000;
const MAX_AUX_BYTES = 350_000;

function blockedIpv4(hostname: string) {
  const parts = hostname.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return false;
  const [a, b] = parts;
  return a === 0 || a === 10 || a === 127 || a >= 224 || (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127);
}

function assertPublicUrl(url: URL) {
  if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("Only HTTP and HTTPS websites can be analyzed.");
  if (url.username || url.password) throw new Error("Website credentials are not accepted in the scan URL.");
  if (url.port && url.port !== "80" && url.port !== "443") throw new Error("Only standard web ports can be analyzed.");
  const host = url.hostname.toLowerCase().replace(/\.$/, "");
  if (!host.includes(".") || host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") ||
      host.endsWith(".internal") || host.endsWith(".lan") || host === "::1" || host.startsWith("fc") ||
      host.startsWith("fd") || host.startsWith("fe80:") || blockedIpv4(host)) {
    throw new Error("This address is not a public website.");
  }
}

export function normalizeWebsiteInput(input: string) {
  const trimmed = input.trim();
  if (!trimmed || trimmed.length > 500 || /\s/.test(trimmed)) throw new Error("Enter a valid public website address.");
  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
  } catch {
    throw new Error("Enter a valid public website address.");
  }
  url.hash = "";
  assertPublicUrl(url);
  return url;
}

async function fetchText(startUrl: URL, maxBytes: number, accept: string) {
  let current = new URL(startUrl);
  for (let redirects = 0; redirects <= 3; redirects += 1) {
    assertPublicUrl(current);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12_000);
    let response: Response;
    try {
      response = await fetch(current, {
        redirect: "manual",
        signal: controller.signal,
        headers: {
          Accept: accept,
          "User-Agent": "RecomviaBot/0.1 (+https://recomvia.ai/methodology)",
        },
      });
    } finally {
      clearTimeout(timer);
    }
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      if (!location) throw new Error("The website returned an incomplete redirect.");
      current = new URL(location, current);
      continue;
    }
    const announcedLength = Number(response.headers.get("content-length") || "0");
    if (announcedLength > maxBytes) throw new Error("The response is larger than the scan safety limit.");
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes.byteLength > maxBytes) throw new Error("The response is larger than the scan safety limit.");
    return {
      url: current.toString(),
      status: response.status,
      contentType: response.headers.get("content-type") || "",
      text: new TextDecoder().decode(bytes),
      bytes: bytes.byteLength,
    };
  }
  throw new Error("The website redirected too many times.");
}

function attributes(tag: string) {
  const output: Record<string, string> = {};
  const pattern = /([:\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
  for (const match of tag.matchAll(pattern)) output[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? "";
  return output;
}

function metaContent(html: string, target: string) {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const attrs = attributes(tag);
    if ((attrs.name || attrs.property || "").toLowerCase() === target.toLowerCase()) return (attrs.content || "").trim();
  }
  return "";
}

function linkHref(html: string, rel: string) {
  for (const tag of html.match(/<link\b[^>]*>/gi) ?? []) {
    const attrs = attributes(tag);
    if ((attrs.rel || "").toLowerCase().split(/\s+/).includes(rel.toLowerCase())) return (attrs.href || "").trim();
  }
  return "";
}

function plainText(html: string) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function clip(value: string, length = 220) {
  return value.length > length ? `${value.slice(0, length - 1)}…` : value;
}

function makeFinding(input: Omit<ReadinessFinding, "sortOrder">, sortOrder: number): ReadinessFinding {
  return { ...input, sortOrder };
}

export async function runLiveReadinessScan(input: string): Promise<LiveReadinessResult> {
  const source = normalizeWebsiteInput(input);
  const page = await fetchText(source, MAX_HTML_BYTES, "text/html,application/xhtml+xml;q=0.9,*/*;q=0.1");
  if (!page.contentType.toLowerCase().includes("text/html") && !page.text.match(/<!doctype html|<html\b/i)) {
    throw new Error("The address did not return an HTML webpage.");
  }

  const finalUrl = new URL(page.url);
  const origin = finalUrl.origin;
  const robotsUrl = new URL("/robots.txt", origin);
  let robots: Awaited<ReturnType<typeof fetchText>> | null = null;
  try { robots = await fetchText(robotsUrl, MAX_AUX_BYTES, "text/plain,*/*;q=0.1"); } catch { robots = null; }
  const sitemapHint = robots?.text.match(/^\s*sitemap:\s*(\S+)/im)?.[1];
  let sitemapUrl: URL;
  try { sitemapUrl = sitemapHint ? new URL(sitemapHint, origin) : new URL("/sitemap.xml", origin); } catch { sitemapUrl = new URL("/sitemap.xml", origin); }
  let sitemap: Awaited<ReturnType<typeof fetchText>> | null = null;
  try { sitemap = await fetchText(sitemapUrl, MAX_AUX_BYTES, "application/xml,text/xml,text/plain,*/*;q=0.1"); } catch { sitemap = null; }

  const html = page.text;
  const text = plainText(html);
  const title = plainText(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "");
  const description = metaContent(html, "description");
  const canonical = linkHref(html, "canonical");
  const htmlLang = html.match(/<html\b[^>]*\blang\s*=\s*["']?([^\s"'>]+)/i)?.[1] || "";
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  const jsonLdBlocks = html.match(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi) || [];
  const jsonLdText = jsonLdBlocks.join(" ");
  const hasOrganization = /["']@type["']\s*:\s*(?:["']Organization["']|\[[^\]]*["']Organization["'])/i.test(jsonLdText);
  const hasFaq = /["']@type["']\s*:\s*["']FAQPage["']/i.test(jsonLdText);
  const hasQuestionHeadings = /<h[2-4]\b[^>]*>[^<]{0,120}(?:what|how|why|when|where|who|can|does|is|are|ما|ماذا|كيف|لماذا|هل|متى|أين|اين)[^<]*<\/h[2-4]>/i.test(html);
  const words = text ? text.split(/\s+/).length : 0;
  const globallyBlocked = Boolean(robots?.text.match(/user-agent:\s*\*[\s\S]{0,500}?disallow:\s*\/\s*(?:\r?\n|$)/i));
  const robotsHealthy = Boolean(robots && robots.status >= 200 && robots.status < 300 && !globallyBlocked);
  const sitemapHealthy = Boolean(sitemap && sitemap.status >= 200 && sitemap.status < 300 && /<(?:urlset|sitemapindex)\b/i.test(sitemap.text));
  const hasIdentityLink = /href\s*=\s*["'][^"']*(?:\/about(?:[-_/]|["'#?])|\/contact(?:[-_/]|["'#?])|\/company(?:[-_/]|["'#?])|عن-?ا|اتصل-?بنا)/i.test(html);
  const hasOpenGraph = Boolean(metaContent(html, "og:title") && metaContent(html, "og:description"));

  const findings: ReadinessFinding[] = [];
  let order = 1;
  const add = (finding: Omit<ReadinessFinding, "sortOrder">) => findings.push(makeFinding(finding, order++));

  add({ code: "page_access", category: "Technical AEO", severity: "critical", status: page.status >= 200 && page.status < 400 ? "pass" : "fail", title: "Homepage returns a usable response", explanation: "AI and search crawlers need a stable, successful HTML response before they can interpret the page.", evidence: `HTTP ${page.status} · ${page.contentType || "content type not supplied"}`, sourceUrl: page.url, weight: 15, awardedPoints: page.status >= 200 && page.status < 400 ? 15 : 0 });
  const titlePoints = title.length >= 15 && title.length <= 65 ? 7 : title ? 4 : 0;
  add({ code: "title", category: "Content readiness", severity: "high", status: titlePoints === 7 ? "pass" : titlePoints ? "partial" : "fail", title: "Page title is clear and extractable", explanation: "A concise title helps systems identify the page topic and brand without guessing.", evidence: title ? `${title.length} characters · ${clip(title)}` : "No title element was found.", sourceUrl: page.url, weight: 7, awardedPoints: titlePoints });
  const descriptionPoints = description.length >= 70 && description.length <= 180 ? 7 : description ? 4 : 0;
  add({ code: "meta_description", category: "Content readiness", severity: "medium", status: descriptionPoints === 7 ? "pass" : descriptionPoints ? "partial" : "fail", title: "Meta description summarizes the page", explanation: "A specific description gives retrieval systems a compact statement of the page purpose.", evidence: description ? `${description.length} characters · ${clip(description)}` : "No meta description was found.", sourceUrl: page.url, weight: 7, awardedPoints: descriptionPoints });
  add({ code: "canonical", category: "Technical AEO", severity: "high", status: canonical ? "pass" : "fail", title: "Canonical URL is declared", explanation: "A canonical reduces ambiguity between duplicate URL variants and consolidates discovery signals.", evidence: canonical ? clip(canonical) : "No canonical link was found.", sourceUrl: page.url, weight: 7, awardedPoints: canonical ? 7 : 0 });
  add({ code: "html_language", category: "Technical AEO", severity: "medium", status: htmlLang ? "pass" : "fail", title: "Document language is declared", explanation: "The document language helps systems interpret the content and market context correctly.", evidence: htmlLang ? `lang=${htmlLang}` : "The html element has no lang attribute.", sourceUrl: page.url, weight: 5, awardedPoints: htmlLang ? 5 : 0 });
  const h1Points = h1Count === 1 ? 6 : h1Count > 0 ? 3 : 0;
  add({ code: "primary_heading", category: "Content readiness", severity: "medium", status: h1Points === 6 ? "pass" : h1Points ? "partial" : "fail", title: "A single primary heading frames the page", explanation: "A stable primary heading makes the central subject easier to extract.", evidence: `${h1Count} H1 element${h1Count === 1 ? "" : "s"} found.`, sourceUrl: page.url, weight: 6, awardedPoints: h1Points });
  add({ code: "structured_data", category: "Technical AEO", severity: "medium", status: jsonLdBlocks.length ? "pass" : "fail", title: "JSON-LD structured data is present", explanation: "Structured data supplies explicit machine-readable facts, but it must match visible content.", evidence: `${jsonLdBlocks.length} JSON-LD block${jsonLdBlocks.length === 1 ? "" : "s"} found.`, sourceUrl: page.url, weight: 8, awardedPoints: jsonLdBlocks.length ? 8 : 0 });
  add({ code: "organization_entity", category: "Authority & entity", severity: "high", status: hasOrganization ? "pass" : "fail", title: "Organization entity is declared", explanation: "Organization markup can clarify the primary brand entity and connect consistent identifiers.", evidence: hasOrganization ? "Organization type found in JSON-LD." : "No Organization type was found in JSON-LD.", sourceUrl: page.url, weight: 8, awardedPoints: hasOrganization ? 8 : 0 });
  const answerReady = hasFaq || hasQuestionHeadings;
  add({ code: "answer_structure", category: "Content readiness", severity: "medium", status: answerReady ? "pass" : "fail", title: "Question-and-answer structure is discoverable", explanation: "Direct question headings and self-contained answers improve answer extraction for relevant queries.", evidence: hasFaq ? "FAQPage structured data found." : hasQuestionHeadings ? "Question-led headings found in visible HTML." : "No FAQPage schema or question-led headings were detected.", sourceUrl: page.url, weight: 8, awardedPoints: answerReady ? 8 : 0 });
  const contentPoints = words >= 300 ? 8 : words >= 100 ? 4 : 0;
  add({ code: "content_depth", category: "Content readiness", severity: "medium", status: contentPoints === 8 ? "pass" : contentPoints ? "partial" : "fail", title: "The page exposes enough readable context", explanation: "Thin pages often lack the facts and distinctions needed for confident understanding.", evidence: `Approximately ${words.toLocaleString("en-US")} visible words detected.`, sourceUrl: page.url, weight: 8, awardedPoints: contentPoints });
  add({ code: "robots_policy", category: "Technical AEO", severity: "critical", status: robotsHealthy ? "pass" : "fail", title: "Crawler policy is accessible and permits discovery", explanation: "A readable robots policy should not block the entire site from general crawlers.", evidence: robots ? `HTTP ${robots.status}${globallyBlocked ? " · broad Disallow: / detected" : ""}` : "robots.txt could not be retrieved.", sourceUrl: robotsUrl.toString(), weight: 7, awardedPoints: robotsHealthy ? 7 : 0 });
  add({ code: "xml_sitemap", category: "Technical AEO", severity: "high", status: sitemapHealthy ? "pass" : "fail", title: "XML sitemap is available", explanation: "A valid sitemap gives crawlers a reliable inventory of canonical content URLs.", evidence: sitemap ? `HTTP ${sitemap.status} · ${sitemapHealthy ? "valid sitemap structure detected" : "no urlset or sitemapindex detected"}` : "A sitemap could not be retrieved.", sourceUrl: sitemapUrl.toString(), weight: 7, awardedPoints: sitemapHealthy ? 7 : 0 });
  add({ code: "identity_paths", category: "Authority & entity", severity: "medium", status: hasIdentityLink ? "pass" : "fail", title: "Identity and contact paths are visible", explanation: "Clear company and contact paths help users and systems verify who is responsible for the site.", evidence: hasIdentityLink ? "An About, Company, or Contact path was found." : "No clear About, Company, or Contact path was detected in homepage links.", sourceUrl: page.url, weight: 6, awardedPoints: hasIdentityLink ? 6 : 0 });
  add({ code: "open_graph", category: "Content readiness", severity: "low", status: hasOpenGraph ? "pass" : "fail", title: "Share metadata describes the page", explanation: "Open Graph metadata provides another consistent summary when the page is shared or referenced.", evidence: hasOpenGraph ? "og:title and og:description were found." : "og:title or og:description is missing.", sourceUrl: page.url, weight: 6, awardedPoints: hasOpenGraph ? 6 : 0 });

  const readinessScore = Math.max(0, Math.min(100, findings.reduce((sum, finding) => sum + finding.awardedPoints, 0)));
  const categories = ["Technical AEO", "Content readiness", "Authority & entity"] as const;
  const categoryScores = Object.fromEntries(categories.map((category) => {
    const rows = findings.filter((finding) => finding.category === category);
    const possible = rows.reduce((sum, finding) => sum + finding.weight, 0);
    const awarded = rows.reduce((sum, finding) => sum + finding.awardedPoints, 0);
    return [category, possible ? Math.round((awarded / possible) * 100) : 0];
  })) as LiveReadinessResult["categoryScores"];
  const issueRows = findings.filter((finding) => finding.status !== "pass");
  const requestCount = 1 + (robots ? 1 : 0) + (sitemap ? 1 : 0);
  const bytesFetched = page.bytes + (robots?.bytes || 0) + (sitemap?.bytes || 0);
  const confidence = Math.min(92, 72 + (robots ? 5 : 0) + (sitemap ? 5 : 0) + (jsonLdBlocks.length ? 4 : 0) + (page.status === 200 ? 4 : 0));

  return {
    sourceUrl: source.toString(), finalUrl: page.url, httpStatus: page.status, readinessScore, confidence,
    issueCount: issueRows.length,
    criticalCount: issueRows.filter((finding) => finding.severity === "critical").length,
    bytesFetched, requestCount, methodologyVersion: READINESS_METHODOLOGY_VERSION,
    actualVisibilityStatus: "not_measured", categoryScores, findings,
  };
}
