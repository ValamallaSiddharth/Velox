import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, provider, signInWithPopup, signOut, FIREBASE_CONFIGURED } from '../firebase';

const AuthContext = createContext(null);
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  /* ── Rehydrate session on page load ── */
  useEffect(() => {
    try {
      const stored = localStorage.getItem('velox_session');
      if (stored) setUser(JSON.parse(stored));
    } catch {
      localStorage.removeItem('velox_session');
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── Save session helper ── */
  const saveSession = (userData, token) => {
    const session = { id: userData.id, name: userData.name, email: userData.email };
    localStorage.setItem('velox_session', JSON.stringify(session));
    localStorage.setItem('velox_token',   token);
    setUser(session);
  };

  /* ── REGISTER → POST /api/auth/register ── */
  const register = async (name, email, password) => {
    try {
      const res  = await fetch(`${API}/auth/register`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { ok: false, error: data.message || 'Registration failed.' };
      saveSession(data.user, data.token);
      return { ok: true };
    } catch {
      return { ok: false, error: 'Cannot connect to server. Make sure the backend is running.' };
    }
  };

  /* ── LOGIN → POST /api/auth/login ── */
  const login = async (email, password) => {
    try {
      const res  = await fetch(`${API}/auth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { ok: false, error: data.message || 'Login failed.' };
      saveSession(data.user, data.token);
      return { ok: true };
    } catch {
      return { ok: false, error: 'Cannot connect to server. Make sure the backend is running.' };
    }
  };

  /* ── GOOGLE LOGIN ── */
  const loginWithGoogle = async () => {
    /* Guard: show helpful message if credentials not filled in yet */
    if (!FIREBASE_CONFIGURED) {
      return {
        ok: false,
        error:
          '🔧 Firebase not set up yet. Open frontend/.env and paste your Firebase credentials, then restart the dev server.',
      };
    }

    try {
      /* 1. Firebase Google popup */
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;

      /* 2. Send to backend — creates account if new, logs in if existing */
      const res  = await fetch(`${API}/auth/social`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          name:     fbUser.displayName,
          email:    fbUser.email,
          googleId: fbUser.uid,
        }),
      });
      const data = await res.json();
      if (!res.ok) return { ok: false, error: data.message || 'Google login failed.' };

      /* 3. Save session */
      saveSession(data.user, data.token);
      return { ok: true };

    } catch (err) {
      /* Silently ignore — user just closed the popup */
      if (
        err.code === 'auth/popup-closed-by-user' ||
        err.code === 'auth/cancelled-popup-request'
      ) return { ok: false, error: '' };

      /* Firebase not configured properly */
      if (
        err.code === 'auth/configuration-not-found' ||
        err.code === 'auth/invalid-api-key'         ||
        err.code === 'auth/invalid-app-id'
      ) return {
        ok: false,
        error: '🔧 Firebase credentials are invalid. Check your frontend/.env values and restart the server.',
      };

      return { ok: false, error: err.message || 'Google sign-in failed.' };
    }
  };

  /* ── LOGOUT ── */
  const logout = async () => {
    try { await signOut(auth); } catch { /* ignore */ }
    localStorage.removeItem('velox_session');
    localStorage.removeItem('velox_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
