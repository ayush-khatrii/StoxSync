"use client";

import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

export function useStoredList<T>(key: string, fallback: T[]): [T[], Dispatch<SetStateAction<T[]>>] {
  const [items, setItems] = useState<T[]>(fallback);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored) setItems(JSON.parse(stored) as T[]);
    } catch {
      // Keep the in-memory list usable when storage is unavailable.
    } finally {
      setReady(true);
    }
  }, [key]);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(key, JSON.stringify(items));
  }, [items, key, ready]);

  return [items, setItems];
}
