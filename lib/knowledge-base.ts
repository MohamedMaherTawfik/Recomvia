import { articles } from "@/lib/articles";

export type FaqEntry = {
  id: string;
  category: "Platform" | "Reports" | "Optimization" | "Measurement" | "Billing" | "Trust";
  question: string;
  answer: string;
  questionAr: string;
  answerAr: string;
  keywords: string[];
  relatedArticle?: string;
};

export const faqEntries: FaqEntry[] = [
  {
    id:"what-is-recomvia",category:"Platform",question:"What is Recomvia?",questionAr:"ما هي Recomvia؟",
    answer:"Recomvia is an AI Visibility Optimization Platform. It measures how AI-powered search and answer systems find, understand, cite, and recommend a brand, explains the causes, then connects findings to automated, assisted, or expert improvements.",
    answerAr:"«Recomvia» منصة لتحسين الظهور داخل محركات البحث والإجابة المعتمدة على الذكاء الاصطناعي، تقيس كيف تكتشف الأنظمة العلامة وتفهمها وتستشهد بها وتوصي بها، ثم تفسر الأسباب وتربطها بتحسين آلي أو بموافقة العميل أو بتدخل خبير.",
    keywords:["platform","what","recomvia","منصة","ما هي","تعريف"],relatedArticle:"ai-visibility-optimization-guide"
  },
  {
    id:"free-score",category:"Reports",question:"What does the free AI visibility score include?",questionAr:"ماذا يشمل فحص الظهور المجاني؟",
    answer:"The free score provides one real introductory measurement, a limited view of the main dimensions, one critical issue, one opportunity, a small engine snapshot, and the total number of detected issues. Detailed evidence and most findings remain locked for the Starter Report.",
    answerAr:"يعرض الفحص المجاني قياسًا أوليًا حقيقيًا، ولمحة محدودة من المحاور الأساسية، ومشكلة حرجة واحدة، وفرصة واحدة، ونتيجة مختصرة لبعض المحركات، مع عدد المشكلات المكتشفة، بينما تبقى الأدلة والتفاصيل ومعظم النتائج داخل تقرير البداية.",
    keywords:["free","score","scan","include","مجاني","فحص","درجة","يشمل"]
  },
  {
    id:"starter-report",category:"Billing",question:"What is included in the $4.99 Starter Report?",questionAr:"ماذا يتضمن تقرير البداية بسعر 4.99 دولار؟",
    answer:"The one-time Starter Report unlocks the findings collected in the initial scan, core score details, limited prompt and engine results, one competitor, priority issues, key opportunities, a technical mini audit, initial recommendations, account storage, and a PDF. It does not include monitoring or the Fix Center.",
    answerAr:"يفتح تقرير البداية، مقابل 4.99 دولار لمرة واحدة، نتائج الفحص الأول، وتفاصيل الدرجات، والنتائج المحدودة للأسئلة والمحركات، ومنافسًا واحدًا، وأهم المشكلات والفرص، وتدقيقًا تقنيًا مصغرًا، وتوصيات أولية، وحفظ التقرير ونسخة PDF، لكنه لا يشمل المراقبة أو مركز الإصلاح.",
    keywords:["4.99","starter","report","تقرير البداية","دولار"]
  },
  {
    id:"essential-plan",category:"Billing",question:"What does the Essential plan include?",questionAr:"ماذا تشمل باقة Essential؟",
    answer:"Essential starts at $19 per month for one website and includes the full visibility report, a defined high-intent prompt set, selected AI engine surfaces, competitor comparison, recurring measurement, historical comparison, issue tracking, the Fix Center, and post-fix rechecks. Fix Credits are purchased separately.",
    answerAr:"تبدأ باقة «Essential» من 19 دولارًا شهريًا لموقع واحد، وتشمل التقرير الكامل، ومجموعة محددة من الأسئلة عالية النية، ومحركات مختارة، ومقارنة المنافسين، والقياس الدوري، والمقارنات التاريخية، وتتبع المشكلات، وفتح مركز الإصلاح وإعادة القياس، ولا تتضمن نقاط الإصلاح التي تُشترى بصورة منفصلة.",
    keywords:["essential","19","subscription","plan","price","pricing","cost","اشتراك","باقة","تسعة عشر","سعر","تكلفة"]
  },
  {
    id:"subscription-vs-credits",category:"Billing",question:"What is the difference between a subscription and Fix Credits?",questionAr:"ما الفرق بين الاشتراك ونقاط الإصلاح؟",
    answer:"The subscription pays for analysis, reports, monitoring, issue tracking, and remeasurement. Fix Credits pay for clearly priced automated or assisted improvements. An active Essential plan or higher is required before credits can be purchased or used.",
    answerAr:"الاشتراك يدفع مقابل التحليل والتقارير والمراقبة وتتبع المشكلات وإعادة القياس، أما نقاط الإصلاح فتدفع مقابل تحسينات آلية أو شبه آلية محددة التكلفة، ويشترط وجود اشتراك «Essential» أو أعلى لشراء النقاط أو استخدامها.",
    keywords:["credits","subscription","difference","fix credits","نقاط","الفرق","الاشتراك","اصلاح"]
  },
  {
    id:"credits-after-cancel",category:"Billing",question:"What happens to purchased credits if I cancel?",questionAr:"ماذا يحدث للنقاط المشتراة عند إلغاء الاشتراك؟",
    answer:"Purchased Fix Credits are not confiscated when a subscription is cancelled. They remain in the wallet for the disclosed validity period, while the Fix Center becomes inactive until Essential or a higher plan is reactivated.",
    answerAr:"لا تُصادر نقاط الإصلاح المشتراة عند إلغاء الاشتراك، بل تبقى في المحفظة خلال مدة الصلاحية المعلنة، بينما يتوقف مركز الإصلاح حتى إعادة تفعيل باقة «Essential» أو أعلى.",
    keywords:["cancel","expire","credits","wallet","الغاء","النقاط","صلاحية","المحفظة"]
  },
  {
    id:"engines",category:"Measurement",question:"Which AI engines does Recomvia measure?",questionAr:"ما محركات الذكاء الاصطناعي التي تقيسها Recomvia؟",
    answer:"Recomvia is designed to measure major technically and legally accessible AI search and answer environments, including surfaces associated with ChatGPT, Gemini, Perplexity, Claude, Google AI experiences, Microsoft Copilot, and others. Actual plan coverage depends on available integrations and every result names the exact tested surface.",
    answerAr:"صُممت «Recomvia» لقياس أبرز بيئات البحث والإجابة المتاحة تقنيًا وقانونيًا، ومنها الأسطح المرتبطة بـ«ChatGPT» و«Gemini» و«Perplexity» و«Claude» وتجارب «Google» و«Microsoft Copilot» وغيرها، ويتحدد العدد الفعلي بحسب التكاملات المتاحة، مع تسمية السطح المختبر بدقة داخل كل نتيجة.",
    keywords:["engines","chatgpt","gemini","perplexity","claude","محركات","شات جي بي تي","جيميني"],relatedArticle:"measure-ai-visibility-across-engines"
  },
  {
    id:"api-vs-consumer",category:"Trust",question:"Is an API result the same as the consumer AI product?",questionAr:"هل نتيجة API هي نفسها نتيجة المنتج الذي يستخدمه الجمهور؟",
    answer:"Not necessarily. Consumer products, search-enabled APIs, and model-only APIs may use different retrieval, context, models, location, or personalization. Recomvia stores and displays the engine, surface, model or search mode when available, country, language, timestamp, and run instead of claiming they are identical.",
    answerAr:"ليس بالضرورة، فقد تختلف المنتجات النهائية وواجهات البحث وواجهات النماذج في الاسترجاع والسياق والنموذج والموقع والتخصيص، لذلك تحفظ «Recomvia» اسم المحرك والسطح ووضع البحث أو النموذج والدولة واللغة والتوقيت والتشغيل، ولا تدعي أنها تجارب متطابقة.",
    keywords:["api","consumer","product","surface","واجهة","المنتج","المستخدم","نفس"],relatedArticle:"measure-ai-visibility-across-engines"
  },
  {
    id:"score-method",category:"Measurement",question:"How is the AI Recommendation Score calculated?",questionAr:"كيف تُحسب درجة التوصية بالعلامة؟",
    answer:"The score combines documented observed outcomes and separately reported readiness dimensions. Inputs can include mentions, recommendations, citations, position, high-intent coverage, cross-engine consistency, entity authority, content readiness, technical AEO, and language-market fit. The methodology, weights, sample size, and confidence must remain visible and versioned.",
    answerAr:"تجمع الدرجة بين نتائج الظهور الفعلية الموثقة ومحاور الجاهزية التي تعرض بصورة مستقلة، وقد تشمل الظهور والتوصية والاستشهاد والموقع وتغطية الأسئلة عالية النية والاتساق بين المحركات، إلى جانب السلطة والكيان والمحتوى والجاهزية التقنية وملاءمة اللغة والسوق، مع إظهار المنهجية والأوزان وحجم العينة والثقة.",
    keywords:["score","calculate","methodology","weight","درجة","تحسب","منهجية","اوزان"],relatedArticle:"ai-visibility-score-methodology"
  },
  {
    id:"visibility-vs-readiness",category:"Measurement",question:"What is the difference between actual AI visibility and AEO/GEO readiness?",questionAr:"ما الفرق بين الظهور الفعلي وجاهزية AEO وGEO؟",
    answer:"Actual AI visibility records what happened in defined AI answers: mentions, recommendations, citations, positions, and consistency. Readiness examines whether the site is easy to crawl, understand, extract, and trust. A site may be technically strong but absent from answers, so the two must not be treated as the same result.",
    answerAr:"الظهور الفعلي يسجل ما حدث داخل إجابات محددة، مثل الذكر والتوصية والاستشهاد والموقع والاتساق، بينما تقيس الجاهزية مدى سهولة زحف الموقع وفهمه واستخراج معلوماته والثقة بها، وقد يكون الموقع قويًا تقنيًا لكنه غائب عن الإجابات، لذلك لا يجوز دمج النتيجتين وكأنهما شيء واحد.",
    keywords:["visibility","readiness","difference","actual","الظهور","الجاهزية","الفرق"],relatedArticle:"ai-visibility-optimization-guide"
  },
  {
    id:"guarantee",category:"Trust",question:"Does Recomvia guarantee an AI recommendation or citation?",questionAr:"هل تضمن Recomvia ظهور العلامة أو التوصية بها؟",
    answer:"No. Recomvia does not guarantee a ranking, citation, or recommendation controlled by a third-party AI system. It measures observable outcomes, improves controllable signals, documents limitations, and monitors whether results change after implementation.",
    answerAr:"لا تضمن «Recomvia» ترتيبًا أو استشهادًا أو توصية تتحكم فيها أنظمة خارجية، وإنما تقيس النتائج القابلة للملاحظة، وتحسن الإشارات التي يمكن التحكم فيها، وتوضح حدود المنهجية، ثم تراقب ما إذا تغيرت النتائج بعد التنفيذ.",
    keywords:["guarantee","promise","ranking","citation","recommendation","ضمان","تضمن","ترتيب","استشهاد","توصية"]
  },
  {
    id:"languages",category:"Platform",question:"Which languages and countries are supported?",questionAr:"ما اللغات والدول التي تدعمها المنصة؟",
    answer:"The architecture is language-agnostic. Launch priorities are English, Arabic, Spanish, French, German, and Portuguese, followed by additional high-demand languages. Every language and country combination is measured independently because translation is not the same test or market.",
    answerAr:"بنية المنصة محايدة لغويًا، وتبدأ الأولويات بالإنجليزية والعربية والإسبانية والفرنسية والألمانية والبرتغالية، ثم تتوسع إلى لغات أخرى بحسب الطلب، وتُقاس كل لغة ودولة بصورة مستقلة لأن الترجمة ليست الاختبار نفسه ولا السوق نفسه.",
    keywords:["languages","countries","arabic","english","multilingual","لغات","دول","العربية","الانجليزية"],relatedArticle:"multilingual-ai-visibility"
  },
  {
    id:"scan-frequency",category:"Reports",question:"How often is AI visibility measured?",questionAr:"كم مرة يُعاد قياس الظهور؟",
    answer:"The free allowance is initially one eligible scan every 30 days. Paid plans provide a defined recurring cadence based on prompt, engine, market, and plan limits. Important prompts should be repeated because one generative answer is not a stable ranking.",
    answerAr:"يبدأ الحد المجاني بفحص واحد للحساب والجهاز المؤهل كل 30 يومًا، بينما توفر الخطط المدفوعة دورية محددة وفق عدد الأسئلة والمحركات والأسواق وحدود الباقة، وتُكرر الأسئلة المهمة لأن إجابة واحدة لا تمثل ترتيبًا ثابتًا.",
    keywords:["often","frequency","30 days","monitoring","متى","مرة","ثلاثين","مراقبة"]
  },
  {
    id:"freshness-cache",category:"Reports",question:"What does “last analyzed” mean?",questionAr:"ماذا تعني عبارة «آخر تحليل»؟",
    answer:"Recomvia can reuse a recent result for the same domain, language, country, and engine context to avoid unnecessary cost. The report shows when the data was last analyzed. A full fresh scan follows the rules and allowances of the active paid plan.",
    answerAr:"قد تعيد «Recomvia» استخدام نتيجة حديثة للنطاق واللغة والدولة وسياق المحرك نفسه لتجنب تكلفة غير ضرورية، مع إظهار توقيت آخر تحليل بوضوح، أما الفحص الجديد الكامل فيتبع حدود وقواعد الباقة المدفوعة النشطة.",
    keywords:["cache","fresh","last analyzed","recent","آخر تحليل","حديث","تحديث"]
  },
  {
    id:"fix-types",category:"Optimization",question:"What is the difference between Auto, Assisted, and Expert fixes?",questionAr:"ما الفرق بين الإصلاح الآلي والمساعد وإصلاح الخبير؟",
    answer:"Auto fixes are safe and reversible changes the platform can apply. Assisted fixes are generated by the system but require explicit approval before material content changes. Expert fixes cover complex technical, editorial, authority, research, or outreach work that automation should not claim to complete.",
    answerAr:"الإصلاح الآلي تغيير آمن وقابل للتراجع تستطيع المنصة تطبيقه، أما الإصلاح المساعد فينشئ التعديل لكنه يتطلب موافقة صريحة قبل تغيير المحتوى الجوهري، بينما يعالج الخبير الأعمال التقنية أو التحريرية أو المتعلقة بالسلطة والبحث والتواصل التي لا ينبغي للأتمتة الادعاء بأنها تنفذها بالكامل.",
    keywords:["auto","assisted","expert","fix","آلي","مساعد","خبير","اصلاح"]
  },
  {
    id:"approval-rollback",category:"Optimization",question:"Can Recomvia change my website without approval?",questionAr:"هل يمكن للمنصة تعديل موقعي دون موافقتي؟",
    answer:"No material change should be applied without clear permission. Recomvia shows the current and recommended versions, identifies the execution type and credit cost, records an audit trail, and requires versioning and rollback for connected-site changes.",
    answerAr:"لا يُطبق أي تعديل جوهري دون إذن واضح، إذ تعرض «Recomvia» النسخة الحالية والمقترحة، وتوضح نوع التنفيذ وتكلفة النقاط، وتسجل مسار التدقيق، وتشترط وجود إصدار سابق وإمكانية التراجع عند تعديل المواقع المتصلة.",
    keywords:["approval","change","rollback","permission","موافقة","تعديل","تراجع","إذن"]
  },
  {
    id:"privacy",category:"Trust",question:"How does Recomvia protect free-scan abuse and privacy?",questionAr:"كيف تحمي Recomvia الفحص المجاني والخصوصية؟",
    answer:"Eligibility uses a risk-based combination of account, first-party device identifier, network abuse signals, domain history, usage patterns, caching, and an abuse score. Recomvia should not rely on one fingerprint as absolute truth, and the privacy notice must explain lawful purposes, retention, and user rights.",
    answerAr:"تحدد الأهلية وفق قرار قائم على المخاطر يجمع الحساب ومعرّف الجهاز من الطرف الأول وإشارات إساءة استخدام الشبكة وسجل فحص النطاق وأنماط الاستخدام والتخزين المؤقت ودرجة المخاطر، ولا تعتمد المنصة على بصمة واحدة بوصفها حقيقة مطلقة، ويجب أن توضح سياسة الخصوصية الغرض القانوني والاحتفاظ بالبيانات وحقوق المستخدم.",
    keywords:["privacy","device","abuse","data","خصوصية","جهاز","بيانات","اساءة"]
  },
  {
    id:"not-recommended",category:"Measurement",question:"Why is AI not recommending my brand?",questionAr:"لماذا لا يوصي الذكاء الاصطناعي بعلامتي؟",
    answer:"Common causes include unclear category or entity signals, weak match to buyer-intent questions, insufficient independent evidence, crawling or extraction friction, inaccurate or stale information, and competitors with stronger relevant sources. A diagnosis must test actual answers before choosing a fix.",
    answerAr:"تشمل الأسباب الشائعة غموض تصنيف العلامة أو كيانها، وضعف توافق المحتوى مع أسئلة الشراء، ونقص الأدلة المستقلة، وصعوبة الزحف أو الاستخراج، والمعلومات القديمة أو غير الدقيقة، وامتلاك المنافسين مصادر أقوى وأكثر صلة، ويجب اختبار الإجابات الفعلية قبل اختيار الإصلاح.",
    keywords:["why","not recommend","missing","brand","لماذا","لا يوصي","علامتي","غائب"],relatedArticle:"why-ai-does-not-recommend-your-brand"
  },
  {
    id:"wordpress",category:"Optimization",question:"Does Recomvia support WordPress?",questionAr:"هل تدعم Recomvia مواقع WordPress؟",
    answer:"WordPress is the first planned direct CMS integration. Early workflows provide a before-and-after preview plus implementation instructions. Direct “Approve & Apply” requires a connected site, explicit permissions, versioning, rollback, and an audit log.",
    answerAr:"يأتي «WordPress» في مقدمة تكاملات أنظمة إدارة المحتوى المخطط لها، وتوفر المراحل الأولى معاينة قبل وبعد وتعليمات للتطبيق، أما التنفيذ المباشر عبر «Approve & Apply» فيحتاج إلى موقع متصل وصلاحيات واضحة وإدارة للإصدارات وإمكانية التراجع وسجل تدقيق.",
    keywords:["wordpress","cms","integration","ووردبريس","تكامل","موقع"]
  },
  {
    id:"expert-services",category:"Optimization",question:"When should I use an expert service?",questionAr:"متى أحتاج إلى خدمة خبير؟",
    answer:"Use an expert when the issue involves complex site architecture, major content strategy, specialist editorial review, entity strategy, original research, external authority, media outreach, digital PR, or coordination with internal teams. Open-ended human work is scoped and priced separately from Fix Credits.",
    answerAr:"تحتاج إلى خبير عندما تتعلق المشكلة ببنية تقنية معقدة، أو استراتيجية محتوى كبيرة، أو مراجعة تحريرية متخصصة، أو استراتيجية الكيان، أو البحث الأصلي، أو السلطة الخارجية، أو التواصل الإعلامي والعلاقات العامة الرقمية والتنسيق مع فرق العميل، ويُسعر العمل البشري المفتوح بصورة منفصلة عن نقاط الإصلاح.",
    keywords:["expert","human","service","managed","خبير","بشري","خدمة","إدارة"]
  },
];

