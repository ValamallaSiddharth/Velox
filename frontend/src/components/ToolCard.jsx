import React, { useState } from 'react';
import { getLogoFallback } from '../data/tools';

/* ── helpers ───────────────────────────────────────────── */
function formatUsers(n) {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B+';
  if (n >= 1_000_000)     return (n / 1_000_000).toFixed(1).replace(/\.0$/, '')     + 'M+';
  if (n >= 1_000)         return (n / 1_000).toFixed(0)                              + 'K+';
  return String(n);
}

/* ── badge palettes ────────────────────────────────────── */
const pricingColors = {
  Free:     { bg: 'rgba(16,185,129,0.15)',  border: 'rgba(16,185,129,0.4)',  color: '#6ee7b7' },
  Freemium: { bg: 'rgba(251,191,36,0.15)',  border: 'rgba(251,191,36,0.4)',  color: '#fde047' },
  Paid:     { bg: 'rgba(239,68,68,0.15)',   border: 'rgba(239,68,68,0.4)',   color: '#fca5a5' },
};

const categoryColors = {
  'Chatbot':         { bg: 'rgba(124,58,237,0.15)',  border: 'rgba(124,58,237,0.4)',  color: '#c4b5fd' },
  'PPT':             { bg: 'rgba(249,115,22,0.15)',  border: 'rgba(249,115,22,0.4)',  color: '#fdba74' },
  'Image Generator': { bg: 'rgba(236,72,153,0.15)',  border: 'rgba(236,72,153,0.4)',  color: '#f9a8d4' },
  'Video':           { bg: 'rgba(6,182,212,0.15)',   border: 'rgba(6,182,212,0.4)',   color: '#67e8f9' },
  'Coding':          { bg: 'rgba(16,185,129,0.15)',  border: 'rgba(16,185,129,0.4)',  color: '#6ee7b7' },
  'Writing':         { bg: 'rgba(234,179,8,0.15)',   border: 'rgba(234,179,8,0.4)',   color: '#fde047' },
  'Marketing':       { bg: 'rgba(239,68,68,0.15)',   border: 'rgba(239,68,68,0.4)',   color: '#fca5a5' },
  'Audio':           { bg: 'rgba(168,85,247,0.15)',  border: 'rgba(168,85,247,0.4)',  color: '#d8b4fe' },
  'Research':        { bg: 'rgba(14,165,233,0.15)',  border: 'rgba(14,165,233,0.4)',  color: '#7dd3fc' },
  'Productivity':    { bg: 'rgba(20,184,166,0.15)',  border: 'rgba(20,184,166,0.4)',  color: '#5eead4' },
  'Design':          { bg: 'rgba(244,63,94,0.15)',   border: 'rgba(244,63,94,0.4)',   color: '#fda4af' },
  'SEO':             { bg: 'rgba(132,204,22,0.15)',  border: 'rgba(132,204,22,0.4)',  color: '#bef264' },
};

const gradients = [
  'linear-gradient(135deg,#8B2FE8,#22D3EE)',
  'linear-gradient(135deg,#6D28D9,#8B2FE8)',
  'linear-gradient(135deg,#22D3EE,#059669)',
  'linear-gradient(135deg,#8B2FE8,#ec4899)',
  'linear-gradient(135deg,#0ea5e9,#8B2FE8)',
  'linear-gradient(135deg,#9B40FF,#06b6d4)',
];

