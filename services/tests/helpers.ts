import { env } from '../src/lib/env';

export const BASE_URL = env?.BASE_URL || "http://localhost:3000";

// ─── State ─────────────────────────────────────────────────
export let cookie = "";
export let userId = "";
export let passed = 0;
export let failed = 0;

export function setCookie(value: string) { cookie = value; }
export function setUserId(value: string) { userId = value; }
export function incrementPassed() { passed++; }
export function incrementFailed() { failed++; }

// ─── Helpers ───────────────────────────────────────────────
export async function request(method: string, path: string, body?: any) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Origin: BASE_URL,
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    redirect: "manual",
  });

  // Capture set-cookie header from sign-in
  const setCookieHeader = res.headers.get("set-cookie");
  if (setCookieHeader) {
    setCookie(setCookieHeader.split(";")[0]);
  }

  const text = await res.text();
  let data: any = null;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  return { status: res.status, data };
}

export function assert(name: string, condition: boolean, detail?: string) {
  if (condition) {
    console.log(`  ✅ ${name}`);
    incrementPassed();
  } else {
    console.log(`  ❌ ${name}${detail ? ` — ${detail}` : ""}`);
    incrementFailed();
  }
}