const stopWords=new Set(["the","a","an","is","are","do","does","how","what","my","your","to","of","and","in","for","can","i","هل","ما","ماذا","كيف","في","من","على","عن","الى","إلى","هو","هي","هذا","هذه"]);

function normalize(value:string){return value.toLowerCase().normalize("NFKD").replace(/[\u064B-\u065F\u0670]/g,"").replace(/[أإآ]/g,"ا").replace(/ة/g,"ه").replace(/ى/g,"ي").replace(/[^\p{L}\p{N}\s.-]/gu," ").replace(/\s+/g," ").trim()}
function tokens(value:string){return normalize(value).split(" ").filter(token=>token.length>1&&!stopWords.has(token))}

export type KnowledgeResult={answered:boolean;answer?:string;title?:string;sourceUrl?:string;sourceLabel?:string;confidence:number;language:"ar"|"en";suggestedQuestion?:string};

export function searchKnowledge(question:string):KnowledgeResult {
  const language: "ar" | "en" = /[\u0600-\u06ff]/.test(question) ? "ar" : "en";
  const query=normalize(question); const queryTokens=tokens(question); if(!queryTokens.length)return {answered:false,confidence:0,language};
  const candidates=[
    ...faqEntries.map(entry=>({title:language==="ar"?entry.questionAr:entry.question,answer:language==="ar"?entry.answerAr:entry.answer,url:`/faq#${entry.id}`,keywords:[entry.question,entry.questionAr,entry.answer,entry.answerAr,...entry.keywords].join(" ")})),
    ...articles.map(article=>({
      title:article.title,
      answer:article.directAnswer,
      url:`/blog/${article.slug}`,
      keywords:[article.title,article.description,article.directAnswer,...article.keywords,...article.keyPoints,...article.sections.flatMap(section=>[section.heading,...section.paragraphs,...(section.bullets??[])]),...article.faqs.flatMap(faq=>[faq.question,faq.answer])].join(" ")
    })),
    ...articles.flatMap(article=>article.sections.map(section=>({
      title:`${article.title}: ${section.heading}`,
      answer:section.paragraphs.join("\n\n"),
      url:`/blog/${article.slug}`,
      keywords:[article.title,...article.keywords,section.heading,...section.paragraphs,...(section.bullets??[])].join(" ")
    }))),
    ...articles.flatMap(article=>article.faqs.map(faq=>({
      title:faq.question,
      answer:faq.answer,
      url:`/blog/${article.slug}#frequently-asked-questions`,
      keywords:[article.title,...article.keywords,faq.question,faq.answer].join(" ")
    }))),
  ];
  const ranked=candidates.map(candidate=>{const hay=normalize(candidate.keywords);const hayTokens=new Set(tokens(candidate.keywords));let score=0;for(const token of queryTokens){if(hayTokens.has(token))score+=3;else if([...hayTokens].some(word=>word.startsWith(token)||token.startsWith(word)))score+=1;}if(hay.includes(query))score+=8;return {candidate,score}}).sort((a,b)=>b.score-a.score);
  const best=ranked[0]; const required=queryTokens.length<=2?4:Math.max(5,Math.ceil(queryTokens.length*.9));
  if(!best||best.score<required)return {answered:false,confidence:best?Math.min(44,Math.round(best.score/Math.max(required,1)*40)):0,language,suggestedQuestion:language==="ar"?"سأحوّل هذا السؤال إلى فريق خدمة العملاء.":"I can send this question to our customer service team."};
  return {answered:true,title:best.candidate.title,answer:best.candidate.answer,sourceUrl:best.candidate.url,sourceLabel:language==="ar"?"عرض المصدر":"View source",confidence:Math.min(96,64+best.score*3),language};
}
