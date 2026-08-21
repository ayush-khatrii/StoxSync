"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type AuthContextValue = {
  userId: string | null;
  loading: boolean;
  login: (passcode: string) => Promise<void>;
  register: (passcode: string) => Promise<void>;
  logout: () => Promise<void>;
  changePasscode: (currentPasscode: string, newPasscode: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function request<T>(url: string, options?: RequestInit) {
  const response = await fetch(url, { ...options, headers: { "Content-Type": "application/json", ...options?.headers } });
  const body = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) throw new Error(body.error || "Something went wrong.");
  return body as T;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void request<{ userId: string }>("/api/auth/me")
      .then((body) => setUserId(body.userId))
      .catch(() => setUserId(null))
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    userId,
    loading,
    login: async (passcode) => {
      const body = await request<{ userId: string }>("/api/auth/login", { method: "POST", body: JSON.stringify({ passcode }) });
      setUserId(body.userId);
    },
    register: async (passcode) => {
      const body = await request<{ userId: string }>("/api/auth/register", { method: "POST", body: JSON.stringify({ passcode }) });
      setUserId(body.userId);
    },
    logout: async () => {
      await request("/api/auth/logout", { method: "POST" });
      setUserId(null);
    },
    changePasscode: async (currentPasscode, newPasscode) => {
      await request("/api/auth/change-passcode", { method: "POST", body: JSON.stringify({ currentPasscode, newPasscode }) });
    },
  }), [loading, userId]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}
