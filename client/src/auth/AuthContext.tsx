import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { clearToken, getToken, setToken } from "../lib/auth";

type AuthState = {
  token: string | null;
  isAuthed: boolean;
  signIn: (token: string) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);

  useEffect(() => {
    setTokenState(getToken());
  }, []);

  const value = useMemo<AuthState>(() => {
    return {
      token,
      isAuthed: !!token,
      signIn: (newToken: string) => {
        setToken(newToken);
        setTokenState(newToken);
      },
      signOut: () => {
        clearToken();
        setTokenState(null);
      },
    };
  }, [token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
