import React, { useState, useMemo, useRef, useEffect } from 'react';
import { tools, categories, categoryEmoji } from '../data/tools';
import ToolCard from '../components/ToolCard';
import Chatbot from '../chatbot/Chatbot';


const pricingFilters = ['All Pricing', 'Free', 'Freemium', 'Paid'];
const sortOptions = [
  { key: 'top_rated',     label: '⭐ Top Rated' },
  { key: 'most_popular',  label: '🔥 Most Popular' },
  { key: 'a_z',           label: '🔤 A–Z' },
];

function highlight(name, query) {
  if (!query.trim()) return name;
  const idx = name.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return name;
  return (
    <>
      {name.slice(0, idx)}
      <span style={{ color: '#f1f5f9', fontWeight: 700 }}>{name.slice(idx, idx + query.length)}</span>
      {name.slice(idx + query.length)}
    </>
  );
}

export default function Home() {
  const [search, setSearch]           = useState('');
  const [activeCategory, setCategory] = useState('All');
  const [activePricing, setPricing]   = useState('All Pricing');
  const [sortBy, setSortBy]           = useState('top_rated');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchWrapRef = useRef(null);

  /* suggestions — match name OR category */
  const suggestions = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return tools
      .filter(t => t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q))
      .slice(0, 7);
  }, [search]);

  useEffect(() => {
    const handler = (e) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target))
        setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSuggestionClick = (name) => { setSearch(name); setShowSuggestions(false); };
  const clearAll = () => { setSearch(''); setCategory('All'); setPricing('All Pricing'); setShowSuggestions(false); };

  const isFiltered = search !== '' || activeCategory !== 'All' || activePricing !== 'All Pricing';

  /* derived lists */
  const featured = useMemo(() => tools.filter(t => t.featured), []);
  const top10    = useMemo(() => tools.filter(t => t.top10), []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return tools.filter(t => {
      const matchSearch   = !q || t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
      const matchCategory = activeCategory === 'All' || t.category === activeCategory;
      const matchPricing  = activePricing === 'All Pricing' || t.pricing === activePricing;
      return matchSearch && matchCategory && matchPricing;
    });
  }, [search, activeCategory, activePricing]);

  const sortedFiltered = useMemo(() => {
    const arr = [...filtered];
    if (sortBy === 'top_rated')    return arr.sort((a, b) => b.rating - a.rating);
    if (sortBy === 'most_popular') return arr.sort((a, b) => b.users - a.users);
    if (sortBy === 'a_z')          return arr.sort((a, b) => a.name.localeCompare(b.name));
    return arr;
  }, [filtered, sortBy]);

  return (
    <div style={s.page}>

      {/* ── HERO ──────────────────────────────────────────── */}
      <section style={s.hero}>
        <div style={s.heroPill}>🚀 {tools.length}+ Curated AI Tools</div>
        <h1 style={s.heroTitle}>
          Discover the Best<br />
          <span style={s.heroAccent}>AI Tools of 2025</span>
        </h1>
        <p style={s.heroSub}>
          Browse, filter, and launch the world's most powerful AI tools — all in one place.
        </p>

        {/* search */}
        <div style={s.searchWrap} ref={searchWrapRef}>
          <span style={s.searchIcon}>🔍</span>
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setShowSuggestions(true); }}
            onFocus={() => search.trim() && setShowSuggestions(true)}
            onKeyDown={e => e.key === 'Escape' && setShowSuggestions(false)}
            placeholder="Search tools, categories..."
            style={s.searchInput}
            spellCheck={false}
            autoComplete="off"
          />
          {search && (
            <button style={s.clearX} onClick={() => { setSearch(''); setShowSuggestions(false); }}>✕</button>
          )}
          {showSuggestions && suggestions.length > 0 && (
            <div style={s.dropdown}>
              <div style={s.dropHeader}>
                <span style={s.dropHeaderText}>🔍 Suggestions</span>
                <span style={s.dropCount}>{suggestions.length} found</span>
              </div>
              {suggestions.map(tool => (
                <div
                  key={tool.id}
                  style={s.suggestionItem}
                  onMouseDown={() => handleSuggestionClick(tool.name)}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.12)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <img
                    src={tool.logo}
                    alt=""
                    style={s.suggestionImg}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                  <div style={s.suggestionText}>
                    <span style={s.suggestionName}>{highlight(tool.name, search)}</span>
                    <span style={s.suggestionCategory}>{tool.category}</span>
                  </div>
                  <span style={s.suggestionArrow}>↗</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={s.heroStats}>
          {[
            [tools.length + '+', 'AI Tools'],
            [categories.length - 1 + '', 'Categories'],
            ['100%', 'Free to Browse'],
          ].map(([val, label]) => (
            <div key={label} style={s.stat}>
              <span style={s.statVal}>{val}</span>
              <span style={s.statLabel}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FILTERS ───────────────────────────────────────── */}
      <section style={s.filtersSection}>
        <div style={s.filterBlock}>
          <span style={s.filterLabel}>Category</span>
          <div style={s.filterRow}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{ ...s.filterBtn, ...(activeCategory === cat ? s.filterBtnActive : {}) }}
              >
                {(categoryEmoji && categoryEmoji[cat]) || '🔹'} {cat}
              </button>
            ))}
          </div>
        </div>

        <div style={s.filterBlock}>
          <span style={s.filterLabel}>Pricing</span>
          <div style={s.filterRow}>
            {pricingFilters.map(p => (
              <button
                key={p}
                onClick={() => setPricing(p)}
                style={{ ...s.filterBtn, ...(activePricing === p ? s.filterBtnActive : {}) }}
              >
                {p === 'Free' ? '🟢' : p === 'Freemium' ? '🟡' : p === 'Paid' ? '🔴' : '⚪'} {p}
              </button>
            ))}
          </div>
        </div>

        {isFiltered && (
          <div style={s.activeFiltersRow}>
            <span style={s.resultsCount}>{sortedFiltered.length} result{sortedFiltered.length !== 1 ? 's' : ''}</span>
            <button onClick={clearAll} style={s.clearAllBtn}>✕ Clear all filters</button>
          </div>
        )}
      </section>

      {/* ── FEATURED TOOLS ────────────────────────────────── */}
      {!isFiltered && (
        <section style={s.gridSection}>
          <div style={s.sectionHead}>
            <div>
              <h2 style={s.sectionTitle}>⭐ Featured Tools</h2>
              <p style={s.sectionSub}>Hand-picked by our editors</p>
            </div>
            <span style={s.pill}>{featured.length} tools</span>
          </div>
          <div style={{ ...s.grid, ...s.featuredGrid }}>
            {featured.map(t => <ToolCard key={t.id} tool={t} />)}
          </div>
        </section>
      )}

      {/* ── TOP 10 ────────────────────────────────────────── */}
      {!isFiltered && (
        <section style={s.gridSection}>
          <div style={s.sectionHead}>
            <div>
              <h2 style={s.sectionTitle}>🏆 Top 10 AI Tools</h2>
              <p style={s.sectionSub}>Ranked by rating × popularity</p>
            </div>
            <span style={s.pill}>{top10.length} tools</span>
          </div>
          <div style={s.grid}>
            {top10.map(t => <ToolCard key={t.id} tool={t} />)}
          </div>
        </section>
      )}

      {/* ── ALL TOOLS ─────────────────────────────────────── */}
      <section style={s.gridSection}>
        <div style={s.sectionHead}>
          <div>
            <h2 style={s.sectionTitle}>{isFiltered ? '🔎 Search Results' : '🤖 All AI Tools'}</h2>
            <p style={s.sectionSub}>{sortedFiltered.length} tool{sortedFiltered.length !== 1 ? 's' : ''}</p>
          </div>
          <div style={s.sortRow}>
            {sortOptions.map(opt => (
              <button
                key={opt.key}
                onClick={() => setSortBy(opt.key)}
                style={{ ...s.sortBtn, ...(sortBy === opt.key ? s.sortBtnActive : {}) }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {sortedFiltered.length === 0 ? (
          <div style={s.empty}>
            <span style={s.emptyIcon}>🤖</span>
            <p style={s.emptyTitle}>No tools found</p>
            <p style={s.emptySub}>Try adjusting your search or filters.</p>
            <button onClick={clearAll} style={s.emptyBtn}>Clear filters</button>
          </div>
        ) : (
          <div style={s.grid}>
            {sortedFiltered.map(t => <ToolCard key={t.id} tool={t} />)}
          </div>
        )}
      </section>

      <footer style={s.footer}>
        <p>⚡ <strong>Velox</strong> — AI Tools Discovery · {tools.length}+ Tools · Built with React + Vite</p>
        <p style={s.footerSub}>Click any tool card or "Visit" button to open in a new tab</p>
      </footer>

      {/* ── AI Chatbot floating panel ─────────────────────── */}
      <Chatbot />
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', background: '#05050e', color: '#f1f5f9', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" },

  hero: { textAlign: 'center', padding: '80px 24px 56px', background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(139,47,232,0.20) 0%, transparent 70%)', position: 'relative' },
  heroPill: { display: 'inline-block', background: 'rgba(139,47,232,0.15)', border: '1px solid rgba(139,47,232,0.32)', color: '#c4b5fd', fontSize: '0.78rem', fontWeight: 700, padding: '5px 16px', borderRadius: 99, marginBottom: 24, letterSpacing: '0.3px' },
  heroTitle: { fontSize: 'clamp(2rem, 5vw, 3.4rem)', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-1.5px', margin: '0 0 18px' },
  heroAccent: { background: 'linear-gradient(135deg, #9B40FF, #22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' },
  heroSub: { color: '#94a3b8', fontSize: '1.05rem', maxWidth: 500, margin: '0 auto 36px', lineHeight: 1.7 },

  searchWrap: { position: 'relative', maxWidth: 620, margin: '0 auto 40px', display: 'flex', alignItems: 'center' },
  searchIcon: { position: 'absolute', left: 18, fontSize: '1rem', pointerEvents: 'none', zIndex: 1 },
  searchInput: { width: '100%', padding: '15px 52px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, color: '#f1f5f9', fontSize: '0.97rem', fontFamily: "'Inter', sans-serif", outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s', boxSizing: 'border-box' },
  clearX: { position: 'absolute', right: 16, width: 26, height: 26, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" },

  dropdown: { position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, background: '#0a0a16', border: '1px solid rgba(139,47,232,0.35)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 16px 48px rgba(0,0,0,0.7)', zIndex: 999 },
  dropHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px 8px', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  dropHeaderText: { fontSize: '0.72rem', color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' },
  dropCount: { fontSize: '0.7rem', color: '#9B40FF', fontWeight: 700 },
  suggestionItem: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', cursor: 'pointer', transition: 'background 0.15s', background: 'transparent' },
  suggestionImg: { width: 28, height: 28, borderRadius: 6, objectFit: 'contain', background: '#fff', padding: 2, flexShrink: 0 },
  suggestionText: { flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 },
  suggestionName: { fontSize: '0.88rem', color: '#94a3b8', fontWeight: 500 },
  suggestionCategory: { fontSize: '0.7rem', color: '#334155', fontWeight: 500 },
  suggestionArrow: { fontSize: '0.75rem', color: '#7c3aed', opacity: 0.6 },

  heroStats: { display: 'flex', gap: 40, justifyContent: 'center', flexWrap: 'wrap' },
  stat: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 },
  statVal: { fontSize: '1.5rem', fontWeight: 800, background: 'linear-gradient(135deg, #9B40FF, #22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' },
  statLabel: { fontSize: '0.75rem', color: '#475569', fontWeight: 500 },

  filtersSection: { maxWidth: 1240, margin: '0 auto', padding: '8px 32px 16px', display: 'flex', flexDirection: 'column', gap: 12 },
  filterBlock: { display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  filterLabel: { fontSize: '0.73rem', color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', minWidth: 56 },
  filterRow: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  filterBtn: { padding: '7px 16px', borderRadius: 99, border: '1px solid rgba(255,255,255,0.09)', background: 'rgba(255,255,255,0.04)', color: '#94a3b8', fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer', fontFamily: "'Inter', sans-serif", transition: 'all 0.18s', whiteSpace: 'nowrap' },
  filterBtnActive: { background: 'linear-gradient(135deg, #8B2FE8, #22D3EE)', border: '1px solid transparent', color: '#fff', fontWeight: 700 },
  activeFiltersRow: { display: 'flex', alignItems: 'center', gap: 12, paddingTop: 4 },
  resultsCount: { fontSize: '0.82rem', color: '#64748b', fontWeight: 600 },
  clearAllBtn: { background: 'none', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5', fontSize: '0.78rem', fontWeight: 600, padding: '4px 12px', borderRadius: 99, cursor: 'pointer', fontFamily: "'Inter', sans-serif" },

  gridSection: { maxWidth: 1240, margin: '0 auto', padding: '12px 32px 48px' },
  sectionHead: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22, gap: 12, flexWrap: 'wrap' },
  sectionTitle: { fontSize: '1.35rem', fontWeight: 700, margin: '0 0 4px', letterSpacing: '-0.3px' },
  sectionSub: { fontSize: '0.78rem', color: '#475569', margin: 0, fontWeight: 500 },
  pill: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#64748b', fontSize: '0.75rem', padding: '3px 12px', borderRadius: 99 },

  sortRow: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  sortBtn: { padding: '6px 14px', borderRadius: 99, border: '1px solid rgba(255,255,255,0.09)', background: 'rgba(255,255,255,0.04)', color: '#64748b', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif", transition: 'all 0.18s', whiteSpace: 'nowrap' },
  sortBtnActive: { background: 'rgba(139,47,232,0.15)', border: '1px solid rgba(139,47,232,0.38)', color: '#c4b5fd' },

  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(295px, 1fr))', gap: 18 },
  featuredGrid: { gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' },

  empty: { textAlign: 'center', padding: '80px 24px' },
  emptyIcon: { fontSize: '3.5rem', display: 'block', marginBottom: 16 },
  emptyTitle: { fontSize: '1.1rem', fontWeight: 600, color: '#94a3b8', margin: '0 0 8px' },
  emptySub: { fontSize: '0.875rem', color: '#475569', margin: '0 0 20px' },
  emptyBtn: { padding: '10px 24px', borderRadius: 10, background: 'linear-gradient(135deg, #8B2FE8, #22D3EE)', border: 'none', color: '#fff', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif" },

  footer: { textAlign: 'center', padding: '36px 24px', borderTop: '1px solid rgba(255,255,255,0.05)', color: '#334155', fontSize: '0.82rem', lineHeight: 1.8 },
  footerSub: { color: '#1e293b', fontSize: '0.75rem', margin: 0 },
};
