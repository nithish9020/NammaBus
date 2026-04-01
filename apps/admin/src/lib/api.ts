// apps/admin/src/lib/api.ts
// BASE_URL: e.g. https://nammabus-7oza.onrender.com (no trailing slash, no /api)
export const BASE_URL = (import.meta.env.VITE_PUBLIC_API_URL || 'http://localhost:3000').replace(/\/$/, '');

// API_URL: for regular REST endpoints like /identity/*, /mobility/*
export const API_URL = `${BASE_URL}/api`;

// apiFetch: for REST endpoints (automatically prepends BASE_URL/api)
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
    credentials: 'include',
  });
  return response;
}

// authFetch: for better-auth endpoints (prepends BASE_URL only, since better-auth basePath is /api/auth)
export async function authFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
    credentials: 'include',
  });
  return response;
}
