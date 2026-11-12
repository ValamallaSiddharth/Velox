const getRootDomain = (url) => {
  try {
    const host = new URL(url).hostname;
    const parts = host.split('.');
    return parts.length > 2 ? parts.slice(-2).join('.') : host;
  } catch { return ''; }
};

/**
 * Returns the best logo URL for a given tool URL.
 * Uses Google S2 favicon service at 64px — reliable, no CORS issues.
 * Falls back to DuckDuckGo's favicon in ToolCard/ToolDetail via onError chain.
 */
export const getLogo = (url) => {
  try {
    const origin = new URL(url).origin;
    return `https://www.google.com/s2/favicons?domain=${origin}&sz=64`;
  } catch { return ''; }
};

/** Secondary fallback for onError handler in image tags */
export const getLogoFallback = (url) => {
  const d = getRootDomain(url);
  return d ? `https://icons.duckduckgo.com/ip3/${d}.ico` : '';
};

const mk = (id, name, cat, desc, url, pricing, rating, users, top10 = false, featured = false) => ({
  id, name, category: cat, description: desc, url,
  logo: getLogo(url),
  pricing, rating, users, top10, featured,
});

export const tools = [
  // ── CHATBOT ──────────────────────────────────────────────────────────────
  mk(1,'ChatGPT','Chatbot','World\'s most popular AI chatbot. Write, code, analyze anything.','https://chat.openai.com','Freemium',4.9,180000000,true,true),
  mk(2,'Claude','Chatbot','Anthropic\'s safe AI — great for long docs, analysis & nuanced reasoning.','https://claude.ai','Freemium',4.8,12000000,true,true),
  mk(3,'Gemini','Chatbot','Google\'s multimodal AI — text, images, code, and Workspace integration.','https://gemini.google.com','Freemium',4.7,35000000,true,true),
  mk(4,'Perplexity AI','Chatbot','AI search engine with cited real-time answers from the live web.','https://perplexity.ai','Freemium',4.6,15000000,true,true),
  mk(5,'Microsoft Copilot','Chatbot','GPT-4 powered assistant with web search. Free to use daily.','https://copilot.microsoft.com','Free',4.4,20000000),
  mk(6,'Meta AI','Chatbot','Built into WhatsApp, Instagram & Messenger. Free and multilingual.','https://meta.ai','Free',4.2,500000000),
  mk(7,'Grok','Chatbot','Elon Musk\'s xAI assistant with real-time X (Twitter) data access.','https://grok.x.ai','Paid',4.5,5000000),
  mk(8,'DeepSeek','Chatbot','Open-source Chinese AI model rivaling GPT-4 at lower cost.','https://deepseek.com','Free',4.6,8000000),
  mk(9,'Character.AI','Chatbot','Create and chat with AI personas. Hugely popular with Gen Z.','https://character.ai','Freemium',4.3,20000000),
  mk(10,'Poe','Chatbot','Quora\'s AI hub — access GPT-4, Claude, Gemini in one place.','https://poe.com','Freemium',4.3,5000000),
  mk(11,'Pi AI','Chatbot','Inflection AI\'s personal, emotionally intelligent assistant.','https://pi.ai','Free',4.2,2000000),
  mk(12,'You.com','Chatbot','AI search assistant with apps, coding tools, and private mode.','https://you.com','Freemium',4.1,3000000),
  mk(13,'Phind','Chatbot','AI search engine built for developers. Answers with code examples.','https://phind.com','Freemium',4.4,1000000),
  mk(14,'Mistral AI','Chatbot','European open-weight LLM — fast, efficient, privacy-focused.','https://mistral.ai','Freemium',4.4,2000000),
  mk(15,'HuggingChat','Chatbot','Open-source chat interface powered by top open models.','https://huggingface.co/chat','Free',4.1,1000000),

  // ── IMAGE GENERATOR ───────────────────────────────────────────────────────
  mk(16,'Midjourney','Image Generator','Gold standard AI art tool. Stunning photorealistic & artistic images.','https://midjourney.com','Paid',4.9,16000000,true,true),
  mk(17,'DALL-E 3','Image Generator','OpenAI\'s image AI — detailed, accurate visuals from natural language.','https://openai.com/dall-e-3','Freemium',4.7,20000000,true),
  mk(18,'Adobe Firefly','Image Generator','Adobe\'s commercial-safe generative AI for Photoshop & Illustrator.','https://firefly.adobe.com','Freemium',4.5,9000000),
  mk(19,'Canva AI','Image Generator','Text-to-image, Magic Edit, background remover inside Canva.','https://canva.com','Freemium',4.8,150000000,true,true),
  mk(20,'Stable Diffusion','Image Generator','Open-source image model. Run locally free or use hosted services.','https://stability.ai','Free',4.4,10000000),
  mk(21,'Leonardo AI','Image Generator','Creator-focused image platform with fine-tuned models & ControlNet.','https://leonardo.ai','Freemium',4.5,4000000),
  mk(22,'Ideogram','Image Generator','AI image tool specialising in accurate text rendering inside images.','https://ideogram.ai','Freemium',4.6,2000000),
  mk(23,'Playground AI','Image Generator','Free image generation with multiple model options & editing tools.','https://playground.com','Freemium',4.4,3000000),
  mk(24,'NightCafe','Image Generator','Art generation community with daily challenges & social features.','https://nightcafe.studio','Freemium',4.3,5000000),
  mk(25,'Clipdrop','Image Generator','AI image editing suite — remove bg, upscale, relight, uncrop.','https://clipdrop.co','Freemium',4.4,2000000),
  mk(26,'Remove.bg','Image Generator','Instant AI background removal. No skills needed.','https://remove.bg','Freemium',4.6,50000000),
  mk(27,'Magnific AI','Image Generator','Ultra-high-resolution AI upscaling with hallucinated detail enhancement.','https://magnific.ai','Paid',4.7,500000),
  mk(28,'PhotoRoom','Image Generator','AI photo editor for product images. Remove & replace backgrounds.','https://photoroom.com','Freemium',4.5,5000000),
  mk(29,'Remini','Image Generator','AI photo enhancer — restore old photos and boost face clarity.','https://remini.ai','Freemium',4.4,10000000),
  mk(30,'Freepik AI','Image Generator','AI image generation integrated into Freepik\'s massive asset library.','https://freepik.com','Freemium',4.3,20000000),

  // ── VIDEO ─────────────────────────────────────────────────────────────────
  mk(31,'Runway ML','Video','Professional AI video gen, inpainting & motion tracking in one tool.','https://runwayml.com','Freemium',4.8,3000000,true,true),
  mk(32,'Pika Labs','Video','Cinematic AI video from text or images with fine motion control.','https://pika.art','Freemium',4.5,600000),
  mk(33,'Sora','Video','OpenAI\'s text-to-video generating minute-long photorealistic clips.','https://sora.com','Paid',4.7,1000000),
  mk(34,'Synthesia','Video','AI avatar videos in 120+ languages — no camera or studio needed.','https://synthesia.io','Paid',4.6,50000),
  mk(35,'HeyGen','Video','AI avatar videos for marketing, training & personalised outreach.','https://heygen.com','Freemium',4.5,500000),
  mk(36,'Luma AI','Video','Dream Machine — high-quality text-to-video with realistic motion.','https://lumalabs.ai','Freemium',4.6,1000000),
  mk(37,'InVideo AI','Video','AI video creator with 5000+ templates for YouTube & social media.','https://invideo.io','Freemium',4.4,7000000),
  mk(38,'Descript','Video','AI-powered video editor — edit video by editing transcript text.','https://descript.com','Freemium',4.5,500000),
  mk(39,'Captions AI','Video','Auto-captions, eye contact correction & AI video editing for creators.','https://captions.ai','Freemium',4.5,2000000),
  mk(40,'Opus Clip','Video','Repurpose long videos into viral short clips automatically.','https://opus.pro','Freemium',4.5,1000000),
  mk(41,'D-ID','Video','Animate photos & create AI presenter videos from text.','https://d-id.com','Freemium',4.4,500000),
  mk(42,'Lumen5','Video','Turn blog posts into engaging social videos automatically.','https://lumen5.com','Freemium',4.2,800000),

  // ── CODING ────────────────────────────────────────────────────────────────
  mk(43,'GitHub Copilot','Coding','AI pair programmer by GitHub. Autocompletes lines, functions & files.','https://github.com/features/copilot','Paid',4.8,1800000,true,true),
  mk(44,'Cursor','Coding','AI-first code editor — chat with codebase, fix bugs, generate features.','https://cursor.sh','Freemium',4.9,800000,true,true),
  mk(45,'Codeium','Coding','Free AI coding assistant with autocomplete across 70+ languages.','https://codeium.com','Free',4.5,700000),
  mk(46,'Tabnine','Coding','Private AI code completion that runs locally for enterprise teams.','https://tabnine.com','Freemium',4.4,1000000),
  mk(47,'Replit AI','Coding','Build, run & deploy apps in browser with AI-powered code gen.','https://replit.com','Freemium',4.5,22000000),
  mk(48,'Amazon CodeWhisperer','Coding','AWS\'s AI coding companion for cloud-aware code suggestions.','https://aws.amazon.com/codewhisperer','Freemium',4.4,500000),
  mk(49,'Bolt.new','Coding','AI full-stack app builder — prompt to deployed app in minutes.','https://bolt.new','Freemium',4.8,500000),
  mk(50,'v0','Coding','Vercel\'s AI that generates React UI from natural language prompts.','https://v0.dev','Freemium',4.7,400000),
  mk(51,'Lovable','Coding','Build full-stack web apps by chatting — no coding skills needed.','https://lovable.dev','Freemium',4.6,200000),
  mk(52,'Windsurf','Coding','Codeium\'s agentic IDE with Cascade — deep multi-file code flows.','https://codeium.com/windsurf','Freemium',4.7,300000),
  mk(53,'Sourcegraph Cody','Coding','AI coding assistant with full codebase context for large repos.','https://sourcegraph.com','Freemium',4.3,200000),
  mk(54,'CodiumAI','Coding','AI that generates meaningful unit tests for your code automatically.','https://codium.ai','Freemium',4.4,300000),

  // ── WRITING ───────────────────────────────────────────────────────────────
  mk(55,'Grammarly','Writing','AI grammar, tone, clarity & style suggestions across every app.','https://grammarly.com','Freemium',4.6,30000000,true,true),
  mk(56,'QuillBot','Writing','AI paraphrasing, summarising & grammar checking for any text.','https://quillbot.com','Freemium',4.5,35000000,true),
  mk(57,'Jasper AI','Writing','AI content platform for marketing — blogs, ads & email at scale.','https://jasper.ai','Paid',4.4,100000),
  mk(58,'Copy.ai','Writing','AI copywriting for marketing copy, emails & product descriptions.','https://copy.ai','Freemium',4.3,10000000),
  mk(59,'Writesonic','Writing','AI writer & chatbot builder for long-form blogs and landing pages.','https://writesonic.com','Freemium',4.4,2000000),
  mk(60,'Rytr','Writing','Affordable AI writing assistant with 40+ templates & 30 languages.','https://rytr.me','Freemium',4.3,7000000),
  mk(61,'Wordtune','Writing','AI writing companion that rewrites, expands & shortens sentences.','https://wordtune.com','Freemium',4.3,5000000),
  mk(62,'ProWritingAid','Writing','Deep grammar & style editor loved by professional authors.','https://prowritingaid.com','Freemium',4.4,3000000),
  mk(63,'Sudowrite','Writing','AI creative writing partner for fiction writers & novelists.','https://sudowrite.com','Paid',4.4,200000),
  mk(64,'Hypotenuse AI','Writing','AI content writer for e-commerce product descriptions at scale.','https://hypotenuse.ai','Paid',4.3,200000),
  mk(65,'Notion AI','Writing','AI assistant built into Notion — draft, summarise & translate.','https://notion.so','Paid',4.5,30000000),
  mk(66,'Hemingway App','Writing','Readability editor that highlights complex sentences & passive voice.','https://hemingwayapp.com','Freemium',4.2,2000000),

  // ── PPT ───────────────────────────────────────────────────────────────────
  mk(67,'Gamma.app','PPT','Beautiful presentations & docs from a single text prompt instantly.','https://gamma.app','Freemium',4.7,10000000,true,true),
  mk(68,'Beautiful.ai','PPT','Smart slides that auto-design as you type your content.','https://beautiful.ai','Paid',4.4,1000000),
  mk(69,'Tome','PPT','AI storytelling tool for modern narrative-driven presentations.','https://tome.app','Freemium',4.3,1500000),
  mk(70,'Pitch','PPT','Collaborative presentations with AI design & real-time editing.','https://pitch.com','Freemium',4.2,700000),
  mk(71,'SlidesAI','PPT','Google Slides add-on that auto-creates decks from text or outline.','https://slidesai.io','Freemium',4.3,300000),
  mk(72,'Decktopus','PPT','AI presentation builder with smart slide suggestions & templates.','https://decktopus.com','Freemium',4.2,200000),
  mk(73,'MagicSlides','PPT','Generate complete Google Slides presentations from a topic instantly.','https://magicslides.app','Freemium',4.3,500000),
  mk(74,'Storydoc','PPT','Interactive presentations & proposals with built-in analytics.','https://storydoc.com','Paid',4.3,200000),

  // ── MARKETING ─────────────────────────────────────────────────────────────
  mk(75,'AdCreative.ai','Marketing','AI ad creative generator — banners, social ads & copy at scale.','https://adcreative.ai','Paid',4.5,500000),
  mk(76,'Pencil AI','Marketing','AI ad creative testing platform — predicts ad performance before launch.','https://trypencil.com','Paid',4.4,100000),
  mk(77,'ManyChat','Marketing','AI chatbot marketing for Instagram, WhatsApp & Facebook DMs.','https://manychat.com','Freemium',4.5,1000000),
  mk(78,'Tidio','Marketing','AI-powered live chat & chatbot for customer support & sales.','https://tidio.com','Freemium',4.4,500000),
  mk(79,'HubSpot AI','Marketing','AI tools built into HubSpot CRM — emails, blogs & workflows.','https://hubspot.com','Freemium',4.5,200000),
  mk(80,'Mailchimp AI','Marketing','AI-powered email marketing with smart subject lines & send-time optimisation.','https://mailchimp.com','Freemium',4.3,12000000),
  mk(81,'Klaviyo AI','Marketing','AI email & SMS platform for e-commerce revenue automation.','https://klaviyo.com','Freemium',4.4,100000),
  mk(82,'Phrasee','Marketing','AI brand language optimisation for subject lines, push & social.','https://phrasee.co','Paid',4.3,100000),
  mk(83,'Mutiny','Marketing','AI website personalisation — different content for every visitor.','https://mutinyhq.com','Paid',4.3,50000),
  mk(84,'Smartly.io','Marketing','AI social ad automation & creative optimisation platform.','https://smartly.io','Paid',4.3,100000),

  // ── AUDIO ─────────────────────────────────────────────────────────────────
  mk(85,'ElevenLabs','Audio','Ultra-realistic AI voice synthesis & cloning in 29 languages.','https://elevenlabs.io','Freemium',4.8,1000000,true,true),
  mk(86,'Suno AI','Audio','Generate full songs with vocals from a text prompt in seconds.','https://suno.ai','Freemium',4.7,5000000,true,true),
  mk(87,'Udio','Audio','Create studio-quality music from text prompts across any genre.','https://udio.com','Freemium',4.6,1000000),
  mk(88,'Murf AI','Audio','Professional AI voiceover studio with 120+ voices & accents.','https://murf.ai','Freemium',4.6,500000),
  mk(89,'Otter.ai','Audio','AI meeting transcription & real-time note-taking assistant.','https://otter.ai','Freemium',4.5,1000000),
  mk(90,'Adobe Podcast','Audio','AI audio recording & enhancement — studio quality from any mic.','https://podcast.adobe.com','Free',4.5,1000000),
  mk(91,'AIVA','Audio','AI composer for royalty-free music in film, games & ads.','https://aiva.ai','Freemium',4.4,500000),
  mk(92,'Soundraw','Audio','AI music generator for creators — fully customisable & royalty-free.','https://soundraw.io','Paid',4.5,300000),
  mk(93,'Boomy','Audio','Create & release original AI music in seconds. Monetise on Spotify.','https://boomy.com','Freemium',4.3,2000000),
  mk(94,'Resemble AI','Audio','AI voice cloning & real-time voice changer for apps & games.','https://resemble.ai','Paid',4.4,100000),

  // ── DESIGN ────────────────────────────────────────────────────────────────
  mk(95,'Figma AI','Design','AI design tools in Figma — auto-layout, prototyping & copy generation.','https://figma.com','Freemium',4.7,4000000,true,true),
  mk(96,'Framer AI','Design','AI website builder — describe your site, it builds & hosts it.','https://framer.com','Freemium',4.7,2000000),
  mk(97,'Looka','Design','AI brand designer — logo, colours & brand kit in minutes.','https://looka.com','Paid',4.4,1000000),
  mk(98,'Uizard','Design','AI UI prototyping — sketch to interactive mockup instantly.','https://uizard.io','Freemium',4.5,500000),
  mk(99,'Durable','Design','AI website builder that creates a full business site in 30 seconds.','https://durable.co','Freemium',4.4,1000000),
  mk(100,'Brandmark','Design','AI logo generator with full brand identity kit output.','https://brandmark.io','Paid',4.3,200000),
  mk(101,'Galileo AI','Design','AI UI design from text descriptions — React & Figma export.','https://usegalileo.ai','Paid',4.5,100000),
  mk(102,'Wix AI','Design','AI website builder inside Wix — full site from a short prompt.','https://wix.com','Freemium',4.3,200000000),

  // ── RESEARCH ──────────────────────────────────────────────────────────────
  mk(103,'Elicit','Research','AI research assistant that finds & summarises scientific papers.','https://elicit.com','Freemium',4.5,500000),
  mk(104,'Consensus','Research','Search 200M+ papers & get AI-synthesised research insights.','https://consensus.app','Freemium',4.4,500000),
  mk(105,'SciSpace','Research','Read, understand & chat with any research paper using AI.','https://typeset.io','Freemium',4.5,2000000),
  mk(106,'Jenni AI','Research','AI writing assistant built for academic papers & literature reviews.','https://jenni.ai','Paid',4.5,1000000),
  mk(107,'ChatPDF','Research','Chat with any PDF — research papers, contracts, textbooks.','https://chatpdf.com','Freemium',4.4,2000000),
  mk(108,'ResearchRabbit','Research','AI paper discovery tool — visualise citation networks & find gaps.','https://researchrabbit.ai','Free',4.5,200000),
  mk(109,'Scite','Research','Smart citations — see how papers have been supported or disputed.','https://scite.ai','Paid',4.5,200000),
  mk(110,'Explainpaper','Research','Upload a paper, highlight confusing parts, AI explains them simply.','https://explainpaper.com','Free',4.3,200000),

  // ── SEO ───────────────────────────────────────────────────────────────────
  mk(111,'Surfer SEO','SEO','AI-powered content optimisation graded against top SERP competitors.','https://surferseo.com','Paid',4.6,500000),
  mk(112,'Semrush AI','SEO','All-in-one SEO suite with AI writing, keyword & competitor tools.','https://semrush.com','Freemium',4.5,1000000),
  mk(113,'Ahrefs AI','SEO','Industry-leading backlink & keyword research with AI content tools.','https://ahrefs.com','Paid',4.6,500000),
  mk(114,'Clearscope','SEO','AI content optimisation grader for high-ranking long-form content.','https://clearscope.io','Paid',4.5,100000),
  mk(115,'NeuronWriter','SEO','AI SEO content editor with NLP terms & competitor analysis built in.','https://neuronwriter.com','Paid',4.4,200000),
  mk(116,'Frase','SEO','AI content brief & optimisation tool — research & write in one place.','https://frase.io','Paid',4.4,500000),
  mk(117,'MarketMuse','SEO','AI content intelligence platform for enterprise editorial planning.','https://marketmuse.com','Paid',4.4,100000),
  mk(118,'KeywordInsights','SEO','AI keyword clustering & content strategy planning tool.','https://keywordinsights.ai','Paid',4.4,100000),

  // ── PRODUCTIVITY ──────────────────────────────────────────────────────────
  mk(119,'ClickUp AI','Productivity','AI project management — summarise tasks, write updates & automate.','https://clickup.com','Freemium',4.5,10000000),
  mk(120,'Reclaim AI','Productivity','AI calendar assistant that auto-schedules tasks, habits & meetings.','https://reclaim.ai','Freemium',4.5,500000),
  mk(121,'Motion','Productivity','AI daily planner — automatically reschedules your day as plans change.','https://usemotion.com','Paid',4.5,200000),
  mk(122,'Taskade','Productivity','AI-powered project manager with agent workflows & team collaboration.','https://taskade.com','Freemium',4.4,500000),
  mk(123,'Zapier AI','Productivity','AI automation — connect 6000+ apps with natural language zaps.','https://zapier.com','Freemium',4.5,2000000),
  mk(124,'Mem AI','Productivity','AI note-taking that auto-organises your knowledge base.','https://mem.ai','Freemium',4.3,100000),
  mk(125,'Superhuman AI','Productivity','AI email client with blazing speed, AI triage & reply suggestions.','https://superhuman.com','Paid',4.6,100000),
  mk(126,'Bardeen','Productivity','AI browser automation — scrape, click & fill forms with no code.','https://bardeen.ai','Freemium',4.4,200000),
];

export const categories = [
  'All','Chatbot','Image Generator','Video','Coding',
  'Writing','PPT','Marketing','Audio','Design','Research','SEO','Productivity',
];

export const categoryEmoji = {
  All:'✨', Chatbot:'💬', 'Image Generator':'🎨', Video:'🎬',
  Coding:'💻', Writing:'✍️', PPT:'📊', Marketing:'📣',
  Audio:'🎵', Design:'🖌️', Research:'🔬', SEO:'📈', Productivity:'⚡',
};

