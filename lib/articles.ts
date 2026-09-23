export type ArticleSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type Article = {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  excerpt: string;
  category: "Strategy" | "Measurement" | "Technical" | "Content" | "Authority" | "International";
  published: string;
  modified: string;
  readingTime: string;
  keywords: string[];
  directAnswer: string;
  keyPoints: string[];
  sections: ArticleSection[];
  faqs: { question: string; answer: string }[];
  sources: { label: string; url: string }[];
};

export const SITE_URL = "https://recomvia-ai-visibility.omarghazi85.chatgpt.site";

export const articles: Article[] = [
  {
    slug: "ai-visibility-optimization-guide",
    title: "AI Visibility Optimization: A Practical Guide for Brands",
    seoTitle: "AI Visibility Optimization: The Practical Guide",
    description: "Learn what AI visibility optimization measures, how it differs from technical readiness, and how to improve brand recommendations and citations.",
    excerpt: "A clear operating model for measuring how AI systems find, understand, cite, and recommend a brand — and turning evidence into action.",
    category: "Strategy",
    published: "2026-09-13",
    modified: "2026-09-13",
    readingTime: "9 min read",
    keywords: ["AI visibility optimization", "AI brand visibility", "AI search optimization", "generative search visibility"],
    directAnswer: "AI visibility optimization is the continuous process of measuring whether AI-powered search and answer systems can find, understand, cite, and recommend a brand, then improving the technical, content, entity, and authority signals that influence those outcomes. It combines observed answer visibility with website readiness rather than treating either one as proof of the other.",
    keyPoints: [
      "Measure observed recommendations separately from website readiness.",
      "Record every prompt, market, language, engine surface, timestamp, and run.",
      "Connect each finding to evidence and a reversible improvement.",
      "Repeat tests because generative answers are probabilistic, not fixed rankings.",
    ],
    sections: [
      {
        heading: "What AI visibility actually includes",
        paragraphs: [
          "Traditional search visibility is usually discussed through rankings, impressions, clicks, and conversions. AI visibility adds a different layer: whether a brand is present inside a generated answer, how it is described, whether it is recommended for a commercial need, which sources support the answer, and how consistently the outcome appears across repeated runs. A company can rank well for several queries and still be absent from an AI-generated shortlist. It can also be mentioned without being recommended or cited.",
          "A useful measurement system therefore separates mention rate, recommendation rate, citation rate, position, share of voice, cross-engine coverage, sentiment, and factual accuracy. These are not interchangeable. A mention answers “Was the brand named?” A recommendation asks “Was it proposed as a suitable choice?” A citation asks “Did the system link or attribute evidence to the brand or one of its pages?” Each signal describes a different level of visibility and commercial value.",
        ],
      },
      {
        heading: "Observed visibility is not the same as readiness",
        paragraphs: [
          "A technically excellent website may still be missing from AI answers because it lacks external authority, clear entity signals, relevant evidence, or content that matches buyer intent. Conversely, a widely known brand may appear frequently despite weak structured data or imperfect page architecture. Combining those situations into one unexplained score hides the real diagnosis.",
          "The practical model uses two evidence families. Actual AI visibility measures what happened in defined answer environments. AEO and GEO readiness evaluates why the website may be easy or difficult to retrieve, interpret, trust, and quote. Keeping them separate lets a team choose the right intervention: fix crawlability, clarify the entity, improve answer coverage, publish original evidence, or strengthen independent authority.",
        ],
      },
      {
        heading: "How an optimization cycle works",
        paragraphs: [
          "Start with a prompt set derived from the company’s real products, services, markets, competitors, and commercial intents. Test those prompts in defined engine surfaces, then retain the response, sources, market, language, mode, timestamp, and run number. Analyze observable outcomes before auditing the website. This order prevents a checklist from being mistaken for actual market visibility.",
          "After diagnosis, prioritize improvements by expected impact, confidence, safety, cost, and reversibility. Technical and content changes should be previewed before implementation, stored with version history, and measured again after release. The complete cycle is Measure → Explain → Fix → Monitor → Improve. Optimization is not a one-time rewrite because websites, competitors, indexes, models, and answer behavior all change.",
        ],
        bullets: [
          "Choose high-intent prompts grounded in real customer decisions.",
          "Label the exact engine surface instead of using a generic engine name.",
          "Show the evidence behind every important issue.",
          "Recheck outcomes after implementation and over time.",
        ],
      },
    ],
    faqs: [
      { question: "Is AI visibility optimization the same as SEO?", answer: "No. SEO remains a foundation for discovery and indexing, while AI visibility also measures brand presence, citations, recommendations, answer consistency, and factual representation inside generative experiences." },
      { question: "Can AI recommendations be guaranteed?", answer: "No. Third-party AI systems are probabilistic and outside a brand’s control. A credible provider can improve measurable inputs and monitor outcomes, but cannot guarantee a recommendation." },
      { question: "How often should AI visibility be measured?", answer: "The cadence should reflect the market and plan, but repeated runs and periodic monitoring are essential. A single answer is evidence of one run, not a stable market position." },
    ],
    sources: [
      { label: "Google: Optimizing for generative AI features", url: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide" },
      { label: "Google: AI features and your website", url: "https://developers.google.com/search/docs/appearance/ai-features" },
      { label: "Google: Creating helpful, reliable, people-first content", url: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content" },
    ],
  },
  {
    slug: "why-ai-does-not-recommend-your-brand",
    title: "Why AI Does Not Recommend Your Brand — and How to Diagnose It",
    seoTitle: "Why AI Does Not Recommend Your Brand",
    description: "Diagnose why ChatGPT, Gemini, Perplexity, and AI search experiences may omit your brand from high-intent recommendations.",
    excerpt: "Absence from an AI answer is rarely explained by one missing tag. Use this diagnosis tree to find the real constraint.",
    category: "Strategy",
    published: "2026-09-13",
    modified: "2026-09-13",
    readingTime: "8 min read",
    keywords: ["why AI does not recommend my brand", "ChatGPT brand recommendation", "AI recommendation visibility", "brand missing from AI answers"],
    directAnswer: "AI may not recommend a brand because the system cannot confidently connect it to the requested category, lacks reliable evidence that it satisfies the user’s criteria, retrieves stronger competitors, or cannot access and extract the relevant information. The diagnosis must test actual answer behavior and then inspect entity clarity, content fit, authority, crawlability, and market relevance.",
    keyPoints: [
      "First confirm whether the problem is absence, weak position, or inconsistent description.",
      "Test commercial and recommendation prompts, not only branded questions.",
      "Compare the evidence supporting selected competitors.",
      "Fix the limiting signal rather than applying a generic SEO checklist.",
    ],
    sections: [
      {
        heading: "Begin with the exact form of the loss",
        paragraphs: [
          "“AI does not recommend us” can describe several different problems. The brand may never appear, appear only when explicitly named, be listed below competitors, be mentioned without a link, or be described inaccurately. Those outcomes require different remedies. A brand that appears only in branded prompts has an awareness gap in generic discovery. A brand that is named but never cited may have an evidence or source-selection problem. A brand described under the wrong category may have an entity problem.",
          "Create a compact matrix of high-intent questions such as best, recommended, compare, alternative, who provides, and which company. Run each question more than once in the exact languages and countries that matter. Record not only the answer but the sources, order, sentiment, claims, and competitors. This turns a vague complaint into a measurable pattern.",
        ],
      },
      {
        heading: "Five common causes of weak recommendations",
        paragraphs: [
          "The first cause is category ambiguity: the website uses broad language and never states what the company is, whom it serves, or what problem it solves. The second is intent mismatch: content explains the company but does not answer the comparison or recommendation criteria a buyer is asking about. The third is weak corroboration: important claims exist only on the brand’s own pages and are not supported by independent, credible sources.",
          "The fourth cause is retrieval friction, including blocked crawling, content hidden behind client-side interactions, conflicting canonicals, weak internal linking, or pages that do not expose the main answer clearly. The fifth is competitive evidence. AI systems may retrieve accessible, specific, current material about competitors that better matches the prompt. The diagnosis should compare why selected sources won rather than merely count how many times the brand lost.",
        ],
        bullets: [
          "Category and entity ambiguity",
          "Weak match to buyer-intent questions",
          "Insufficient independent evidence",
          "Crawling or extraction friction",
          "Stronger competitor-specific evidence",
        ],
      },
      {
        heading: "Turn the diagnosis into an action plan",
        paragraphs: [
          "Map every lost prompt to the likely limiting signal and an observable fix. If the issue is entity clarity, align the organization name, description, service taxonomy, author identity, and trusted profiles. If the issue is content coverage, create a useful page that directly resolves the decision criteria, includes verifiable facts, and links to supporting evidence. If the problem is authority, original research, expert commentary, and legitimate third-party coverage matter more than manufactured mentions.",
          "Finally, rerun the same prompt set after search systems have had time to discover and process the change. A page improvement is complete when it is technically deployed, but the visibility hypothesis is validated only when later measurements show a meaningful change. Even then, report confidence and variation rather than presenting one favorable answer as a permanent win.",
        ],
      },
    ],
    faqs: [
      { question: "Will adding schema make ChatGPT recommend my company?", answer: "No. Structured data can clarify page meaning for supported systems, but it does not create authority or guarantee selection in an AI answer." },
      { question: "Should I ask AI systems directly why they omitted my brand?", answer: "That explanation can be a hypothesis, not definitive evidence of the system’s internal decision process. Use observable prompts, sources, competitors, and website signals for diagnosis." },
      { question: "How many prompts are enough for a diagnosis?", answer: "There is no universal number. Use a bounded set that covers the brand’s important topics and commercial intents, then repeat runs to distinguish a pattern from normal answer variation." },
    ],
    sources: [
      { label: "Google: AI features and your website", url: "https://developers.google.com/search/docs/appearance/ai-features" },
      { label: "Google: Search technical requirements", url: "https://developers.google.com/search/docs/essentials/technical" },
      { label: "OpenAI: Overview of OpenAI crawlers", url: "https://developers.openai.com/bots" },
    ],
  },
  {
    slug: "aeo-vs-geo-vs-seo",
    title: "AEO vs GEO vs SEO: What Changes and What Still Matters",
    seoTitle: "AEO vs GEO vs SEO: The Practical Difference",
    description: "Compare SEO, AEO, and GEO without hype. Learn which foundations overlap and which AI visibility outcomes require separate measurement.",
    excerpt: "The labels overlap, but the outcomes do not. Here is the practical boundary between search rankings, answer extraction, and generative visibility.",
    category: "Strategy",
    published: "2026-09-13",
    modified: "2026-09-13",
    readingTime: "8 min read",
    keywords: ["AEO vs GEO", "GEO vs SEO", "answer engine optimization", "generative engine optimization"],
    directAnswer: "SEO improves discovery and performance in search systems; AEO focuses on making information clear and usable in direct answers; GEO focuses on visibility, citation, and representation in generative experiences. They share foundations such as crawlability, useful content, and authority, but AEO and GEO require additional outcome measurements that ordinary rankings do not capture.",
    keyPoints: [
      "SEO remains a foundation rather than becoming obsolete.",
      "AEO emphasizes clear answers and machine-understandable context.",
      "GEO examines generated mentions, citations, recommendations, and representation.",
      "The terminology matters less than a measurable, defensible operating model.",
    ],
    sections: [
      {
        heading: "Where the three disciplines overlap",
        paragraphs: [
          "All three depend on a website being discoverable, accessible, useful, and trustworthy. Clean architecture, crawlable HTML, sensible internal links, canonical URLs, accurate structured data, current information, and original value remain important. Google’s current guidance explicitly says that established SEO practices continue to apply to its generative search features and that no special markup is required simply to appear in them.",
          "This overlap is why claims that GEO replaces SEO are misleading. Generative systems frequently rely on retrieval, search indexes, and source material from the open web. If important pages are unavailable, duplicated, vague, or unsupported, changing the label on the optimization work will not solve the underlying problem.",
        ],
      },
      {
        heading: "Where the outcomes differ",
        paragraphs: [
          "SEO commonly measures rankings, impressions, organic sessions, click-through rate, and conversions. AEO adds questions such as whether a page contains a complete, direct response that can stand on its own and whether the relationship between the question, answer, evidence, author, and entity is clear. GEO adds whether a brand appears in generated answers, is recommended, receives a citation, is represented accurately, and maintains visibility across engines and repeated runs.",
          "A site can therefore improve an AEO readiness score without immediately improving its observed AI visibility. It has made its information easier to understand, but retrieval, authority, competition, and index refreshes may still limit exposure. Conversely, a famous brand may have high generated visibility despite poor readiness. A credible report names both conditions instead of forcing them into a single story.",
        ],
      },
      {
        heading: "Avoid invented GEO requirements",
        paragraphs: [
          "There is no universal file, schema type, word count, or page template that guarantees generative visibility. Google states that it does not require tiny content “chunks,” an AI-specific rewrite style, or an llms.txt file for its search experiences. Structured data still has legitimate uses, but it should describe visible content accurately and support established search features rather than being sold as a secret recommendation switch.",
          "The strongest practice is outcome-led: define the buyer questions that matter, observe where the brand appears, diagnose the specific limiting signals, improve them safely, and measure again. Whether a team calls this SEO, AEO, GEO, or AI visibility optimization is secondary to the quality of the evidence and the honesty of the claims.",
        ],
      },
    ],
    faqs: [
      { question: "Is GEO replacing SEO?", answer: "No. Generative discovery creates new outcomes to measure, but technical accessibility, useful content, authority, and search indexing remain foundational." },
      { question: "Does Google require llms.txt for AI Overviews?", answer: "No. Google’s official guidance says its Search systems do not use llms.txt as a special requirement for generative search visibility." },
      { question: "Which term should a company use?", answer: "Use the term your audience understands, but define the measurable outcome. “AI visibility optimization” is durable because it centers on observable brand presence and improvement rather than one changing acronym." },
    ],
    sources: [
      { label: "Google: Optimizing for generative AI features", url: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide" },
      { label: "Google: AI features and your website", url: "https://developers.google.com/search/docs/appearance/ai-features" },
      { label: "Google Search Essentials", url: "https://developers.google.com/search/docs/essentials" },
    ],
  },
  {
    slug: "ai-visibility-score-methodology",
    title: "How to Build an AI Visibility Score That Clients Can Trust",
    seoTitle: "How to Build a Trustworthy AI Visibility Score",
    description: "A defensible methodology for AI visibility scoring, covering prompt design, observed outcomes, readiness, repetition, weighting, and confidence.",
    excerpt: "A score is useful only when a client can inspect what created it, distinguish observation from readiness, and understand its uncertainty.",
    category: "Measurement",
    published: "2026-09-13",
    modified: "2026-09-13",
    readingTime: "10 min read",
    keywords: ["AI visibility score", "AI visibility measurement", "GEO score methodology", "AI recommendation score"],
    directAnswer: "A trustworthy AI visibility score combines clearly defined observed outcomes — such as mentions, recommendations, citations, position, coverage, and consistency — with separately reported readiness dimensions. Every input must be measurable, explainable, repeatable, time-stamped, and connected to evidence. Weighting should reflect business intent while confidence reveals sample size and answer volatility.",
    keyPoints: [
      "Never use technical readiness as a substitute for observed visibility.",
      "Normalize metrics before weighting them into a composite score.",
      "Weight high-intent prompts more than low-value informational prompts.",
      "Show confidence, sample size, and volatility beside the score.",
    ],
    sections: [
      {
        heading: "Define the unit of measurement first",
        paragraphs: [
          "The defensible unit is not “the brand in ChatGPT.” It is Brand × Topic × Prompt × Language × Country × Engine surface × Run. Each dimension can change the outcome. A comparison prompt in Arabic for Saudi Arabia is not equivalent to its English translation, and an API response is not automatically the same product experience as a consumer interface using search, personalization, or a different model.",
          "Store the complete context for each observation. At minimum, keep the prompt, normalized intent, engine and surface, search or model mode, language, country, timestamp, run number, response, cited sources, detected brands, positions, and quality checks. Without that lineage, a dashboard number cannot be audited or reproduced.",
        ],
      },
      {
        heading: "Build scores from interpretable components",
        paragraphs: [
          "Observed visibility can include mention rate, recommendation rate, citation rate, normalized recommendation position, buyer-intent coverage, cross-engine coverage, response consistency, sentiment, and factual accuracy. Readiness can include authority and entity clarity, content readiness, technical AEO, and language-market fit. Publish the dimensions separately before combining them into a headline score.",
          "Normalize each component to a consistent scale and document the formula. Weighting should follow business value rather than convenience. A recommendation for a high-intent category question may deserve more weight than a passing mention in an informational answer. Citation rate should not be treated as identical to recommendation rate. If a metric cannot be explained in plain language or connected to an action, remove it.",
        ],
        bullets: [
          "Observable: the input comes from stored evidence.",
          "Interpretable: a client can understand what a change means.",
          "Repeatable: another run can follow the same protocol.",
          "Actionable: a weak result maps to a reasonable intervention.",
        ],
      },
      {
        heading: "Report uncertainty instead of hiding it",
        paragraphs: [
          "Generated answers vary. A score based on one run per prompt may be precise in appearance and weak in reality. Repeat important prompts, estimate consistency, and display confidence based on sample size, cross-run agreement, extraction quality, and source availability. Confidence should not reward a favorable result; it should describe how much trust to place in the measurement.",
          "Version the methodology so historical changes remain intelligible. If weights, prompt-generation rules, engine surfaces, or classifiers change, preserve the previous version and explain the break in comparability. A responsible score is not designed to make every customer feel good. It is designed to make the next decision clearer.",
        ],
      },
    ],
    faqs: [
      { question: "What is a good AI visibility score?", answer: "There is no universal threshold. Interpret a score against the documented methodology, business intent, relevant competitors, market, language, sample size, and historical trend." },
      { question: "Should technical SEO be part of the headline score?", answer: "It can be a documented component, but observed visibility and technical readiness must remain separately visible so a strong audit does not imply actual recommendations." },
      { question: "Can scores from different tools be compared?", answer: "Usually not directly. Tools may test different prompts, engines, locations, modes, run counts, extraction rules, and weights. Compare methodologies before comparing numbers." },
    ],
    sources: [
      { label: "Recomvia public methodology", url: `${SITE_URL}/methodology` },
      { label: "Google: AI features and your website", url: "https://developers.google.com/search/docs/appearance/ai-features" },
      { label: "Google: Evaluating third-party SEO advice", url: "https://developers.google.com/search/docs/fundamentals/do-i-need-seo" },
    ],
  },
  {
    slug: "technical-ai-crawlability-checklist",
    title: "Technical AI Crawlability Checklist for Modern Websites",
    seoTitle: "Technical AI Crawlability Checklist",
    description: "Audit robots rules, rendering, canonicals, sitemaps, structured data, internal links, and AI crawler access with this practical checklist.",
    excerpt: "Before optimizing copy, verify that search and AI retrieval systems can reach the right URL, render its main content, and understand its canonical identity.",
    category: "Technical",
    published: "2026-09-13",
    modified: "2026-09-13",
    readingTime: "10 min read",
    keywords: ["AI crawlability checklist", "AI crawler robots.txt", "technical AEO", "OAI-SearchBot robots"],
    directAnswer: "An AI crawlability audit verifies that important pages return successful responses, expose meaningful HTML, allow the intended search and AI crawlers, use consistent canonical URLs, appear in XML sitemaps, receive internal links, and present structured data that matches visible content. Access is necessary for retrieval, but it does not guarantee indexing, citation, or recommendation.",
    keyPoints: [
      "Audit crawler policies by user agent and business purpose.",
      "Ensure the main answer exists in rendered HTML without fragile interactions.",
      "Align canonicals, internal links, sitemaps, and alternate-language URLs.",
      "Validate structured data against the visible page rather than adding speculative markup.",
    ],
    sections: [
      {
        heading: "Check access before interpretation",
        paragraphs: [
          "Start with the public URL. It should return an appropriate 200 response, avoid unnecessary redirect chains, and deliver the primary content without authentication. Review robots.txt and page-level robots directives together. A site may allow a crawler globally while a template inserts noindex, or it may block a dedicated search crawler while assuming another bot name covers the same purpose.",
          "Crawler controls differ by provider. OpenAI documents OAI-SearchBot for surfacing sites in ChatGPT search and distinguishes it from GPTBot, which relates to potential model training. Make policy choices deliberately, verify documented user agents, and avoid copying an old robots file without understanding which product behavior it controls.",
        ],
      },
      {
        heading: "Make the canonical content easy to retrieve",
        paragraphs: [
          "Important information should be present in accessible rendered HTML. Client-side applications can be indexed, but unnecessary rendering dependency creates more points of failure. Confirm that headings, body copy, evidence, dates, author or organization identity, and key links appear without requiring a click, scroll-triggered fetch, or session-specific state.",
          "Align the canonical tag, redirect behavior, XML sitemap, internal links, and structured data URL. Conflicting signals force search systems to choose a representative version and can split discovery across variants. Include canonical URLs in the sitemap and link consistently to those URLs from the site. For localized pages, each language page should normally canonicalize to itself and use valid reciprocal hreflang annotations.",
        ],
        bullets: [
          "Public 200 response for indexable pages",
          "Correct robots.txt and meta robots policy",
          "Stable server-rendered or reliably rendered main content",
          "Self-consistent canonical and internal URLs",
          "XML sitemap containing only preferred indexable URLs",
          "Structured data matching visible content",
        ],
      },
      {
        heading: "Use freshness signals responsibly",
        paragraphs: [
          "Show accurate publication and modification dates when they help users, and update the visible content when changing the modified date. Automatically changing dates without substantive revision creates an unreliable freshness signal. Keep sitemaps current and notify supported search systems when important URLs are added, updated, or removed. IndexNow provides a protocol for participating engines, while Google recommends sitemaps and Search Console workflows.",
          "Finish the audit with real fetches, rendered output checks, structured-data validation, log analysis, and index inspection. Passing a checklist means the page is technically eligible for discovery; it does not prove that the content is useful enough to rank or authoritative enough to be cited. Report those layers separately.",
        ],
      },
    ],
    faqs: [
      { question: "Should a website allow every AI crawler?", answer: "Not automatically. Decide according to each crawler’s documented purpose, the organization’s content policy, legal requirements, and business goals." },
      { question: "Does a sitemap guarantee indexing?", answer: "No. A sitemap is a discovery hint that identifies preferred URLs. Search engines still decide whether and when to crawl, index, and serve a page." },
      { question: "Is structured data required for generative AI visibility?", answer: "No universal AI-specific schema is required. Accurate structured data can clarify page meaning and support established search features, but it does not guarantee AI inclusion." },
    ],
    sources: [
      { label: "OpenAI: Overview of OpenAI crawlers", url: "https://developers.openai.com/bots" },
      { label: "Google: Build and submit a sitemap", url: "https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap" },
      { label: "Google: Canonical URL guidance", url: "https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls" },
      { label: "IndexNow documentation", url: "https://www.indexnow.org/documentation" },
    ],
  },
  {
    slug: "answer-extractability-content-design",
    title: "Answer Extractability: How to Write Content AI Systems Can Use",
    seoTitle: "Answer Extractability for AI Search Content",
    description: "Design clear answer blocks, evidence, headings, and page structure that serve readers and improve content extractability for AI search.",
    excerpt: "Extractable content is not robotic content. It gives readers a complete answer quickly, then supplies the context and evidence needed to trust it.",
    category: "Content",
    published: "2026-09-13",
    modified: "2026-09-13",
    readingTime: "8 min read",
    keywords: ["answer extractability", "AEO content writing", "write for AI search", "answer engine content structure"],
    directAnswer: "Answer extractability is the degree to which a page presents a complete, accurate response that can be understood with its subject, scope, conditions, and evidence intact. Improve it by aligning one clear question with a direct answer, using descriptive headings, defining entities, supporting claims, exposing dates and authorship, and adding necessary context without fragmenting the page into artificial keyword chunks.",
    keyPoints: [
      "Lead important sections with a direct, self-contained answer.",
      "Keep the entity, claim, scope, and qualification together.",
      "Support decisions with original evidence and cited sources.",
      "Write for human comprehension; there is no required AI word count or chunk size.",
    ],
    sections: [
      {
        heading: "What makes an answer usable",
        paragraphs: [
          "A usable answer resolves the question without forcing the reader to reconstruct meaning from several vague paragraphs. It names the subject, states the conclusion, defines relevant conditions, and avoids pronouns whose reference disappears when a passage is quoted. For commercial content, it should also make the audience, use case, limitation, and evidence clear.",
          "For example, “It helps teams work better” is neither distinctive nor extractable. “Acme is a workflow automation platform for small distributed teams managing recurring approvals and task handoffs” retains its meaning outside the surrounding paragraph. Specificity benefits readers first and also reduces ambiguity for retrieval and answer systems.",
        ],
      },
      {
        heading: "Build an answer-first section without flattening the article",
        paragraphs: [
          "Use a descriptive heading that reflects a real question, then provide a concise answer in the opening paragraph. Follow it with evidence, exceptions, examples, methodology, or implementation detail. Tables work well for exact comparisons, while lists work for genuinely sequential steps or distinct checks. Do not convert every sentence into a bullet or repeat the same keyword mechanically.",
          "Google’s current guidance says there is no required content chunking pattern or ideal page length for generative search. The purpose is not to write “for the robot.” The purpose is to reduce ambiguity and deliver non-commodity value. A complex subject may require a long, connected explanation; a simple question may need only a short, precise page.",
        ],
        bullets: [
          "Question-shaped heading",
          "Direct answer with the named subject",
          "Conditions and limitations",
          "Evidence or method",
          "Example or implementation guidance",
        ],
      },
      {
        heading: "Measure content quality beyond extraction",
        paragraphs: [
          "Extractability is only one dimension. A clear answer can still be wrong, generic, outdated, or unsupported. Review factual accuracy, source quality, topical completeness, information gain, author expertise, freshness, and alignment with the searcher’s intent. Original data, transparent methodology, and lived expertise create reasons for others to cite the page.",
          "Measure whether improved sections are discovered and represented accurately, but do not optimize by copying generated answers back into the website. That creates a loop of derivative content. The stronger approach is to publish information the answer ecosystem did not already have, then make that information clear enough to retrieve and verify.",
        ],
      },
    ],
    faqs: [
      { question: "How long should an answer block be?", answer: "There is no universal length. It should be as short as possible while preserving the subject, conclusion, scope, and critical qualification." },
      { question: "Should every heading be a question?", answer: "No. Use headings that accurately describe the section. Question headings are useful when they match a real user need, not as a mechanical template." },
      { question: "Does answer-first writing guarantee an AI citation?", answer: "No. It can improve clarity and usability, but retrieval, authority, competition, freshness, and each engine’s behavior also influence citation outcomes." },
    ],
    sources: [
      { label: "Google: Optimizing for generative AI features", url: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide" },
      { label: "Google: Helpful, reliable, people-first content", url: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content" },
      { label: "Google: Guidance for generative AI content", url: "https://developers.google.com/search/docs/fundamentals/using-gen-ai-content" },
    ],
  },
  {
    slug: "entity-clarity-ai-search",
    title: "Entity Clarity for AI Search: Help Systems Understand Your Brand",
    seoTitle: "Entity Clarity for AI Search and Brand Visibility",
    description: "Improve brand entity clarity through consistent identity, service definitions, authorship, structured data, and trusted corroboration.",
    excerpt: "A system cannot recommend a brand confidently if it cannot determine exactly what the organization is, does, serves, and can prove.",
    category: "Authority",
    published: "2026-09-13",
    modified: "2026-09-13",
    readingTime: "9 min read",
    keywords: ["entity SEO AI", "brand entity optimization", "AI search entity clarity", "organization schema AI"],
    directAnswer: "Entity clarity is the consistency and specificity with which a brand’s website and trusted external sources identify the organization, its category, offerings, locations, people, and relationships. Improve it by aligning names and descriptions, creating authoritative organization and author pages, using accurate structured data, connecting verified profiles, and resolving contradictory claims across the web.",
    keyPoints: [
      "Use one stable organization name and a precise category description.",
      "Connect services, people, locations, evidence, and official profiles.",
      "Make visible content and structured data agree.",
      "Treat external consistency as corroboration, not a volume game.",
    ],
    sections: [
      {
        heading: "Entity ambiguity is a business problem",
        paragraphs: [
          "Brands often describe themselves with broad language such as “innovative solutions for the future.” That may sound polished, but it does not establish a category, customer, product, or market. Ambiguity becomes more damaging when the home page, directory profiles, social accounts, press releases, and structured data use different names or descriptions.",
          "AI and search systems try to connect references that describe the same real-world organization. Clear identity helps them distinguish a company from similarly named entities and understand how products, founders, authors, locations, and topics relate. It also helps people verify who is responsible for a claim.",
        ],
      },
      {
        heading: "Build an entity foundation",
        paragraphs: [
          "Start with a canonical organization page that states the legal or recognized brand name, concise description, primary category, official URL, markets, contact route, and important relationships. Create useful pages for services and products instead of hiding definitions inside marketing prose. Where authorship matters, provide author pages that explain relevant expertise and link to their work.",
          "Add Organization, WebSite, Article, Person, Service, Product, or other structured data only when the type accurately describes visible content. Use stable identifiers and official profile links where appropriate. Structured data is an explicit clue, not permission to claim information that users cannot see on the page.",
        ],
        bullets: [
          "Stable brand name and URL",
          "Specific category and audience",
          "Consistent product and service taxonomy",
          "Real author and editorial identity",
          "Verified external profile connections",
          "Accurate structured data tied to visible content",
        ],
      },
      {
        heading: "Audit consistency across trusted sources",
        paragraphs: [
          "Review the sources that search and answer systems may retrieve: major profiles, relevant directories, partner pages, interviews, regulatory records, review platforms, and credible coverage. Correct outdated descriptions where you control the page and document conflicts you cannot directly change. The objective is not to manufacture hundreds of mentions; it is to reduce factual disagreement in sources that matter.",
          "Track entity accuracy in generated answers as a separate metric. A brand may be visible but misclassified, assigned an old product, or confused with another company. Improvement should reduce those errors across repeated prompts and languages, not merely increase the number of times the name appears.",
        ],
      },
    ],
    faqs: [
      { question: "Is Organization schema enough to establish a brand entity?", answer: "No. It is one explicit clue. Visible website content, consistent official profiles, independent corroboration, and clear relationships are also important." },
      { question: "What is sameAs in structured data?", answer: "sameAs can connect an entity to other URLs that unambiguously identify the same entity. Use verified, relevant profiles rather than every page that mentions the brand." },
      { question: "Can a brand be visible but have poor entity clarity?", answer: "Yes. It may be mentioned because it is well known while still being described inconsistently or inaccurately. Visibility and factual accuracy should be reported separately." },
    ],
    sources: [
      { label: "Schema.org: Organization", url: "https://schema.org/Organization" },
      { label: "Google: Organization structured data", url: "https://developers.google.com/search/docs/appearance/structured-data/organization" },
      { label: "Google: Article author markup guidance", url: "https://developers.google.com/search/docs/appearance/structured-data/article" },
    ],
  },
  {
    slug: "earn-ai-citations-source-authority",
    title: "How to Earn AI Citations Without Chasing Manipulative Mentions",
    seoTitle: "How to Earn AI Citations and Build Source Authority",
    description: "Build legitimate AI citation opportunities with original evidence, expert sources, clear methodology, and useful reference assets.",
    excerpt: "Citation visibility grows from information worth retrieving and sources worth trusting, not from buying a cloud of empty mentions.",
    category: "Authority",
    published: "2026-09-13",
    modified: "2026-09-13",
    readingTime: "9 min read",
    keywords: ["earn AI citations", "AI citation optimization", "source authority GEO", "brand citations ChatGPT"],
    directAnswer: "Brands earn stronger AI citation opportunities by publishing original, verifiable information that answers specific questions better than existing sources, exposing a transparent method and responsible author, keeping facts current, and earning legitimate references from relevant independent websites. Citation optimization cannot guarantee selection and should not rely on fabricated mentions or low-quality syndication.",
    keyPoints: [
      "Create a source asset, not another summary of existing articles.",
      "Expose definitions, methods, dates, samples, and limitations.",
      "Make facts easy to quote without separating them from context.",
      "Seek relevant independent validation rather than raw mention volume.",
    ],
    sections: [
      {
        heading: "Why some pages become sources",
        paragraphs: [
          "A source page contributes information that helps resolve the question: a dataset, benchmark, definition, method, expert explanation, comparison, original document, or current fact. Pages that merely restate common advice give retrieval systems little reason to select them over the original or a more authoritative source.",
          "Citation opportunity also depends on accessibility and precision. A useful fact buried in an image, gated file, or vague promotional paragraph is harder to retrieve and verify. Put the essential finding in HTML, name the subject, show the date and scope, explain where the data came from, and link to supporting material.",
        ],
      },
      {
        heading: "Build a citation-worthy asset",
        paragraphs: [
          "Choose a recurring question where your organization has legitimate access to better evidence. A platform can publish aggregated benchmarks, an agency can analyze campaign outcomes, a marketplace can report category demand, and a specialist can document a transparent field method. Protect privacy and commercial sensitivity through aggregation and appropriate consent.",
          "The page should explain who produced the work, what was measured, the sample and period, the calculation, exclusions, limitations, and update policy. Provide a concise finding near the top, then a detailed methodology. Use stable URLs and keep previous editions accessible when publishing a series. This makes the asset useful to journalists, analysts, customers, and answer systems at the same time.",
        ],
        bullets: [
          "Original question and useful information gain",
          "Named author or responsible organization",
          "Transparent sample, method, and limitations",
          "Accessible tables, definitions, and findings",
          "Stable URL, update date, and version history",
        ],
      },
      {
        heading: "Authority is earned outside the site",
        paragraphs: [
          "After publication, distribute the asset to people for whom it is genuinely useful: specialist reporters, industry associations, researchers, partners, customers, and expert communities. Tailor the pitch to the evidence rather than asking for a generic link. Legitimate citations may come from coverage, analysis, inclusion in resource pages, or use of the underlying data.",
          "Avoid paid or automated mention schemes that exist only to manipulate visibility. Google’s guidance warns against inauthentic mentions, and low-quality repetition can dilute trust rather than strengthen it. Measure relevant referring sources, cited pages, retrieval frequency, brand accuracy, and downstream commercial value — not only backlink count.",
        ],
      },
    ],
    faqs: [
      { question: "Can backlinks guarantee AI citations?", answer: "No. Relevant links can support discovery and authority, but each AI or search system selects sources according to its own retrieval and answer process." },
      { question: "What content is most likely to earn citations?", answer: "Original data, primary documents, transparent benchmarks, specialist explanations, current definitions, and practical resources often create stronger citation reasons than generic summaries." },
      { question: "Should a company pay for brand mentions?", answer: "Paid distribution may have legitimate advertising uses, but fabricated or undisclosed mentions intended to manipulate search and AI visibility are not a durable authority strategy." },
    ],
    sources: [
      { label: "Google: Optimizing for generative AI features", url: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide" },
      { label: "Google: Helpful, reliable, people-first content", url: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content" },
      { label: "Google Search spam policies", url: "https://developers.google.com/search/docs/essentials/spam-policies" },
    ],
  },
  {
    slug: "multilingual-ai-visibility",
    title: "Multilingual AI Visibility: Why Translation Is Not Measurement",
    seoTitle: "Multilingual AI Visibility: Language and Market Guide",
    description: "Measure AI visibility separately by language and country, implement international URLs correctly, and avoid treating translation as equal market performance.",
    excerpt: "A brand can be visible in English and nearly absent in Arabic within the same country. One translated prompt cannot represent both markets.",
    category: "International",
    published: "2026-09-13",
    modified: "2026-09-13",
    readingTime: "10 min read",
    keywords: ["multilingual AI visibility", "international GEO", "Arabic AI search optimization", "hreflang AI search"],
    directAnswer: "Multilingual AI visibility must be measured independently for every language and country because intent, terminology, competitors, sources, cultural expectations, and engine behavior can differ. Use dedicated URLs for localized content, correct language signals and reciprocal hreflang where appropriate, local evidence, and native high-intent prompts. Do not infer Arabic performance from English results or vice versa.",
    keyPoints: [
      "Treat language and country as separate measurement dimensions.",
      "Generate native prompts from local intent instead of literal translation.",
      "Use stable language URLs and valid hreflang relationships.",
      "Build local authority and terminology, not just localized interface text.",
    ],
    sections: [
      {
        heading: "The same brand has different visibility in each market",
        paragraphs: [
          "Language changes more than words. Buyers may use different category terms, trust different sources, compare different competitors, and expect different evidence. A hotel search in Arabic for Saudi families may encode needs that an English prompt never expresses. A financial service may have different regulatory terminology and eligible products across countries.",
          "The correct measurement unit includes both language and country. Run native prompts for the commercial intents that matter locally, record the same engine context and repeated runs, then compare presence, sources, accuracy, and competitors. Cross-language comparison is valuable only after each language has been measured on its own terms.",
        ],
      },
      {
        heading: "Build a technically clear international site",
        paragraphs: [
          "Google recommends distinct URLs for each language version rather than changing all content at one URL through cookies or browser settings. Clear URL structure lets users and crawlers access and share a specific version. Use the visible language consistently, set appropriate document language for accessibility, and avoid automatic redirects that prevent visitors or crawlers from choosing another version.",
          "Use hreflang to connect localized equivalents when it applies, and make relationships reciprocal. Each localized page should generally identify an appropriate canonical in the same language. Keep titles, descriptions, structured data, internal links, and sitemap URLs aligned with the localized page. Hreflang helps matching; it does not translate weak content or create local demand.",
        ],
        bullets: [
          "Dedicated, crawlable URL per language version",
          "Native copy and terminology",
          "Self-consistent canonical URL",
          "Reciprocal hreflang between true equivalents",
          "Local metadata, structured data, and internal links",
        ],
      },
      {
        heading: "Localize evidence and authority",
        paragraphs: [
          "A translated product page may explain the offer while still lacking local credibility. Add country-specific availability, pricing conventions, regulations, service areas, case evidence, support information, and responsible local contacts where relevant. Use local experts and sources when the subject requires them. Never copy testimonials or claims into a market where they do not apply.",
          "Monitor factual errors by language. Systems may transliterate the brand differently, confuse local entities, use outdated geographic information, or cite sources from another country. A multilingual dashboard should preserve those distinctions and let teams prioritize the market where a visibility gap has the greatest commercial cost.",
        ],
      },
    ],
    faqs: [
      { question: "Can I use automatic translation for every market page?", answer: "Automatic translation can assist a workflow, but publish only after checking terminology, intent, factual accuracy, local relevance, and user value. Large-scale low-value translations may create poor experiences." },
      { question: "Does the HTML lang attribute replace hreflang?", answer: "No. The lang attribute supports language and accessibility context, while hreflang connects localized page alternatives for search. They serve different purposes." },
      { question: "Should Arabic and English AI visibility use the same prompts?", answer: "They can share business themes, but the actual prompts should reflect native vocabulary, local intent, and the competitive market rather than literal translation." },
    ],
    sources: [
      { label: "Google: Managing multilingual and multi-regional sites", url: "https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites" },
      { label: "Google: Localized versions and hreflang", url: "https://developers.google.com/search/docs/specialty/international/localized-versions" },
      { label: "Google: Canonical URL guidance", url: "https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls" },
    ],
  },
  {
    slug: "measure-ai-visibility-across-engines",
    title: "How to Measure AI Visibility Across ChatGPT, Gemini, Perplexity, and More",
    seoTitle: "Measure AI Visibility Across Multiple Engines",
    description: "Design repeatable prompt tests across AI engines without confusing consumer products, search-enabled APIs, and model-only responses.",
    excerpt: "Cross-engine coverage is meaningful only when every result keeps its surface, mode, market, timestamp, and run context.",
    category: "Measurement",
    published: "2026-09-13",
    modified: "2026-09-13",
    readingTime: "10 min read",
    keywords: ["measure AI visibility", "ChatGPT Gemini Perplexity visibility", "AI share of voice", "GEO monitoring tools"],
    directAnswer: "To measure AI visibility across engines, define a shared high-intent prompt framework, then run each prompt in explicitly labeled surfaces while preserving engine, product or API, model/search mode, country, language, timestamp, and repetition. Compare normalized observable outcomes such as mentions, recommendations, citations, position, source overlap, factual accuracy, and consistency — not raw text alone.",
    keyPoints: [
      "Never label an API result as a consumer-product test unless it is equivalent.",
      "Use the same intent framework while respecting engine-specific surfaces.",
      "Repeat important prompts and retain full evidence.",
      "Compare normalized outcomes and source patterns, not stylistic wording.",
    ],
    sections: [
      {
        heading: "Define the surface before running the prompt",
        paragraphs: [
          "An engine name is not enough. A consumer chat product may use search, location, personalization, memory, a routing layer, or a model version that differs from a public API. A model-only API response may have no current web retrieval. Testing one and reporting the other creates false precision.",
          "For every run, store the provider, consumer product or API, surface, model when disclosed, search or grounding state, country, language, timestamp, account context when relevant, and run number. If the exact consumer experience cannot be tested legally and technically, say what was tested instead of using the better-known product label as shorthand.",
        ],
      },
      {
        heading: "Use prompts tied to real commercial decisions",
        paragraphs: [
          "Generate questions from the company’s category, products, services, customers, markets, and competitors. Cover informational, commercial, comparison, recommendation, and transactional intent, but weight the set according to business value. A hundred generic questions may be less useful than twenty carefully selected prompts that represent actual buying decisions.",
          "Keep a stable benchmark set for historical comparison while allowing a controlled portion to evolve as products and customer language change. Document every prompt version. Do not change a failing question after the fact or select only favorable runs. The test design should make both wins and losses visible.",
        ],
      },
      {
        heading: "Normalize the outcome, preserve the evidence",
        paragraphs: [
          "Extract whether the brand was mentioned, explicitly recommended, cited, and accurately described; its relative position; competing brands; cited domains; and answer sentiment. Then calculate rates over the appropriate denominator. A citation rate over all prompts answers a different question from citation rate among brand mentions, so define formulas publicly.",
          "Compare source overlap and consistency between engines, but do not assume disagreement means one engine is wrong. Retrieval sets, model behavior, and product goals differ. Preserve the response and sources so analysts can inspect the reason. Trends across repeated, labeled runs are more defensible than a screenshot of one favorable answer.",
        ],
        bullets: [
          "Mention and recommendation rates",
          "Citation and cited-domain coverage",
          "Normalized recommendation position",
          "Competitive share of voice",
          "Cross-run and cross-engine consistency",
          "Sentiment and factual accuracy",
        ],
      },
    ],
    faqs: [
      { question: "Is a ChatGPT API response the same as ChatGPT search?", answer: "Not necessarily. Product surfaces may use different models, retrieval, context, and interfaces. A report should name the exact tested surface and mode." },
      { question: "Why repeat the same AI visibility prompt?", answer: "Generative responses vary. Repetition helps estimate consistency and prevents one favorable or unfavorable run from being treated as a stable result." },
      { question: "Can results from different engines be combined into one score?", answer: "Yes, if the normalization and weights are documented and individual engine results remain visible. A composite should not erase important differences." },
    ],
    sources: [
      { label: "OpenAI: Overview of OpenAI crawlers", url: "https://developers.openai.com/bots" },
      { label: "Google: AI features and your website", url: "https://developers.google.com/search/docs/appearance/ai-features" },
      { label: "Recomvia public methodology", url: `${SITE_URL}/methodology` },
    ],
  },
  {
    slug: "structured-data-for-ai-search",
    title: "Structured Data for AI Search: What It Can and Cannot Do",
    seoTitle: "Structured Data for AI Search: Practical Guide",
    description: "Use Organization, Article, FAQ, Breadcrumb, Product, and Service schema accurately without treating structured data as an AI ranking guarantee.",
    excerpt: "Schema can make page meaning explicit, but it cannot manufacture trust, authority, or a recommendation the visible content does not support.",
    category: "Technical",
    published: "2026-09-13",
    modified: "2026-09-13",
    readingTime: "8 min read",
    keywords: ["structured data AI search", "schema markup AEO", "GEO schema", "Article schema AI"],
    directAnswer: "Structured data is machine-readable markup that explicitly describes visible page content and its entities. Use types that match the page, include accurate recommended properties, keep URLs and identity consistent, and validate the result. It can support search understanding and rich-result eligibility, but there is no universal AI-specific schema that guarantees citation, ranking, or recommendation.",
    keyPoints: [
      "Choose schema types from the page’s real visible purpose.",
      "Keep names, dates, authors, URLs, and relationships consistent.",
      "Validate syntax and compare every property with visible content.",
      "Treat structured data as clarification, not a hidden GEO shortcut.",
    ],
    sections: [
      {
        heading: "Use the most specific accurate type",
        paragraphs: [
          "A home or company page may use Organization and WebSite. A research-led blog article can use BlogPosting or Article with headline, description, publication and modification dates, and a responsible author or organization. Product, Service, SoftwareApplication, BreadcrumbList, Dataset, and other types may apply when the visible content genuinely represents them.",
          "More markup is not automatically better. Adding every conceivable type can create contradictions and maintenance debt. Select the entities and relationships that help explain the page, use stable canonical URLs as identifiers, and connect nested objects logically. Do not mark a promotional sentence as a review, a generic list as an FAQ, or a service as a product if the type does not fit.",
        ],
      },
      {
        heading: "Keep markup aligned with the page",
        paragraphs: [
          "Structured data should describe information users can see. If the visible title, author, price, availability, date, or organization name changes, update the markup in the same release. Maintain one source of truth in the application or CMS so presentation and JSON-LD do not drift apart.",
          "For articles, Google recommends properties such as headline, dates, and author details where applicable. Author identity becomes clearer when the URL points to a genuine profile or the responsible organization is named accurately. Breadcrumb markup should match the visible information architecture. Localized pages should emit localized names, descriptions, and canonical URLs.",
        ],
      },
      {
        heading: "Validate and measure the right outcome",
        paragraphs: [
          "Test syntax with Schema.org tooling and provider-specific rich result tools, then inspect the rendered page. Monitor parsing errors and enhancements in Search Console where supported. Validation proves that the markup can be parsed; it does not prove that a rich result will appear or that an AI system will use the page.",
          "Google’s generative search guidance explicitly says structured data is not a special requirement for AI features. Continue using it as part of sound SEO because it can clarify content and support established experiences. Evaluate AI visibility with observed prompts, citations, and representation rather than counting schema types.",
        ],
        bullets: [
          "Syntax valid",
          "Type appropriate",
          "Properties visible and accurate",
          "Canonical URLs consistent",
          "Localized values correct",
          "No guarantee language in reporting",
        ],
      },
    ],
    faqs: [
      { question: "Which schema is best for GEO?", answer: "There is no single GEO schema. Use the most accurate types for the visible page, such as Organization, Article, Product, Service, Dataset, or BreadcrumbList when they genuinely apply." },
      { question: "Does FAQ schema make an answer appear in AI results?", answer: "No. FAQ markup can describe visible questions and answers, but provider eligibility and AI source selection remain separate decisions." },
      { question: "Should schema be generated with JavaScript?", answer: "It can be, provided crawlers receive the rendered markup reliably and it remains consistent with visible content. Server-rendered JSON-LD often simplifies verification." },
    ],
    sources: [
      { label: "Google: Introduction to structured data", url: "https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data" },
      { label: "Google: Article structured data", url: "https://developers.google.com/search/docs/appearance/structured-data/article" },
      { label: "Schema.org: BlogPosting", url: "https://schema.org/BlogPosting" },
      { label: "Google: Generative AI optimization guidance", url: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide" },
    ],
  },
  {
    slug: "ai-visibility-monitoring-kpis",
    title: "AI Visibility Monitoring: The KPIs That Actually Matter",
    seoTitle: "AI Visibility Monitoring KPIs That Matter",
    description: "Track meaningful AI visibility KPIs, including recommendation rate, citation rate, share of voice, consistency, accuracy, and post-fix change.",
    excerpt: "A monitoring dashboard should explain business movement, not overwhelm teams with invented metrics and unstable screenshots.",
    category: "Measurement",
    published: "2026-09-13",
    modified: "2026-09-13",
    readingTime: "9 min read",
    keywords: ["AI visibility monitoring", "AI visibility KPIs", "GEO metrics", "AI share of voice"],
    directAnswer: "The most useful AI visibility KPIs are recommendation rate, brand mention rate, citation rate, recommendation position, competitive share of voice, buyer-intent prompt coverage, cross-engine coverage, response consistency, sentiment, factual accuracy, and post-fix change. Every KPI needs a defined denominator, stable test context, evidence trail, and business interpretation.",
    keyPoints: [
      "Define each metric and denominator before showing a percentage.",
      "Segment by intent, engine surface, language, country, and topic.",
      "Track consistency and accuracy alongside visibility volume.",
      "Measure before and after fixes using a stable benchmark set.",
    ],
    sections: [
      {
        heading: "Start with commercially meaningful outcomes",
        paragraphs: [
          "Mention rate shows how often a brand is named, while recommendation rate shows how often it is proposed as a relevant option. Citation rate measures linked or attributed source presence. Position captures prominence within a shortlist, and share of voice compares the brand with selected competitors. These metrics should be segmented by prompt intent because an informational mention and a purchase-oriented recommendation do not carry equal value.",
          "Buyer-intent coverage asks whether the brand appears across the questions that influence a decision, not merely across a large generic prompt inventory. Cross-engine coverage shows whether visibility depends on one environment. Together, these measures tell a more useful story than an unlabeled “GEO score.”",
        ],
      },
      {
        heading: "Protect the dashboard from false precision",
        paragraphs: [
          "Every percentage needs a denominator. “Citation rate: 30%” could mean three citations across ten prompts, three cited answers among ten brand mentions, or three engines that cited the brand. Display the formula, run count, measurement period, and filters. Small samples should carry lower confidence and should not be presented with overly precise decimals.",
          "Track response consistency across repeated runs and factual accuracy of important claims. Visibility that fluctuates heavily may be less commercially reliable than a lower but stable presence. An inaccurate recommendation can create risk rather than value. Sentiment should also preserve the supporting text because classification alone can conceal nuance.",
        ],
      },
      {
        heading: "Connect monitoring to improvement",
        paragraphs: [
          "Establish a baseline before making changes, preserve a stable benchmark prompt set, and annotate major content, technical, product, or market events. After a fix, rerun the relevant prompts and technical checks. Compare both the targeted metric and adjacent risks, such as factual accuracy or visibility in another language.",
          "Use alerts for meaningful shifts rather than every normal variation. Examples include sustained loss across repeated runs, a new factual error, a major competitor gaining recommendation share, or a key citation source disappearing. Monitoring should lead to a prioritized decision: investigate, fix, wait for processing, or accept normal volatility.",
        ],
        bullets: [
          "Metric definition and denominator",
          "Baseline and comparison window",
          "Run count and confidence",
          "Intent, market, language, and engine segments",
          "Evidence and change annotations",
          "Action threshold and accountable owner",
        ],
      },
    ],
    faqs: [
      { question: "What is AI share of voice?", answer: "It is the brand’s normalized presence relative to defined competitors across a documented prompt set, engine context, market, language, and period." },
      { question: "Should AI visibility be monitored daily?", answer: "Not for every business. Match cadence to decision speed, volatility, prompt volume, and operating cost. Consistent weekly or monthly monitoring may be more useful than noisy daily checks." },
      { question: "What proves an optimization worked?", answer: "A credible evaluation combines confirmed implementation with later improvement in the targeted, repeated measurement while checking for confounding changes and adjacent risks." },
    ],
    sources: [
      { label: "Recomvia public methodology", url: `${SITE_URL}/methodology` },
      { label: "Google: AI features and your website", url: "https://developers.google.com/search/docs/appearance/ai-features" },
      { label: "Google Search Console documentation", url: "https://support.google.com/webmasters/answer/9128668" },
    ],
  },
];

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}
