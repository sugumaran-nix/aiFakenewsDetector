"use client";
import { useState, useEffect, useCallback } from "react";
import type { PredictResult } from "@/lib/api";

export interface HistoryEntry extends PredictResult {
  id: string;
  headline: string;
  article?: string;
  timestamp: string;
}

const KEY = "veritai_history";
const MAX = 50;

export function useHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setEntries(JSON.parse(raw));
    } catch {}
  }, []);

  const add = useCallback((entry: Omit<HistoryEntry, "id" | "timestamp">) => {
    setEntries((prev) => {
      const next: HistoryEntry[] = [
        {
          ...entry,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ].slice(0, MAX);
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setEntries([]);
    try { localStorage.removeItem(KEY); } catch {}
  }, []);

  return { entries, add, clear };
}
