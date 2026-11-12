import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { tools, getLogoFallback } from '../data/tools';

const categoryColors = {
  'Chatbot':         { bg: 'rgba(124,58,237,0.15)',  border: 'rgba(124,58,237,0.35)',  color: '#c4b5fd' },
  'PPT':             { bg: 'rgba(249,115,22,0.15)',  border: 'rgba(249,115,22,0.35)',  color: '#fdba74' },
  'Image Generator': { bg: 'rgba(236,72,153,0.15)',  border: 'rgba(236,72,153,0.35)',  color: '#f9a8d4' },
  'Video':           { bg: 'rgba(6,182,212,0.15)',   border: 'rgba(6,182,212,0.35)',   color: '#67e8f9' },
  'Coding':          { bg: 'rgba(16,185,129,0.15)',  border: 'rgba(16,185,129,0.35)',  color: '#6ee7b7' },
  'Writing':         { bg: 'rgba(234,179,8,0.15)',   border: 'rgba(234,179,8,0.35)',   color: '#fde047' },
  'Marketing':       { bg: 'rgba(239,68,68,0.15)',   border: 'rgba(239,68,68,0.35)',   color: '#fca5a5' },
  'Audio':           { bg: 'rgba(168,85,247,0.15)',  border: 'rgba(168,85,247,0.35)',  color: '#d8b4fe' },
  'Research':        { bg: 'rgba(14,165,233,0.15)',  border: 'rgba(14,165,233,0.35)',  color: '#7dd3fc' },
  'SEO':             { bg: 'rgba(132,204,22,0.15)',  border: 'rgba(132,204,22,0.35)',  color: '#bef264' },
  'Design':          { bg: 'rgba(244,63,94,0.15)',   border: 'rgba(244,63,94,0.35)',   color: '#fda4af' },
  'Productivity':    { bg: 'rgba(20,184,166,0.15)',  border: 'rgba(20,184,166,0.35)',  color: '#5eead4' },
};

const gradients = [
  'linear-gradient(135deg,#7c3aed,#06b6d4)',
  'linear-gradient(135deg,#db2777,#7c3aed)',
  'linear-gradient(135deg,#059669,#06b6d4)',
  'linear-gradient(135deg,#d97706,#ef4444)',
  'linear-gradient(135deg,#7c3aed,#ec4899)',
  'linear-gradient(135deg,#0ea5e9,#10b981)',
];

/** Small logo image with two-level fallback → letter avatar */
function ToolLogo({ tool, size = 64, borderRadius = 14, fontSize = '1.8rem' }) {
  const [attempt, setAttempt] = useState(0);
  const gradient = gradients[tool.id % gradients.length];

  const handleError = (e) => {
    if (attempt === 0) {
      e.target.src = getLogoFallback(tool.url);
      setAttempt(1);
    } else {
      setAttempt(2);
    }
  };

  if (attempt >= 2 || !tool.logo) {
    return (
      <div style={{
        width: size,
        height: size,
        borderRadius: '50%',                          /* perfect circle */
        background: 'linear-gradient(135deg, #8B2FE8, #22D3EE)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize, fontWeight: 800, color: '#fff', flexShrink: 0,
        border: '2px solid rgba(139,47,232,0.4)',
        boxSizing: 'border-box',
      }}>
        {tool.name.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={tool.logo}
      alt={`${tool.name} logo`}
      onError={handleError}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',                          /* perfect circle */
        objectFit: 'cover',                           /* fill circle, no stretch */
        overflow: 'hidden',
        display: 'block',
        flexShrink: 0,
        background: '#111',
        border: '2px solid rgba(139,47,232,0.35)',
        boxSizing: 'border-box',
      }}
    />
  );
}

