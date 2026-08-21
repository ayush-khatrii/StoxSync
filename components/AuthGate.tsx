"use client";

import type { ReactNode } from "react";

import { AuthScreen } from "@/components/AuthScreen";
import { useAuth } from "@/components/auth-provider";

export function AuthGate({ children }: { children: ReactNode }) {
  const { loading, userId } = useAuth();
  if (loading) return <main className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">Loading workspace…</main>;
  return userId ? children : <AuthScreen />;
}
