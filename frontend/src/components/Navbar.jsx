import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChatbot } from '../context/ChatbotContext';
import logo from '../assets/logo.png';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { isOpen: chatOpen, toggle: toggleChat } = useChatbot();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropOpen, setDropOpen] = useState(false);

  const isAuth =
    location.pathname === '/login' || location.pathname === '/register';

  const handleLogout = () => {
    setDropOpen(false);
    logout();
    navigate('/');
  };

  return (
    <nav style={s.nav}>

      {/* ── Brand ── */}
      <Link to="/" style={s.brand}>

        {/* CIRCLE LOGO — wrapper clips the image */}
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          overflow: 'hidden',
          flexShrink: 0,
        }}>
          <img
            src={logo}
            alt="Velox"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>

        <span style={s.brandText}>Velox</span>
      </Link>

      {!isAuth && <span style={s.tagline}>Discover the best AI tools</span>}

      <div style={s.right}>
        {/* AI Assistant toggle */}
        {!isAuth && (
          <button
            className={`velox-nav-ai-btn${chatOpen ? ' velox-nav-ai-active' : ''}`}
            onClick={toggleChat}
            aria-label="Toggle AI Assistant"
          >
            <span className="velox-nav-ai-dot" />
            ✦ AI Assistant
          </button>
        )}
        {isAuth ? (
          <Link to="/" style={s.ghostBtn}>← Back</Link>

        ) : user ? (
          <div style={{ position: 'relative' }}>
            <button style={s.avatarBtn} onClick={() => setDropOpen((v) => !v)}>
              <div style={s.avatarCircle}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span style={s.avatarName}>{user.name.split(' ')[0]}</span>
              <span style={{ color: '#64748b', fontSize: '0.7rem' }}>▾</span>
            </button>

            {dropOpen && (
              <div style={s.dropdown}>
                <div style={s.dropHeader}>
                  <div style={s.dropName}>{user.name}</div>
                  <div style={s.dropEmail}>{user.email}</div>
                </div>
                <div style={s.dropDivider} />
                <button style={s.logoutBtn} onClick={handleLogout}>
                  🚪 Sign out
                </button>
              </div>
            )}
          </div>

        ) : (
          <>
            <span style={s.count}>126+ Tools</span>
            <Link to="/login"    style={s.ghostBtn}>Login</Link>
            <Link to="/register" style={s.solidBtn}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const s = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 48px',
    height: 66,
    background: 'rgba(5,5,14,0.92)',
    backdropFilter: 'blur(28px)',
    WebkitBackdropFilter: 'blur(28px)',
    borderBottom: '1px solid rgba(139,47,232,0.18)',
    boxShadow: '0 1px 0 rgba(34,211,238,0.05)',
    fontFamily: "'Inter', sans-serif",
  },

  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    textDecoration: 'none',
  },

  brandText: {
    fontSize: '1.45rem',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #9B40FF, #22D3EE)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '-0.5px',
  },

  tagline: {
    fontSize: '0.8rem',
    color: '#475569',
    fontWeight: 500,
  },

  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },

  count: {
    fontSize: '0.78rem',
    color: '#64748b',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    padding: '4px 12px',
    borderRadius: 99,
  },

  ghostBtn: {
    fontSize: '0.85rem',
    color: '#94a3b8',
    textDecoration: 'none',
    fontWeight: 500,
    padding: '7px 16px',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.04)',
  },

  solidBtn: {
    fontSize: '0.85rem',
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 600,
    padding: '7px 16px',
    borderRadius: 8,
    background: 'linear-gradient(135deg, #8B2FE8, #22D3EE)',
    boxShadow: '0 2px 14px rgba(139,47,232,0.4)',
  },

  avatarBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 99,
    padding: '5px 12px 5px 5px',
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
  },

  avatarCircle: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #8B2FE8, #22D3EE)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.85rem',
    fontWeight: 800,
    color: '#fff',
  },

  avatarName: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#f1f5f9',
  },

  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 10px)',
    right: 0,
    minWidth: 200,
    background: '#0a0a16',
    border: '1px solid rgba(139,47,232,0.2)',
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 16px 48px rgba(0,0,0,0.7)',
    zIndex: 999,
  },

  dropHeader: { padding: '14px 16px', background: 'rgba(255,255,255,0.03)' },
  dropName:   { fontSize: '0.9rem', fontWeight: 700, color: '#f1f5f9', marginBottom: 2 },
  dropEmail:  { fontSize: '0.75rem', color: '#64748b' },
  dropDivider: { height: 1, background: 'rgba(255,255,255,0.07)' },

  logoutBtn: {
    width: '100%',
    padding: '12px 16px',
    background: 'none',
    border: 'none',
    color: '#fca5a5',
    fontSize: '0.85rem',
    fontWeight: 500,
    cursor: 'pointer',
    textAlign: 'left',
    fontFamily: "'Inter', sans-serif",
  },
};