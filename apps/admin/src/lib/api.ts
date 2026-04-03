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
