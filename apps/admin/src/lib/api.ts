// apps/admin/src/lib/api.ts

// BASE_URL: e.g. https://nammabus-7oza.onrender.com (no trailing slash)
export const BASE_URL = (import.meta.env.VITE_PUBLIC_API_URL || 'http://localhost:3000').replace(/\/$/, '');

// ─── Token helper ──────────────────────────────────────────
function getToken(): string | null {
  return localStorage.getItem('nammabus_token');
}

// ─── authFetch ─────────────────────────────────────────────
// For better-auth endpoints: /api/auth/sign-in/email, /api/auth/get-session, etc.
// Prepends BASE_URL (no /api prefix since better-auth basePath is /api/auth)
export async function authFetch(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  return fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });
}

// ─── apiFetch ──────────────────────────────────────────────
// For REST endpoints: /api/identity/*, /api/mobility/*, /api/realtime/*
// Prepends BASE_URL/api
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  return fetch(`${BASE_URL}/api${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });
}

// ─── Admin API Additions ───────────────────────────────────
export async function getSession() {
  const res = await authFetch('/get-session');
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) return null;
    throw new Error('Failed to get session');
  }
  return res.json();
}

export async function signOut() {
  const res = await authFetch('/sign-out', { method: 'POST' });
  if (!res.ok) throw new Error('Failed to sign out');
  localStorage.removeItem('nammabus_token');
  return res.json();
}
