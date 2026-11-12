import { tools } from '../data/tools';

const byCategory = (cat, limit = 4) =>
  tools.filter(t => t.category === cat).sort((a, b) => b.rating - a.rating).slice(0, limit);

const byIds = (...ids) => ids.map(id => tools.find(t => t.id === id)).filter(Boolean);
const topFeatured = (n = 4) => tools.filter(t => t.featured).sort((a, b) => b.rating - a.rating).slice(0, n);
const snippet = t => ({ id: t.id, name: t.name, url: t.url, logo: t.logo, category: t.category, description: t.description, rating: t.rating });

function normalize(raw) {
  let m = raw.toLowerCase().trim();

  m = m.replace(/what's/g, 'what is');
  m = m.replace(/who's/g, 'who is');
  m = m.replace(/how's/g, 'how is');
  m = m.replace(/where's/g, 'where is');
  m = m.replace(/i'm/g, 'i am');
  m = m.replace(/don't/g, 'do not');
  m = m.replace(/can't/g, 'cannot');
  m = m.replace(/won't/g, 'will not');

  m = m.replace(/\bwhats\b/g, 'what is');
  m = m.replace(/\bwhos\b/g, 'who is');
  m = m.replace(/\bhows\b/g, 'how is');
  m = m.replace(/\bim\b/g, 'i am');
  m = m.replace(/\bdont\b/g, 'do not');
  m = m.replace(/\bcant\b/g, 'cannot');
  m = m.replace(/\bwanna\b/g, 'want to');
  m = m.replace(/\bgonna\b/g, 'going to');
  m = m.replace(/\bgotta\b/g, 'got to');
  m = m.replace(/\bkinda\b/g, 'kind of');
  m = m.replace(/\blmk\b/g, 'let me know');
  m = m.replace(/\bbtw\b/g, 'by the way');
  m = m.replace(/\bpls\b|\bplz\b/g, 'please');
  m = m.replace(/\bthx\b/g, 'thanks');
  m = m.replace(/\bty\b/g, 'thank you');
  m = m.replace(/\bawesome\b/g, 'awesome');

  m = m.replace(/\bur\b/g, 'your');
  m = m.replace(/\bu\b/g, 'you');
  m = m.replace(/\br\b/g, 'are');
  m = m.replace(/\bw\//g, 'with');
  m = m.replace(/\bw\b/g, 'with');
  m = m.replace(/\bn\b/g, 'and');
  m = m.replace(/\bk\b/g, 'ok');
  m = m.replace(/\bfr\b/g, 'for real');
  m = m.replace(/\bngl\b/g, 'not gonna lie');
  m = m.replace(/\bidk\b/g, 'i do not know');
  m = m.replace(/\bimo\b/g, 'in my opinion');

  m = m.replace(/[^\w\s]/g, ' ');

  m = m.replace(/\s+/g, ' ').trim();
  return m;
}

export function extractContextHints(rawMsg) {
  const msg = normalize(rawMsg);
  const hints = {};
  if (/\b(beginner|newbie|new to|just started|learning|no experience|student|first time)\b/.test(msg)) hints.skillLevel = 'beginner';
  else if (/\b(intermediate|some experience|familiar)\b/.test(msg)) hints.skillLevel = 'intermediate';
  else if (/\b(advanced|expert|professional|senior)\b/.test(msg)) hints.skillLevel = 'advanced';

  if (/\b(free|no budget|cheap|affordable|low budget|open.?source|broke)\b/.test(msg)) hints.budget = 'low';
  else if (/\b(paid|premium|enterprise|money is not|do not mind paying)\b/.test(msg)) hints.budget = 'high';

  const techs = [];
  if (/\breact\b/.test(msg)) techs.push('React');
  if (/\bfirebase\b/.test(msg)) techs.push('Firebase');
  if (/\bnext\.?js\b/.test(msg)) techs.push('Next.js');
  if (/\bpython\b/.test(msg)) techs.push('Python');
  if (/\bnode\.?js\b|\bnode\b/.test(msg)) techs.push('Node.js');
  if (techs.length) hints.techStack = techs;
  return hints;
}

function intent(msg) {
  if (/^(hi|hello|hey|yo|sup|howdy|greetings)\b/.test(msg)) return 'greeting';

  if (/\b(who are you|what are you|what is your name|your name|introduce yourself|tell me about yourself|are you (an ai|a bot|a robot|real))\b/.test(msg)) return 'identity';

  if (/\b(how are you|how r u|how's it going|how do you do|you doing|what'?s up|good (morning|evening|afternoon|night)|morning|evening|afternoon)\b/.test(msg)) return 'casual';

  if (/\b(thanks?|thank you|thx|ty|cheers|appreciate|helpful|great|nice|awesome|cool|perfect|love it|excellent|brilliant|amazing)\b/.test(msg)) return 'gratitude';

  if (/what can you (do|help)|how (do|can) you help|your features|your capabilities|what do you (offer|know|support)/.test(msg)) return 'capability';

  if (/\bvs\.?\b|versus|\bcompare\b|difference between|which is better|better than/.test(msg)) return 'comparison';

  if (/\b(build|create|make|develop|building|creating|making|working on|i want to|i need to|help me (build|create|make)|i'?m (building|creating|making|working on))\b/.test(msg)
    || /\b(saas|startup|mvp|portfolio|dashboard|ecommerce|fitness|health|workout|social|mobile app|ai project|game|study app|blog|landing page)\b/.test(msg)
    || /\b(app|application|platform|tool|system|website)\b/.test(msg)) return 'project';

  if (/\b(best|top|recommend|suggest)\b.*(tool|ai|app)|tool.*(for|to)\b/.test(msg)) return 'category';
  if (/\b(coding|programming|design|ui|ux|writing|video|research|audio|music|image|art|marketing|seo|productivity)\b/.test(msg)) return 'category';
  if (/\b(what is|who is|tell me about|explain|how does)\b/.test(msg)) return 'general';
  return 'fallback';
}

function projectType(msg) {
  const s = {
    fitness: 0, study: 0, portfolio: 0, dashboard: 0,
    ecommerce: 0, ai_app: 0, game: 0, blog: 0,
    website: 0, social: 0, creator: 0, productivity_app: 0, saas: 0,
  };

  if (/\b(fitness|workout|exercise|gym|health|wellness|calorie|caloric|meal plan|nutrition|diet|weight loss|muscle|cardio|running|yoga|step tracker|pedometer|bmi|macro|protein)\b/.test(msg)) s.fitness += 10;
  if (/\b(fitness (app|tracker|platform)|health (app|tracker)|workout (app|tracker|planner)|calorie (tracker|counter)|meal (planner|tracker))\b/.test(msg)) s.fitness += 8;
  if (/\b(wearable|apple health|google fit|fitbit)\b/.test(msg)) s.fitness += 6;

  if (/\b(study|student|education|e.?learning|quiz|flashcard|tutor|exam|course|lecture|homework|academic)\b/.test(msg)) s.study += 10;
  if (/\b(pdf (chat|reader|ai)|study (app|assistant|tool)|learning (app|platform))\b/.test(msg)) s.study += 8;
  if (/\b(notes|note.taking)\b/.test(msg)) s.study += 4;

  if (/\b(portfolio|personal (website|site|brand)|showcase|about me|resume site|cv site)\b/.test(msg)) s.portfolio += 10;

  if (/\b(admin panel|data viz|business intelligence|bi tool)\b/.test(msg)) s.dashboard += 8;
  if (/\b(dashboard|analytics|metrics|reporting|monitor|kpi)\b/.test(msg)) s.dashboard += 4;

  if (/\b(ecommerce|e-commerce|online shop|online store|sell online|marketplace|shopify|woocommerce)\b/.test(msg)) s.ecommerce += 10;
  if (/\b(store|shop|sell|product listing)\b/.test(msg)) s.ecommerce += 3;

  if (/\b(ai (app|tool|chatbot|assistant|project|agent)|chatbot|llm app|ml project|machine learning|ai.powered)\b/.test(msg)) s.ai_app += 10;

  if (/\b(game|gaming|unity|godot|pygame|indie game|rpg|puzzle game)\b/.test(msg)) s.game += 10;

  if (/\b(blog|cms|newsletter|wordpress|content site|publication)\b/.test(msg)) s.blog += 10;

  if (/\b(landing page|web page|homepage|web presence|business website|static site)\b/.test(msg)) s.website += 8;
  if (/\b(website|web app)\b/.test(msg)) s.website += 2;

  if (/\b(social (app|network|media app)|community (app|platform)|messaging app|chat app|feed|follower|post|like|comment|dating app)\b/.test(msg)) s.social += 10;
  if (/\b(social|network|community|followers)\b/.test(msg)) s.social += 3;

  if (/\b(content creator|youtuber|youtube channel|podcast(er)?|streamer|influencer|creator tools|video creator|reels creator)\b/.test(msg)) s.creator += 10;
  if (/\b(creator|content (studio|workflow))\b/.test(msg)) s.creator += 4;

  if (/\b(productivity app|todo app|task (manager|app)|habit tracker|planner app|note.taking app|reminder app|kanban|time tracker)\b/.test(msg)) s.productivity_app += 10;

  if (/\b(saas|b2b|startup|product startup|launch)\b/.test(msg)) s.saas += 6;
  if (/\b(mvp|build|create|develop|app|platform)\b/.test(msg)) s.saas += 1;

  const sorted = Object.entries(s).sort((a, b) => b[1] - a[1]);
  return sorted[0][1] >= 3 ? sorted[0][0] : 'saas';
}

function detectCategory(msg) {
  if (/\b(cod|program|develop|engineer|github|cursor|debug|software)\b/.test(msg)) return ['Coding', 'Coding & Development', '💻'];
  if (/\b(design|ui|ux|figma|prototype|mockup|brand|logo|visual)\b/.test(msg)) return ['Design', 'UI/UX Design', '🎨'];
  if (/\b(video|youtube|reels|shorts|animation|film)\b/.test(msg)) return ['Video', 'Video Creation', '🎬'];
  if (/\b(writ|blog|content|copy|essay|article)\b/.test(msg)) return ['Writing', 'Writing & Content', '✍️'];
  if (/\b(research|paper|academic|science|literature|thesis)\b/.test(msg)) return ['Research', 'Research & Academia', '🔬'];
  if (/\b(image|art|generat|illustration|photo|midjourney)\b/.test(msg)) return ['Image Generator', 'AI Art & Images', '🖼️'];
  if (/\b(audio|music|voice|podcast|song|sound)\b/.test(msg)) return ['Audio', 'Audio & Music', '🎵'];
  if (/\b(productiv|task|schedule|workflow|automat|calendar)\b/.test(msg)) return ['Productivity', 'Productivity', '⚡'];
  if (/\b(market|advertis|ads|campaign|social media)\b/.test(msg)) return ['Marketing', 'Marketing & Ads', '📣'];
  if (/\b(chatbot|llm|gpt|claude|gemini|language model)\b/.test(msg)) return ['Chatbot', 'AI Chatbots & LLMs', '💬'];
  if (/\b(seo|keyword|backlink|rank|serp)\b/.test(msg)) return ['SEO', 'SEO Strategy', '📈'];
  if (/\b(presentation|slide|ppt|powerpoint|deck|pitch)\b/.test(msg)) return ['PPT', 'Presentations', '📊'];
  return null;
}

function parseComparison(msg) {
  const m = msg.match(/(.+?)\s+(?:vs\.?|versus)\s+(.+)/i)
    || msg.match(/compare\s+(.+?)\s+(?:to|with|and|vs\.?)\s+(.+)/i)
    || msg.match(/difference between\s+(.+?)\s+(?:and|vs\.?)\s+(.+)/i);
  return m ? [m[1].replace(/^compare\s*/i, '').trim(), m[2].trim()] : null;
}

function r_greeting(ctx) {
  const isReturn = ctx.messageCount > 1;
  const openers = [
    "Hey! 👋 Great to see you.",
    "Hello there! 👋",
    "Hi! 👋 Ready to build something great?",
  ];
  const opener = isReturn ? "Welcome back! 👋" : openers[Math.floor(Math.random() * openers.length)];
  return {
    type: 'greeting',
    intro: `${opener} I'm **Velox AI** — your AI project advisor.`,
    bullets: [
      '🚀 Build a custom AI stack for any project idea',
      '⚖️ Compare tools side-by-side (e.g. ChatGPT vs Claude)',
      '🎯 Skill-level & budget-aware recommendations',
      '📚 Specialised stacks: fitness apps, study tools, SaaS, portfolios & more',
    ],
    sections: [],
    outro: 'Try: *"I want to build a fitness tracker as a beginner"* or *"Compare Cursor vs GitHub Copilot"*',
  };
}

function r_identity() {
  return {
    type: 'greeting',
    intro: "I'm **Velox AI** ✦ — an intelligent AI project recommendation assistant built into the Velox platform.",
    bullets: [
      '🧠 I analyse your project idea and return a custom AI tool stack',
      '⚖️ I compare AI tools side-by-side with ratings and use cases',
      '📂 I know 120+ AI tools across 12 categories',
      '🎓 I adapt to your skill level — beginner to advanced',
      '💰 I highlight free & freemium tools when you\'re on a budget',
    ],
    sections: [],
    outro: 'Tell me what you\'re building and I\'ll design a full AI stack for you.\n\n*Try: "I want to build a study app" or "Compare ChatGPT vs Claude"*',
  };
}

function r_casual(msg) {
  const isGoodMorning = /morning/.test(msg);
  const isGoodEvening = /evening|afternoon|night/.test(msg);

  let reply;
  if (isGoodMorning) {
    reply = "Good morning! ☀️ Hope you're ready to build something amazing today.";
  } else if (isGoodEvening) {
    reply = "Good evening! 🌙 Late-night building session? I'm here to help.";
  } else if (/how are you|how'?s it going|how do you do|you doing/.test(msg)) {
    reply = "Doing great, thanks for asking! 😊 I'm always ready to recommend the perfect AI stack.";
  } else {
    reply = "Hey! 👋 Good to hear from you.";
  }

  return {
    type: 'greeting',
    intro: reply,
    bullets: [],
    sections: [],
    outro: 'What can I help you with today?\n\n• *"Best AI tools for coding"*\n• *"I want to build a SaaS product"*\n• *"Compare ChatGPT vs Claude"*',
  };
}

function r_gratitude() {
  const replies = [
    "You're welcome! 😊 Happy to help.",
    "Glad that was useful! ✦ Anything else you want to explore?",
    "Anytime! 🚀 That's what I'm here for.",
    "Of course! Let me know if you need more recommendations.",
  ];
  const reply = replies[Math.floor(Math.random() * replies.length)];
  return {
    type: 'greeting',
    intro: reply,
    bullets: [],
    sections: [],
    outro: 'Feel free to ask anytime:\n\n• *"Build a productivity app stack"*\n• *"Best free AI tools"*\n• *"Compare Figma AI vs Uizard"*',
  };
}

function r_capability() {
  return {
    type: 'capability',
    intro: "I'm **Velox AI** — here's everything I can do for you:",
    bullets: [
      '🧱 **Stack Builder** — Full AI tech stack for any project idea',
      '⚖️ **Tool Comparisons** — Deep comparison of any two AI tools',
      '📂 **Category Browse** — Best tools for coding, design, writing & more',
      '🎓 **Skill-aware picks** — Beginner to advanced recommendations',
      '💰 **Budget-aware** — Free & freemium options highlighted',
      '🧠 **Context memory** — I remember your preferences during the chat',
    ],
    sections: [],
    outro: "What's your project? Describe it and I'll build a custom AI stack for you!",
  };
}

function r_comparison(nameA, nameB, msg) {
  const find = name => {
    const n = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    return tools.find(t => {
      const tn = t.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      return tn.includes(n) || n.includes(tn);
    });
  };
  const a = find(nameA), b = find(nameB);

  if (!a || !b) {
    return {
      type: 'fallback',
      intro: `🔍 Couldn't find **${!a ? nameA : nameB}** in the database. Try using the exact tool name.`,
      sections: [{ label: '💡 Popular Tools to Compare', tools: topFeatured(3).map(snippet), note: 'e.g. "Cursor vs GitHub Copilot" or "ChatGPT vs Claude"' }],
      outro: 'Use tool names exactly as shown on the Velox cards.',
    };
  }

  const winner = a.rating > b.rating ? a : b.rating > a.rating ? b : null;
  const outro = winner
    ? `🎯 Overall: **${winner.name}** (⭐${winner.rating}) scores higher. ${a.category === b.category ? 'Both are in the same category — your workflow preference decides.' : `${a.name} focuses on ${a.category}, ${b.name} on ${b.category}.`}`
    : `🤝 Both are equally rated at ⭐${a.rating} — choose based on your specific workflow.`;

  return {
    type: 'comparison',
    intro: `⚖️ **${a.name}** vs **${b.name}** — Side-by-side breakdown:`,
    comparison: [snippet(a), snippet(b)],
    sections: [],
    outro,
  };
}

function r_study(ctx) {
  const isBegin = ctx.skillLevel === 'beginner';
  const isFree = ctx.budget === 'low';
  return {
    type: 'stack',
    intro: '📚 Here\'s a complete **Study Assistant / Learning App** AI stack:',
    sections: [
      {
        label: '💻 Frontend & Development',
        tools: byIds(isBegin ? 49 : 44, 50, isBegin ? 47 : 52).filter(Boolean).slice(0, 3).map(snippet),
        note: isBegin ? 'Bolt.new or Replit — zero setup, deploy in minutes' : 'Cursor IDE with full codebase AI context',
      },
      {
        label: '🤖 AI / LLM Engine',
        tools: byIds(3, 1, 2).map(snippet),
        note: isFree ? '✅ Gemini API has a generous free tier — perfect for student projects' : 'OpenAI GPT-4 for best quality, Gemini for multimodal',
      },
      {
        label: '📄 PDF & Document AI',
        tools: byIds(107, 105, 110).map(snippet),
        note: 'Let students chat with textbooks, research papers, and PDFs',
      },
      {
        label: '🎵 Voice & Audio Learning',
        tools: byIds(85, 89, 90).map(snippet),
        note: 'Voice explanations, auto-transcription, and audio flashcards',
      },
      {
        label: '🔬 Research Tools',
        tools: byIds(103, 108, 104).map(snippet),
        note: 'Find papers, summarise research, and discover knowledge gaps',
      },
    ],
    outro: isFree
      ? '💡 **Free stack:** Gemini API (free tier) + Firebase (free Spark plan) + Replit = full study app at $0!'
      : '🗺️ **Roadmap:** PDF Q&A → Quiz generation → Voice explanations → Spaced repetition system',
  };
}

function r_portfolio(ctx) {
  const isBegin = ctx.skillLevel === 'beginner';
  return {
    type: 'stack',
    intro: '🌟 Here\'s your **AI-Powered Portfolio Website** stack:',
    sections: [
      {
        label: '🎨 Design & Layout',
        tools: byIds(95, 98, 19).map(snippet),
        note: 'Design first — wireframe in Uizard, refine in Figma AI',
      },
      {
        label: '💻 Build & Deploy',
        tools: byIds(isBegin ? 99 : 50, isBegin ? 96 : 96, isBegin ? 102 : 44).map(snippet),
        note: isBegin ? 'Framer AI builds and hosts your portfolio from a description in minutes' : 'Use v0.dev to generate React components, deploy to Vercel',
      },
      {
        label: '✍️ Content & Bio',
        tools: byIds(55, 65, 57).map(snippet),
        note: 'AI-polish your bio, project descriptions, and case studies',
      },
      {
        label: '🖼️ Visuals & Mockups',
        tools: byIds(16, 19, 25).map(snippet),
        note: 'Generate hero images, project screenshots, and social assets',
      },
    ],
    outro: isBegin
      ? '🚀 **Fastest path:** Describe your portfolio to Framer AI → publish in under 1 hour, no coding needed!'
      : '💡 **Dev path:** v0.dev for UI → React + Tailwind → deploy to Vercel with custom domain.',
  };
}

function r_dashboard(ctx) {
  return {
    type: 'stack',
    intro: '📊 Here\'s a complete **AI Dashboard & Analytics Platform** stack:',
    sections: [
      {
        label: '💻 UI & Components',
        tools: byIds(50, 44, 95).map(snippet),
        note: 'Use v0.dev to instantly generate dashboard UI — tables, charts, cards',
      },
      {
        label: '🤖 AI Insights Layer',
        tools: byIds(2, 1, 4).map(snippet),
        note: 'Claude for long data analysis, GPT-4 for summaries, Perplexity for live data',
      },
      {
        label: '⚡ Automation & Workflows',
        tools: byIds(123, 119, 122).map(snippet),
        note: 'Auto-collect data, trigger reports, and connect your data sources',
      },
      {
        label: '📋 Report Generation',
        tools: byIds(67, 65, 57).map(snippet),
        note: 'Turn raw data into polished AI-written executive summaries',
      },
    ],
    outro: '💡 **Stack:** React + Recharts (charts) + Claude API (AI insights) = premium data dashboard feel.',
  };
}

function r_ecommerce() {
  return {
    type: 'stack',
    intro: '🛒 Here\'s your **AI-Powered E-commerce Store** stack:',
    sections: [
      {
        label: '🏪 Store Builder',
        tools: byIds(99, 102, 96).map(snippet),
        note: 'AI generates your entire store from a short brand description',
      },
      {
        label: '🖼️ Product Photography',
        tools: byIds(28, 26, 19).map(snippet),
        note: 'Remove backgrounds, enhance quality, and generate lifestyle shots',
      },
      {
        label: '✍️ Product Descriptions',
        tools: byIds(64, 57, 58).map(snippet),
        note: 'Generate hundreds of unique, SEO-optimised product descriptions',
      },
      {
        label: '📣 Marketing & Retention',
        tools: byIds(75, 80, 77).map(snippet),
        note: 'AI ad creatives + automated email flows + chatbot support',
      },
    ],
    outro: '💡 **Quick win:** Hypotenuse AI for bulk product descriptions + PhotoRoom for images = store-ready in hours.',
  };
}

function r_aiApp(ctx) {
  const isBegin = ctx.skillLevel === 'beginner';
  return {
    type: 'stack',
    intro: '🤖 Here\'s your **AI Application / Chatbot / ML Project** stack:',
    sections: [
      {
        label: '🧠 LLM / AI Model',
        tools: byIds(1, 2, 3).map(snippet),
        note: 'OpenAI for versatility, Claude for long context, Gemini for multimodal & free tier',
      },
      {
        label: '💻 Development',
        tools: byIds(isBegin ? 47 : 44, 43, isBegin ? 49 : 52).map(snippet),
        note: isBegin ? 'Replit has built-in AI — build your first chatbot in an afternoon' : 'Cursor understands your full codebase context',
      },
      {
        label: '🎨 AI Chat UI',
        tools: byIds(50, 96, 98).map(snippet),
        note: 'v0.dev generates beautiful AI chat interfaces from a description',
      },
      {
        label: '🔍 Research & Data',
        tools: byIds(4, 103, 105).map(snippet),
        note: 'Ground your AI with real research and cited live data',
      },
    ],
    outro: isBegin
      ? '🌱 **Start:** Replit + Gemini API (free) → build your first AI chatbot this weekend!'
      : '🔥 **Pro stack:** Cursor + OpenAI API + Vercel + Supabase = production AI app in days.',
  };
}

function r_saas(ctx) {
  const isBegin = ctx.skillLevel === 'beginner';
  const isFree = ctx.budget === 'low';
  return {
    type: 'stack',
    intro: '🚀 Here\'s your complete **SaaS / Startup** AI stack:',
    sections: [
      {
        label: '💻 Coding & Development',
        tools: byIds(isBegin ? 49 : 44, 43, isBegin ? 47 : 52).map(snippet),
        note: isBegin ? 'Bolt.new ships your MVP in minutes — no complex setup needed' : 'Cursor + Windsurf = the ultimate AI dev workflow',
      },
      {
        label: '🎨 UI & Design',
        tools: byIds(95, 98, 96).map(snippet),
        note: 'Uizard converts sketches to working UI — no design skills required',
      },
      {
        label: '🤖 AI Core / APIs',
        tools: byIds(1, 2, 3).map(snippet),
        note: isFree ? '✅ Gemini API free tier is excellent for budget-conscious founders' : 'GPT-4 or Claude for premium AI features',
      },
      {
        label: '📣 Marketing & Growth',
        tools: byIds(75, 57, 79).map(snippet),
        note: 'Launch your waitlist, write copy, and run AI-powered ad campaigns',
      },
    ],
    outro: isFree
      ? '💰 **$0 stack:** Bolt.new (code) + Gemini API + Firebase + Framer = working SaaS MVP for free!'
      : '🎯 **Tip:** Cursor for code + Figma AI for design = the fastest indie hacker combo.',
  };
}

function r_website(ctx) {
  const isBegin = ctx.skillLevel === 'beginner';
  return {
    type: 'stack',
    intro: '🌐 Here\'s your **AI Website / Landing Page** stack:',
    sections: [
      {
        label: '⚡ Quick Builder',
        tools: byIds(99, 96, 102).map(snippet),
        note: 'Durable or Framer AI — describe your site, get a full website in seconds',
      },
      {
        label: '🎨 Design & Visuals',
        tools: byIds(95, 19, 16).map(snippet),
        note: 'Figma AI for custom design, Canva + Midjourney for all visuals',
      },
      {
        label: '✍️ Copy & Content',
        tools: byIds(55, 57, 65).map(snippet),
        note: 'AI-write every word: headlines, CTAs, about pages, FAQs',
      },
      {
        label: '📈 SEO & Traffic',
        tools: byIds(111, 112, 116).map(snippet),
        note: 'Rank on Google from day one with AI-driven SEO content',
      },
    ],
    outro: isBegin
      ? '🚀 **Easiest path:** Describe your business to Durable AI → published website in 30 seconds!'
      : '💡 **Dev path:** v0.dev → Next.js → Vercel with Surfer SEO for content.',
  };
}

function r_general(msg) {
  if (/\b(best|top|number one|#1|leading|greatest)\b/.test(msg)) {
    return {
      type: 'category',
      intro: '🏆 Here are the **highest-rated AI tools** right now:',
      sections: [{ label: '⭐ Top Rated Across All Categories', tools: tools.sort((a, b) => b.rating - a.rating).slice(0, 5).map(snippet), note: 'Ranked by community ratings & user count' }],
      outro: 'Want recommendations for a specific use case? Ask: *"Best tools for coding"*',
    };
  }
  const toolMention = tools.find(t => msg.includes(t.name.toLowerCase()));
  if (toolMention) {
    return {
      type: 'category',
      intro: `Here's what I know about **${toolMention.name}**:`,
      sections: [
        { label: `🔍 About ${toolMention.name}`, tools: [snippet(toolMention)], note: `⭐ ${toolMention.rating} rating · ${toolMention.pricing} · ${toolMention.category}` },
        { label: '🔄 Similar Tools', tools: byCategory(toolMention.category, 3).filter(t => t.id !== toolMention.id).map(snippet), note: 'Other top-rated tools in the same category' },
      ],
      outro: `Want to compare? Try: *"${toolMention.name} vs [another tool]"*`,
    };
  }
  return r_fallback();
}

function r_fallback() {
  return {
    type: 'fallback',
    intro: "🤔 I'm not sure what you need — but here are some **trending AI tools** to explore:",
    sections: [{ label: '🔥 Trending Right Now', tools: topFeatured(4).map(snippet), note: 'Hand-picked by the Velox team' }],
    outro: 'Try asking:\n• *"I want to build a fitness tracker"*\n• *"Compare ChatGPT vs Claude"*\n• *"Best tools for UI design"*\n• *"Build a study app as a beginner"*',
  };
}

function r_fitness(ctx) {
  const isBegin = ctx.skillLevel === 'beginner';
  const isFree  = ctx.budget === 'low';
  return {
    type: 'stack',
    intro: '💪 Here\'s a complete **Fitness & Health App** AI stack:',
    sections: [
      {
        label: '📱 Mobile & Frontend',
        tools: byIds(isBegin ? 49 : 44, 50, isBegin ? 47 : 52).filter(Boolean).slice(0, 3).map(snippet),
        note: isBegin
          ? 'Bolt.new or Replit — build a mobile-friendly fitness app with no setup'
          : 'Cursor IDE + React Native / Flutter for native mobile feel',
      },
      {
        label: '🤖 AI Recommendation Engine',
        tools: byIds(3, 1, 2).map(snippet),
        note: isFree
          ? '✅ Gemini API free tier — use it for workout & meal plan generation'
          : 'OpenAI GPT-4 for personalised workout plans, Claude for long meal plans',
      },
      {
        label: '🎙️ Voice Coach & Audio',
        tools: byIds(85, 89, 88).map(snippet),
        note: 'ElevenLabs for a real-time AI voice coach, Murf AI for exercise audio cues',
      },
      {
        label: '🎨 UI & Design',
        tools: byIds(95, 98, 19).map(snippet),
        note: 'Design your fitness dashboard and onboarding flow in Figma AI or Uizard',
      },
      {
        label: '📊 Health Analytics (optional add-on)',
        tools: byIds(119, 123, 120).map(snippet),
        note: 'Track user streaks, calories burned, and progress charts over time',
      },
    ],
    outro: isFree
      ? '💡 **Free stack:** Gemini API + Firebase (Spark plan) + Replit = fitness app at $0 — perfect for a student project!'
      : '🗺️ **Roadmap:** Workout AI → Calorie tracker → Voice coach → Wearable sync (Apple Health / Google Fit)',
  };
}

function r_social(ctx) {
  const isBegin = ctx.skillLevel === 'beginner';
  return {
    type: 'stack',
    intro: '🌐 Here\'s your **Social / Community App** AI stack:',
    sections: [
      {
        label: '💻 Frontend & Real-time UI',
        tools: byIds(isBegin ? 49 : 44, 50, isBegin ? 47 : 52).filter(Boolean).slice(0, 3).map(snippet),
        note: isBegin ? 'Bolt.new builds real-time feeds and chat UIs with no setup' : 'Cursor + React + WebSockets = responsive social feed',
      },
      {
        label: '🤖 AI Content Moderation & Recommendations',
        tools: byIds(1, 2, 3).map(snippet),
        note: 'Use AI to suggest content, moderate posts, and personalise feeds',
      },
      {
        label: '🎨 Visual & Media Tools',
        tools: byIds(16, 19, 31).map(snippet),
        note: 'AI-generated media, filters, and video tools for your community',
      },
      {
        label: '📣 Growth & Engagement',
        tools: byIds(77, 79, 75).map(snippet),
        note: 'AI chatbots for onboarding, email drips for retention, and AI ad creatives',
      },
    ],
    outro: isBegin
      ? '🚀 **Quick start:** Firebase Authentication + Firestore (real-time DB) + Bolt.new = social app skeleton in hours!'
      : '🔥 **Pro tip:** Next.js + Supabase (real-time) + OpenAI moderation API = production-ready social platform.',
  };
}

function r_creator(ctx) {
  const isBegin = ctx.skillLevel === 'beginner';
  return {
    type: 'stack',
    intro: '🎬 Here\'s the ultimate **Content Creator** AI toolkit:',
    sections: [
      {
        label: '🎬 Video Creation & Editing',
        tools: byIds(31, 40, 38).map(snippet),
        note: 'Runway ML for generation, Opus Clip to repurpose long → short, Descript to edit by text',
      },
      {
        label: '🎵 Audio & Voice',
        tools: byIds(85, 86, 89).map(snippet),
        note: 'ElevenLabs voice cloning, Suno AI for background music, Otter.ai for transcripts',
      },
      {
        label: '🖼️ Thumbnail & Visual',
        tools: byIds(16, 19, 22).map(snippet),
        note: 'Midjourney for stunning thumbnails, Canva AI for quick graphics, Ideogram for text-in-image',
      },
      {
        label: '✍️ Scripts & Captions',
        tools: byIds(55, 57, 65).map(snippet),
        note: 'AI-write your scripts, video descriptions, and social captions',
      },
      {
        label: '📈 Growth & SEO',
        tools: byIds(111, 112, 79).map(snippet),
        note: 'Surfer SEO for YouTube keywords, Semrush for topic research, HubSpot AI for funnels',
      },
    ],
    outro: isBegin
      ? '🚀 **Start simple:** Canva AI (thumbnails) + Descript (edit video by text) + Grammarly (scripts) = content engine from day 1!'
      : '🔥 **Creator stack:** Runway ML + ElevenLabs + Opus Clip = faceless AI channel or premium production quality.',
  };
}

function r_productivityApp(ctx) {
  const isBegin = ctx.skillLevel === 'beginner';
  const isFree  = ctx.budget === 'low';
  return {
    type: 'stack',
    intro: '⚡ Here\'s your **Productivity App** (task manager, habit tracker, planner) AI stack:',
    sections: [
      {
        label: '💻 Build & Deploy',
        tools: byIds(isBegin ? 49 : 44, 50, isBegin ? 47 : 52).filter(Boolean).slice(0, 3).map(snippet),
        note: isBegin ? 'Bolt.new generates a working task manager UI in minutes' : 'v0.dev for UI components, Cursor for logic',
      },
      {
        label: '🤖 AI Task Intelligence',
        tools: byIds(2, 1, 3).map(snippet),
        note: 'Claude for task prioritisation & summaries, GPT-4 for smart scheduling suggestions',
      },
      {
        label: '⚡ Existing Productivity Tools to Integrate',
        tools: byIds(119, 120, 123).map(snippet),
        note: 'ClickUp AI, Reclaim AI, and Zapier for automation inspiration and integrations',
      },
      {
        label: '🎨 UI & UX Design',
        tools: byIds(95, 98, 96).map(snippet),
        note: 'Clean, focused UI is key for productivity apps — Figma AI for design systems',
      },
    ],
    outro: isFree
      ? '💡 **Free stack:** Bolt.new + Gemini API + Firebase = full habit tracker / task app with no cost!'
      : '🗺️ **Roadmap:** Core task CRUD → AI prioritisation → Calendar sync → Mobile app → Team collaboration.',
  };
}

export function generateResponse(message, context = {}) {
  const msg = normalize(message);
  if (!msg) return r_fallback();

  const it = intent(msg);

  if (it === 'greeting')   return r_greeting(context);
  if (it === 'identity')   return r_identity();
  if (it === 'casual')     return r_casual(msg);
  if (it === 'gratitude')  return r_gratitude();
  if (it === 'capability') return r_capability();

  if (it === 'comparison') {
    const pair = parseComparison(msg);
    return pair ? r_comparison(pair[0], pair[1], msg) : r_fallback();
  }

  if (it === 'project') {
    const pt = projectType(msg);
    if (pt === 'fitness')          return r_fitness(context);
    if (pt === 'study')            return r_study(context);
    if (pt === 'portfolio')        return r_portfolio(context);
    if (pt === 'dashboard')        return r_dashboard(context);
    if (pt === 'ecommerce')        return r_ecommerce();
    if (pt === 'ai_app')           return r_aiApp(context);
    if (pt === 'website')          return r_website(context);
    if (pt === 'social')           return r_social(context);
    if (pt === 'creator')          return r_creator(context);
    if (pt === 'productivity_app') return r_productivityApp(context);
    if (pt === 'blog')             return r_website(context);
    if (pt === 'game') {
      return {
        type: 'category',
        intro: '🎮 Here are the best **AI tools for Game Development**:',
        sections: [{ label: '🎮 Game Dev AI Tools', tools: byIds(44, 43, 1, 16).map(snippet), note: 'Cursor for code, GitHub Copilot for logic, GPT-4 for NPC dialogue, Midjourney for assets' }],
        outro: '🕹️ **Game stack:** Cursor IDE + Unity/Godot + Midjourney (art) + ElevenLabs (voice NPCs) = indie game powerhouse.',
      };
    }
    return r_saas(context);
  }

  if (it === 'category') {
    const cat = detectCategory(msg);
    if (cat) {
      return {
        type: 'category',
        intro: `${cat[2]} Here are the **best AI tools for ${cat[1]}**:`,
        sections: [{ label: `${cat[2]} Top ${cat[1]} Tools`, tools: byCategory(cat[0], 4).map(snippet), note: 'Sorted by rating & popularity' }],
        outro: '💡 Click any tool to visit their website and get started instantly!',
      };
    }
  }

  if (it === 'general') return r_general(msg);

  return r_fallback();
}