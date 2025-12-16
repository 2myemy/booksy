export type AuthUser = {
  id: string;
  email: string;
  name?: string;
};

export type AuthData = {
  token: string;
  user?: AuthUser;
};

const TOKEN_KEY = "booksy_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function apiPost<T>(path: string, body: unknown, token?: string): Promise<T> {
  const base = import.meta.env.VITE_API_URL;
  const res = await fetch(`${base}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}
