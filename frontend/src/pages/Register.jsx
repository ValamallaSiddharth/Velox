import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]         = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [gLoading, setGLoading] = useState(false);

  const handleChange = (e) => {
    setError('');
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  /* ── Email / password register ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.name.trim().length < 2)  { setError('Name must be at least 2 characters.'); return; }
    if (!form.email.includes('@'))     { setError('Enter a valid email.'); return; }
    if (form.password.length < 6)     { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    const result = await register(form.name.trim(), form.email, form.password);
    setLoading(false);
    if (result.ok) navigate('/');
    else setError(result.error);
  };

  /* ── Google sign-up ── */
  const handleGoogle = async () => {
    setError('');
    setGLoading(true);
    const result = await loginWithGoogle();
    setGLoading(false);
    if (result.ok) navigate('/');
    else if (result.error) setError(result.error);
  };

  const strength =
    form.password.length === 0 ? null :
    form.password.length < 6  ? 'weak' :
    form.password.length < 10 ? 'medium' : 'strong';

  const strengthColor = { weak: '#ef4444', medium: '#f59e0b', strong: '#10b981' };
  const strengthWidth = { weak: '33%', medium: '66%', strong: '100%' };

  return (
    <div style={s.page}>
      <div style={s.card}>

        <div style={s.brand}>⚡ Velox</div>
        <h1 style={s.title}>Create account</h1>
        <p style={s.sub}>Start discovering AI tools today</p>

        {error && <div style={s.errorBox}>⚠️ {error}</div>}

        {/* ── Google button ── */}
        <button style={s.googleBtn} onClick={handleGoogle} disabled={gLoading} type="button">
          {gLoading ? <span style={s.googleSpinner} /> : <GoogleIcon />}
          {gLoading ? 'Connecting…' : 'Continue with Google'}
        </button>

        {/* ── Divider ── */}
        <div style={s.divider}>
          <div style={s.dividerLine} />
          <span style={s.dividerText}>or sign up with email</span>
          <div style={s.dividerLine} />
        </div>

        {/* ── Email form ── */}
        <form onSubmit={handleSubmit} style={s.form}>

          <div style={s.field}>
            <label style={s.label} htmlFor="name">Full name</label>
            <input
              id="name" name="name" type="text" required placeholder="Alex Johnson"
              value={form.name} onChange={handleChange} style={s.input}
              onFocus={(e) => (e.target.style.borderColor = 'rgba(34,211,238,0.6)')}
              onBlur={(e)  => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
            />
          </div>

          <div style={s.field}>
            <label style={s.label} htmlFor="email">Email address</label>
            <input
              id="email" name="email" type="email" required placeholder="you@example.com"
              value={form.email} onChange={handleChange} style={s.input}
              onFocus={(e) => (e.target.style.borderColor = 'rgba(34,211,238,0.6)')}
              onBlur={(e)  => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
            />
          </div>

          <div style={s.field}>
            <label style={s.label} htmlFor="password">Password</label>
            <div style={s.passWrap}>
              <input
                id="password" name="password"
                type={showPass ? 'text' : 'password'} required placeholder="Min. 6 characters"
                value={form.password} onChange={handleChange}
                style={{ ...s.input, paddingRight: 48 }}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(34,211,238,0.6)')}
                onBlur={(e)  => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
              <button type="button" style={s.eyeBtn}
                onClick={() => setShowPass((v) => !v)} tabIndex={-1}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
            {strength && (
              <div style={s.strengthWrap}>
                <div style={s.strengthTrack}>
                  <div style={{ ...s.strengthBar, width: strengthWidth[strength], background: strengthColor[strength] }} />
                </div>
                <span style={{ ...s.strengthLabel, color: strengthColor[strength] }}>
                  {strength.charAt(0).toUpperCase() + strength.slice(1)}
                </span>
              </div>
            )}
          </div>

          <button type="submit"
            style={{ ...s.submitBtn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
            {loading ? 'Creating account…' : 'Create account →'}
          </button>

        </form>

        <p style={s.switchText}>
          Already have an account?{' '}
          <Link to="/login" style={s.link}>Sign in</Link>
        </p>

      </div>
    </div>
  );
}

/* ── Google coloured icon ── */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" style={{ display:'block', flexShrink:0 }}>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      <path fill="none" d="M0 0h48v48H0z"/>
    </svg>
  );
}

const s = {
  page: {
    minHeight: '100vh', background: '#05050e',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '24px', fontFamily: "'Inter', sans-serif",
    backgroundImage:
      'radial-gradient(ellipse 70% 40% at 20% 0%, rgba(139,47,232,0.13) 0%, transparent 65%),' +
      'radial-gradient(ellipse 55% 35% at 80% 5%, rgba(34,211,238,0.08) 0%, transparent 60%)',
  },
  card: {
    width: '100%', maxWidth: 420,
    background: 'rgba(255,255,255,0.035)',
    border: '1px solid rgba(139,47,232,0.22)',
    borderRadius: 20, padding: '40px 36px',
    display: 'flex', flexDirection: 'column', gap: 14,
    boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 40px rgba(139,47,232,0.08)',
  },
  brand: {
    fontSize: '1.3rem', fontWeight: 800,
    background: 'linear-gradient(135deg, #9B40FF, #22D3EE)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
  },
  title: { fontSize: '1.6rem', fontWeight: 800, color: '#f1f5f9', margin: 0, letterSpacing: '-0.5px' },
  sub:   { color: '#64748b', fontSize: '0.88rem', margin: 0 },
  errorBox: {
    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
    color: '#fca5a5', fontSize: '0.84rem', padding: '10px 14px', borderRadius: 10,
  },
  googleBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    width: '100%', padding: '11px 0',
    background: '#fff', border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 10, color: '#1f2937', fontSize: '0.92rem', fontWeight: 600,
    cursor: 'pointer', fontFamily: "'Inter', sans-serif",
    boxShadow: '0 1px 4px rgba(0,0,0,0.3)', transition: 'background 0.18s',
  },
  googleSpinner: {
    width: 18, height: 18, borderRadius: '50%',
    border: '2px solid #e5e7eb', borderTopColor: '#4285F4',
    display: 'inline-block',
  },
  divider:     { display: 'flex', alignItems: 'center', gap: 10 },
  dividerLine: { flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' },
  dividerText: { fontSize: '0.75rem', color: '#475569', whiteSpace: 'nowrap', fontWeight: 500 },
  form:     { display: 'flex', flexDirection: 'column', gap: 16 },
  field:    { display: 'flex', flexDirection: 'column', gap: 7 },
  label:    { fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: {
    width: '100%', padding: '12px 16px',
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10, color: '#f1f5f9', fontSize: '0.93rem',
    fontFamily: "'Inter', sans-serif", outline: 'none',
    transition: 'border-color 0.2s', boxSizing: 'border-box',
  },
  passWrap:      { position: 'relative', display: 'flex', alignItems: 'center' },
  eyeBtn:        { position: 'absolute', right: 12, background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', padding: 0 },
  strengthWrap:  { display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 },
  strengthTrack: { flex: 1, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' },
  strengthBar:   { height: '100%', borderRadius: 99, transition: 'width 0.3s ease, background 0.3s ease' },
  strengthLabel: { fontSize: '0.72rem', fontWeight: 600, whiteSpace: 'nowrap' },
  submitBtn: {
    padding: '13px', borderRadius: 10,
    background: 'linear-gradient(135deg, #8B2FE8, #22D3EE)',
    border: 'none', color: '#fff', fontSize: '0.95rem', fontWeight: 700,
    cursor: 'pointer', fontFamily: "'Inter', sans-serif",
    boxShadow: '0 4px 20px rgba(139,47,232,0.4)', transition: 'opacity 0.2s',
  },
  switchText: { textAlign: 'center', color: '#475569', fontSize: '0.84rem' },
  link:       { color: '#9B40FF', textDecoration: 'none', fontWeight: 600 },
};
