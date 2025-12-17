import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  clearToken,
  getToken,
  setToken,
  type AuthUser,
} from "../lib/auth";

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  isAuthed: boolean;
  signIn: (token: string, user?: AuthUser) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  // 앱 시작 시 localStorage에서 토큰 복구
  useEffect(() => {
    const stored = getToken();
    if (stored) {
      setTokenState(stored);
      // ⚠️ user는 토큰만으로 복구 불가 → 로그인/회원가입 시 세팅
    }
  }, []);

  const value = useMemo<AuthState>(() => {
    return {
      token,
      user,
      isAuthed: !!token,

      signIn: (newToken: string, newUser?: AuthUser) => {
        setToken(newToken);
        setTokenState(newToken);
        if (newUser) setUser(newUser);
      },

      signOut: () => {
        clearToken();
        setTokenState(null);
        setUser(null);
      },
    };
  }, [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
