"use client";

import { useCallback, useEffect, useState } from "react";

import type { ApplicationEntry } from "@/components/ApplicationSheet";

async function request<T>(url: string, options?: RequestInit) {
  const response = await fetch(url, { ...options, headers: { "Content-Type": "application/json", ...options?.headers } });
  const body = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) throw new Error(body.error || "Unable to save application.");
  return body as T;
}

export function useApplications() {
  const [applications, setApplications] = useState<ApplicationEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadApplications = useCallback(async () => {
    setLoading(true);
    try {
      const body = await request<{ applications: ApplicationEntry[] }>("/api/applications", { cache: "no-store" });
      setApplications(body.applications);
      setError(null);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load applications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadApplications(); }, [loadApplications]);

  const addApplication = useCallback(async (application: ApplicationEntry) => {
    try {
      const body = await request<{ application: ApplicationEntry }>("/api/applications", { method: "POST", body: JSON.stringify(application) });
      setApplications((current) => [body.application, ...current]);
      setError(null);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to add application.");
    }
  }, []);

  const updateApplication = useCallback(async (application: ApplicationEntry) => {
    try {
      const body = await request<{ application: ApplicationEntry }>(`/api/applications/${application.id}`, { method: "PATCH", body: JSON.stringify(application) });
      setApplications((current) => current.map((item) => item.id === body.application.id ? body.application : item));
      setError(null);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to update application.");
    }
  }, []);

  const deleteApplication = useCallback(async (application: ApplicationEntry) => {
    try {
      await request(`/api/applications/${application.id}`, { method: "DELETE" });
      setApplications((current) => current.filter((item) => item.id !== application.id));
      setError(null);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to delete application.");
    }
  }, []);

  return { applications, loading, error, addApplication, updateApplication, deleteApplication, reload: loadApplications };
}