export default function ToolDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const tool = tools.find((t) => t.id === parseInt(id));

  if (!tool) {
    return (
      <div style={styles.page}>
        <div style={styles.notFound}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>🤖</div>
          <h2 style={{ color: '#f1f5f9', marginBottom: 8 }}>Tool Not Found</h2>
          <p style={{ color: '#94a3b8', marginBottom: 24 }}>
            The tool you're looking for doesn't exist.
          </p>
          <Link to="/" style={styles.btnBack}>← Back to Home</Link>
        </div>
      </div>
    );
  }

  const catStyle = categoryColors[tool.category] || { bg: 'rgba(255,255,255,0.08)', border: 'rgba(255,255,255,0.15)', color: '#94a3b8' };

  const related = tools
    .filter((t) => t.category === tool.category && t.id !== tool.id)
    .slice(0, 3);

  const formatUsers = (n) => {
    if (!n) return 'N/A';
    if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B+';
    if (n >= 1_000_000)     return (n / 1_000_000).toFixed(1).replace(/\.0$/, '')     + 'M+';
    if (n >= 1_000)         return (n / 1_000).toFixed(0)                              + 'K+';
    return String(n);
  };

  return (
    <div style={styles.page}>

      <div style={styles.backRow}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          ← Back
        </button>
      </div>

      <div style={styles.card}>

        <div style={styles.cardTop}>
          <ToolLogo tool={tool} size={64} borderRadius={14} fontSize="1.8rem" />

          <div style={{ flex: 1 }}>
            <div style={styles.topRow}>
              <h1 style={styles.toolName}>{tool.name}</h1>
              {tool.top10 && (
                <span style={styles.top10Badge}>🏆 Top 10</span>
              )}
              {tool.featured && (
                <span style={styles.featuredBadge}>⭐ Featured</span>
              )}
            </div>
            <span style={{
              ...styles.catBadge,
              background: catStyle.bg,
              border: `1px solid ${catStyle.border}`,
              color: catStyle.color,
            }}>
              {tool.category}
            </span>
          </div>

          <div style={styles.rating}>⭐ {tool.rating} / 5</div>
        </div>

        <p style={styles.description}>{tool.description}</p>

        <div style={styles.divider} />

        <div style={styles.infoGrid}>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Category</span>
            <span style={styles.infoValue}>{tool.category}</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Pricing</span>
            <span style={styles.infoValue}>{tool.pricing}</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Rating</span>
            <span style={styles.infoValue}>⭐ {tool.rating} / 5.0</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Users</span>
            <span style={styles.infoValue}>👥 {formatUsers(tool.users)}</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>In Top 10</span>
            <span style={styles.infoValue}>{tool.top10 ? '✅ Yes' : '❌ No'}</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Website</span>
            <a href={tool.url} target="_blank" rel="noopener noreferrer" style={styles.infoLink}>
              {new URL(tool.url).hostname} ↗
            </a>
          </div>
        </div>

        <div style={styles.divider} />

        <a href={tool.url} target="_blank" rel="noopener noreferrer" style={styles.visitBtn}>
          Visit {tool.name} ↗
        </a>
      </div>

      {related.length > 0 && (
        <div style={styles.related}>
          <h2 style={styles.relatedTitle}>Similar {tool.category} Tools</h2>
          <div style={styles.relatedGrid}>
            {related.map((t) => (
              <Link key={t.id} to={`/tool/${t.id}`} style={styles.relatedCard}>
                <ToolLogo tool={t} size={40} borderRadius={8} fontSize="1rem" />
                <div>
                  <div style={styles.relatedName}>{t.name}</div>
                  <div style={styles.relatedDesc}>{t.description.slice(0, 70)}…</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#05050e',
    color: '#f1f5f9',
    fontFamily: "'Inter', -apple-system, sans-serif",
    padding: '32px 24px 64px',
  },
  notFound: {
    textAlign: 'center',
    paddingTop: 120,
  },
  backRow: {
    maxWidth: 840,
    margin: '0 auto 20px',
  },
  backBtn: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#94a3b8',
    padding: '8px 18px',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontFamily: "'Inter', sans-serif",
    transition: 'all 0.2s',
  },
  card: {
    maxWidth: 840,
    margin: '0 auto',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(139,47,232,0.18)',
    borderRadius: 20,
    padding: '36px 40px',
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    boxShadow: '0 0 40px rgba(139,47,232,0.06)',
  },
  cardTop: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 18,
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  toolName: {
    fontSize: '1.8rem',
    fontWeight: 800,
    margin: 0,
    letterSpacing: '-0.5px',
  },
  top10Badge: {
    background: 'rgba(251,191,36,0.15)',
    border: '1px solid rgba(251,191,36,0.3)',
    color: '#fbbf24',
    fontSize: '0.72rem',
    fontWeight: 700,
    padding: '3px 10px',
    borderRadius: 99,
    whiteSpace: 'nowrap',
  },
  featuredBadge: {
    background: 'rgba(99,102,241,0.15)',
    border: '1px solid rgba(99,102,241,0.4)',
    color: '#a5b4fc',
    fontSize: '0.72rem',
    fontWeight: 700,
    padding: '3px 10px',
    borderRadius: 99,
    whiteSpace: 'nowrap',
  },
  catBadge: {
    display: 'inline-block',
    fontSize: '0.75rem',
    fontWeight: 700,
    padding: '4px 12px',
    borderRadius: 99,
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
  },
  rating: {
    fontSize: '1rem',
    color: '#fbbf24',
    fontWeight: 700,
    whiteSpace: 'nowrap',
  },
  description: {
    color: '#94a3b8',
    fontSize: '0.97rem',
    lineHeight: 1.75,
    margin: 0,
  },
  divider: {
    borderTop: '1px solid rgba(255,255,255,0.07)',
    margin: '4px 0',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: 16,
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  infoLabel: {
    fontSize: '0.72rem',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: 600,
  },
  infoValue: {
    fontSize: '0.9rem',
    color: '#f1f5f9',
    fontWeight: 500,
  },
  infoLink: { fontSize: '0.9rem', color: '#22D3EE', fontWeight: 500, textDecoration: 'none' },
  visitBtn: {
    display: 'block', textAlign: 'center', padding: '14px 0', borderRadius: 10,
    background: 'linear-gradient(135deg, #8B2FE8, #22D3EE)',
    color: '#fff', fontSize: '0.95rem', fontWeight: 700, textDecoration: 'none',
    letterSpacing: '0.2px',
    boxShadow: '0 4px 24px rgba(139,47,232,0.4), 0 0 16px rgba(34,211,238,0.15)',
    transition: 'opacity 0.2s, box-shadow 0.2s',
  },
  btnBack: {
    display: 'inline-block',
    color: '#94a3b8',
    textDecoration: 'none',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    padding: '8px 18px',
    borderRadius: 8,
    fontSize: '0.85rem',
    fontWeight: 500,
  },
  related: {
    maxWidth: 840,
    margin: '40px auto 0',
  },
  relatedTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    marginBottom: 16,
    color: '#94a3b8',
  },
  relatedGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  relatedCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '16px 20px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 12,
    textDecoration: 'none',
    transition: 'border-color 0.2s',
  },
  relatedName: {
    fontSize: '0.9rem',
    fontWeight: 700,
    color: '#f1f5f9',
    marginBottom: 3,
  },
  relatedDesc: {
    fontSize: '0.78rem',
    color: '#64748b',
    lineHeight: 1.5,
  },
};
