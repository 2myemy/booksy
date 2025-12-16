const API_BASE = import.meta.env.VITE_API_BASE_URL;

console.log("MODE:", import.meta.env.MODE);
console.log("API_BASE:", import.meta.env.VITE_API_BASE_URL);

if (!API_BASE) {
  console.error("ENV DUMP:", import.meta.env);
  throw new Error("Missing VITE_API_BASE_URL (Netlify env var not applied)");
}

async function jsonFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data as T;
}

export async function login(email: string, password: string) {
  // 백엔드 응답이 { token: "..." } 라고 가정
  return jsonFetch<{ token: string }>(`${API_BASE}/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register(name: string, email: string, password: string) {
  return jsonFetch<{ token: string }>(`${API_BASE}/auth/register`, {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}
