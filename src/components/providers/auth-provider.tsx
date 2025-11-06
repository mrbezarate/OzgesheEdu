"use client";

import { createContext, startTransition, useContext, useEffect, useMemo, useState } from "react";

import { apiGet, apiPost } from "@/lib/api-client";
import type { AppUser } from "@/types";

interface AuthContextValue {
  user: AppUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  setUser: (user: AppUser | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_STORAGE_KEY = "linguaflow-token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    typeof window !== "undefined" ? window.localStorage.getItem(TOKEN_STORAGE_KEY) : null,
  );
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(() =>
    typeof window !== "undefined" && window.localStorage.getItem(TOKEN_STORAGE_KEY) ? true : false,
  );

  useEffect(() => {
    if (!token) {
      startTransition(() => {
        setUser(null);
        setLoading(false);
      });
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
      return;
    }

    let cancelled = false;
    startTransition(() => setLoading(true));
    apiGet<{ user: AppUser }>("/api/auth/me", token)
      .then((response) => {
        if (!cancelled) {
          startTransition(() => {
            setUser(response.user);
            setLoading(false);
          });
        }
      })
      .catch(() => {
        if (!cancelled) {
          startTransition(() => {
            setToken(null);
            setUser(null);
            setLoading(false);
          });
          if (typeof window !== "undefined") {
            window.localStorage.removeItem(TOKEN_STORAGE_KEY);
          }
        }
      })
      .finally(() => {
        if (!cancelled && token) {
          startTransition(() => setLoading(false));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const login = async (email: string, password: string) => {
    const response = await apiPost<{ token: string; user: AppUser }>(
      "/api/auth/login",
      { email, password },
    );
    setToken(response.token);
    setUser(response.user);
    window.localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
    setLoading(false);
  };

  const register = async ({ name, email, password }: { name: string; email: string; password: string }) => {
    const response = await apiPost<{ token: string; user: AppUser }>("/api/auth/register", {
      name,
      email,
      password,
    });
    setToken(response.token);
    setUser(response.user);
    window.localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
    setLoading(false);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    setLoading(false);
  };

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout, setUser }),
    [user, token, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
