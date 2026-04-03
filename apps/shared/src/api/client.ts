import { DEFAULT_BASE_URL } from '../constants/config';

export interface ApiClientConfig {
  baseUrl?: string;
  getHeaders?: () => Record<string, string>;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

let clientConfig: ApiClientConfig = {
  baseUrl: DEFAULT_BASE_URL,
};

/**
 * Call this once when your app boots, before any API calls.
 * 
 * Web (admin):   init({ baseUrl: import.meta.env.VITE_PUBLIC_API_URL })
 * Mobile:        init({ baseUrl: process.env.EXPO_PUBLIC_API_URL })
 */
export function init(config: ApiClientConfig) {
  clientConfig = { ...clientConfig, ...config };
}

export async function request<T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string,
  body?: unknown,
): Promise<ApiResponse<T>> {
  const url = `${clientConfig.baseUrl}${path}`;

  const extraHeaders = clientConfig.getHeaders?.() ?? {};

  if (path.includes("/api/auth")) {
    console.log(`[api-debug] ${method} ${url}`, { body, credentials: 'include' });
  }

  const res = await fetch(url, {
    method,
    credentials: 'include',           // sends session cookie for web
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let data: T | null = null;
  let error: string | null = null;

  const text = await res.text();

  if (text) {
    try {
      const json = JSON.parse(text);
      if (res.ok) {
        data = json as T;
      } else {
        error = json?.error ?? `Request failed with status ${res.status}`;
      }
    } catch {
      error = text;
    }
  }

  return { data, error, status: res.status };
}
