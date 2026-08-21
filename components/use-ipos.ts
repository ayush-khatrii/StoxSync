"use client";

import { useCallback, useEffect, useState } from "react";

import type { Ipo } from "@/constants";

async function request<T>(url: string, options?: RequestInit) {
  const response = await fetch(url, { ...options, headers: { "Content-Type": "application/json", ...options?.headers } });
  const body = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) throw new Error(body.error || "Unable to save IPO.");
  return body as T;
}

export function useIpos() {
  const [ipos, setIpos] = useState<Ipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadIpos = useCallback(async () => {
    setLoading(true);
    try {
      const body = await request<{ ipos: Ipo[] }>("/api/ipos", { cache: "no-store" });
      setIpos(body.ipos);
      setError(null);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load IPOs.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadIpos();
  }, [loadIpos]);

  const addIpo = useCallback(async (ipo: Ipo) => {
    try {
      const body = await request<{ ipo: Ipo }>("/api/ipos", { method: "POST", body: JSON.stringify(ipo) });
      setIpos((current) => [body.ipo, ...current]);
      setError(null);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to add IPO.");
    }
  }, []);

  const updateIpo = useCallback(async (ipo: Ipo) => {
    try {
      const body = await request<{ ipo: Ipo }>(`/api/ipos/${ipo.id}`, { method: "PATCH", body: JSON.stringify(ipo) });
      setIpos((current) => current.map((item) => item.id === body.ipo.id ? body.ipo : item));
      setError(null);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to update IPO.");
    }
  }, []);

  const deleteIpo = useCallback(async (ipo: Ipo) => {
    try {
      await request(`/api/ipos/${ipo.id}`, { method: "DELETE" });
      setIpos((current) => current.filter((item) => item.id !== ipo.id));
      setError(null);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to delete IPO.");
    }
  }, []);

  return { ipos, loading, error, addIpo, updateIpo, deleteIpo, reload: loadIpos };
}
