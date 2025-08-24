// src/lib/fetcher.ts

export async function apiGet<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`GET ${url} failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function apiPost<T>(
  url: string,
  data?: unknown,
  headers?: Record<string, string>
): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!res.ok) {
    throw new Error(`POST ${url} failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// Helper function to build full API URL
export function getApiUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  return `${baseUrl}/api${path}`;
}

// Client-side fetcher with error handling
export async function clientFetch<T>(url: string): Promise<T> {
  try {
    return await apiGet<T>(url);
  } catch (error) {
    console.error(`Client fetch error for ${url}:`, error);
    throw error;
  }
}