/* ── global CSS injected once ──────────────────────────── */
const STYLE_ID = 'velox-toolcard-styles';
if (!document.getElementById(STYLE_ID)) {
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .velox-card {
      background: rgba(255,255,255,0.04);
      border: 1px solid transparent;
      border-radius: 18px;
      padding: 22px 22px 18px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease, background 0.22s ease;
      user-select: none;
      outline: 1px solid rgba(255,255,255,0.07);
    }
    .velox-card:hover {
      transform: translateY(-6px);
      border-color: rgba(139,47,232,0.55);
      outline-color: transparent;
      background: rgba(255,255,255,0.065);
      box-shadow: 0 20px 56px rgba(0,0,0,0.65), 0 0 0 1px rgba(139,47,232,0.15), 0 0 24px rgba(34,211,238,0.06);
    }
    .velox-visit-btn {
      width: 100%;
      padding: 10px 0;
      border-radius: 10px;
      background: linear-gradient(135deg, #8B2FE8, #22D3EE);
      border: none;
      color: #fff;
      font-size: 0.875rem;
      font-weight: 700;
      cursor: pointer;
      font-family: 'Inter', sans-serif;
      letter-spacing: 0.2px;
      transition: opacity 0.18s, transform 0.15s;
      margin-top: 4px;
    }
    .velox-visit-btn:hover {
      opacity: 0.88;
      transform: scale(1.015);
    }
    /* outer circle container — handles clipping */
    .velox-logo-circle {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;
      border: 2px solid rgba(139,47,232,0.3);
      box-sizing: border-box;
      background: #111;
      transition: border-color 0.22s ease;
    }
    .velox-card:hover .velox-logo-circle {
      border-color: rgba(34,211,238,0.6);
    }
    /* inner img fills the circle */
    .velox-logo-circle img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .velox-letter-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      font-weight: 800;
      color: #fff;
      font-family: 'Inter', sans-serif;
      flex-shrink: 0;
      border: 2px solid rgba(139,47,232,0.3);
      box-sizing: border-box;
    }
  `;
  document.head.appendChild(style);
}

/* ── Saved tools helpers ────────────────────────────────── */
const SAVED_KEY = 'velox_saved_tools';
function getSaved() {
  try { return JSON.parse(localStorage.getItem(SAVED_KEY) || '[]'); }
  catch { return []; }
}

/* ── component ─────────────────────────────────────────── */
export default function ToolCard({ tool }) {
  // 0 = try primary (Google S2), 1 = try fallback (DuckDuckGo), 2 = letter avatar
  const [logoAttempt, setLogoAttempt] = useState(0);
  const [saved, setSaved] = useState(() => getSaved().includes(tool.id));

  const toggleSave = (e) => {
    e.stopPropagation();
    setSaved((prev) => {
      const next = !prev;
      const list = getSaved().filter((id) => id !== tool.id);
      if (next) list.push(tool.id);
      localStorage.setItem(SAVED_KEY, JSON.stringify(list));
      return next;
    });
  };

  const handleLogoError = (e) => {
    if (logoAttempt === 0) {
      e.target.src = getLogoFallback(tool.url);
      setLogoAttempt(1);
    } else {
      setLogoAttempt(2);
    }
  };

  const pc       = pricingColors[tool.pricing] || pricingColors.Free;
  const cc       = categoryColors[tool.category] || { bg: 'rgba(255,255,255,0.08)', border: 'rgba(255,255,255,0.15)', color: '#94a3b8' };
  const gradient = gradients[tool.id % gradients.length];

  const handleVisit = (e) => {
    e.stopPropagation();
    window.open(tool.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="velox-card" onClick={handleVisit}>

      {/* ── Save/Favorite button ── */}
      <button
        className={`velox-fav-btn${saved ? ' velox-fav-active' : ''}`}
        onClick={toggleSave}
        aria-label={saved ? 'Remove from saved' : 'Save tool'}
        title={saved ? 'Saved!' : 'Save tool'}
      >
        {saved ? '♥' : '♡'}
      </button>

      {/* badges — top-right */}
      <div style={{ position: 'absolute', top: 13, right: 13, display: 'flex', gap: 6 }}>
        {tool.featured && <span style={s.featuredBadge}>⭐ Featured</span>}
        {tool.top10    && <span style={s.top10Badge}>🏆 Top 10</span>}
      </div>

      {/* header: logo + name + badges + rating */}
      <div style={s.cardHead}>

        {/* logo */}
        {logoAttempt >= 2 || !tool.logo ? (
          <div className="velox-letter-avatar" style={{ background: gradient }}>
            {tool.name.charAt(0).toUpperCase()}
          </div>
        ) : (
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            overflow: 'hidden',
            flexShrink: 0,
            border: '2px solid rgba(139,47,232,0.3)',
            boxSizing: 'border-box',
            background: '#111',
          }}>
            <img
              src={tool.logo}
              alt={`${tool.name} logo`}
              onError={handleLogoError}
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
        )}

        {/* name + category + pricing */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={s.name}>{tool.name}</h3>
          <div style={s.badges}>
            <span style={{ ...s.badge, background: cc.bg, border: `1px solid ${cc.border}`, color: cc.color }}>
              {tool.category}
            </span>
            <span style={{ ...s.badge, background: pc.bg, border: `1px solid ${pc.border}`, color: pc.color }}>
              {tool.pricing}
            </span>
          </div>
        </div>

        {/* rating + users */}
        <div style={s.ratingBox}>
          <div style={s.rating}>⭐ {tool.rating}</div>
          {tool.users && <div style={s.users}>👥 {formatUsers(tool.users)}</div>}
        </div>
      </div>

      {/* description */}
      <p style={s.desc}>{tool.description}</p>

      {/* visit button */}
      <button className="velox-visit-btn" onClick={handleVisit}>
        Visit {tool.name} ↗
      </button>
    </div>
  );
}

/* ── static styles ──────────────────────────────────────── */
const s = {
  featuredBadge: {
    background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.4)', color: '#a5b4fc',
    fontSize: '0.62rem', fontWeight: 700, padding: '2px 9px', borderRadius: 99, letterSpacing: '0.3px', whiteSpace: 'nowrap',
  },
  top10Badge: {
    background: 'rgba(251,191,36,0.14)', border: '1px solid rgba(251,191,36,0.32)', color: '#fbbf24',
    fontSize: '0.62rem', fontWeight: 700, padding: '2px 9px', borderRadius: 99, letterSpacing: '0.3px', whiteSpace: 'nowrap',
  },
  cardHead: { display: 'flex', alignItems: 'flex-start', gap: 13, marginTop: 4 },
  name: {
    fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', margin: '0 0 7px',
    letterSpacing: '-0.2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: 4,
  },
  badges: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  badge: {
    display: 'inline-block', fontSize: '0.62rem', fontWeight: 700,
    padding: '2px 9px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: '0.4px',
  },
  ratingBox: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flexShrink: 0, marginTop: 4 },
  rating: { fontSize: '0.78rem', color: '#fbbf24', fontWeight: 700, whiteSpace: 'nowrap' },
  users:  { fontSize: '0.68rem', color: '#475569', fontWeight: 600, whiteSpace: 'nowrap' },
  desc: {
    fontSize: '0.845rem', color: '#94a3b8', lineHeight: 1.65, margin: 0, flexGrow: 1,
    display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
  },
};
