export type AuthUser = {
  id: string;
  email: string;
  username: string;
  role: "USER" | "ADMIN";
  is_active: boolean;
};

export type AuthData = {
  token: string;
  user?: AuthUser;
};

const TOKEN_KEY = "booksy_token";

/** -----------------------------
 *  Token helpers
 *  ----------------------------- */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

/** -----------------------------
 *  Env + URL helpers (safe)
 *  ----------------------------- */
function getApiBase(): string {
  const raw = import.meta.env.VITE_API_URL as string | undefined;

  if (!raw || raw.trim() === "") {
    throw new Error(
      "Missing VITE_API_URL. Set it in Netlify environment variables (Production) and redeploy."
    );
  }
  return raw.replace(/\/+$/, "");
}

function normalizePath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

async function apiRequest<T>(
  method: "POST" | "GET" | "PUT" | "DELETE",
  path: string,
  body?: unknown,
  token?: string
): Promise<T> {
  const base = getApiBase();
  const url = `${base}${normalizePath(path)}`;

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  // 응답이 JSON인지 힌트로 판단
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (!res.ok) {
    // 가능한 경우 서버의 message를 우선 보여주기
    let message = `Request failed: ${res.status}`;

    try {
      if (isJson) {
        const data = await res.json();
        message = data?.message || data?.error || message;
      } else {
        const text = await res.text();
        if (text && text.trim().length > 0) {
          message = text.slice(0, 200);
        }
      }
    } catch {
      // 파싱 실패 시 기본 메시지
    }

    throw new Error(message);
  }

  // 204 같은 no-content도 대비
  if (res.status === 204) {
    // @ts-expect-error - caller가 204를 쓰는 경우만 받도록
    return undefined;
  }

  return (isJson ? res.json() : (res.text() as any)) as Promise<T>;
}

/** -----------------------------
 *  Auth APIs (register/login 분리)
 *  ----------------------------- */

// 백엔드: POST /auth/register  -> { user, token }
export async function registerAuth(input: {
  username: string;
  email: string;
  password: string;
}): Promise<AuthData> {
  return apiRequest<AuthData>("POST", "/auth/register", input);
}

// 백엔드: POST /auth/login -> { token, user }
export async function loginAuth(input: {
  email: string;
  password: string;
}): Promise<AuthData> {
  return apiRequest<AuthData>("POST", "/auth/login", input);
}

/** -----------------------------
 *  Optional: Protected API helper
 *  (JWT 필요한 요청에 쓰기 좋음)
 *  ----------------------------- */
export async function authedPost<T>(path: string, body: unknown): Promise<T> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  return apiRequest<T>("POST", path, body, token);
}

export async function authedMultipartPost<T>(path: string, formData: FormData): Promise<T> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  const base = getApiBase();
  const url = `${base}${normalizePath(path)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      // ⚠️ Content-Type 지정하지 마! 브라우저가 boundary 포함해서 자동 설정
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      if (isJson) {
        const data = await res.json();
        message = data?.message || data?.error || message;
      } else {
        const text = await res.text();
        if (text && text.trim().length > 0) message = text.slice(0, 200);
      }
    } catch {}
    throw new Error(message);
  }

  if (res.status === 204) return undefined as any;
  return (isJson ? res.json() : (res.text() as any)) as Promise<T>;
}

export async function apiGet<T>(path: string): Promise<T> {
  return apiRequest<T>("GET", path);
}

export async function authedGet<T>(path: string): Promise<T> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");
  return apiRequest<T>("GET", path, undefined, token);
}