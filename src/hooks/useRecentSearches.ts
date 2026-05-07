import { useCallback, useState } from "react";

const RECENT_SEARCHES_KEY = "cinephil_recent_searches";
const MAX_RECENT = 8;

function loadRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as string[];
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch {
    // ignore
  }
  return [];
}

function saveRecentSearches(searches: string[]) {
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
}

export function useRecentSearches() {
  const [recent, setRecent] = useState<string[]>(loadRecentSearches);

  const addRecentSearch = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setRecent((prev) => {
      const filtered = prev.filter((s) => s.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, MAX_RECENT);
      saveRecentSearches(updated);
      return updated;
    });
  }, []);

  const removeRecentSearch = useCallback((query: string) => {
    setRecent((prev) => {
      const updated = prev.filter((s) => s !== query);
      saveRecentSearches(updated);
      return updated;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecent([]);
    saveRecentSearches([]);
  }, []);

  return {
    recent,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
  };
}
