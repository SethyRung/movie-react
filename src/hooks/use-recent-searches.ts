"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "cinephil:recent-searches:v1";
const MAX_RECENT = 8;
const EMPTY: string[] = [];

let recents: string[] = [];
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function readStorage(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string" && item.trim() !== "");
  } catch {
    return [];
  }
}

function writeStorage(next: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* private mode / quota */
  }
}

if (typeof window !== "undefined") {
  recents = readStorage();
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

function useHasMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function useRecentSearches() {
  const mounted = useHasMounted();
  const stored = useSyncExternalStore(
    subscribe,
    () => recents,
    () => EMPTY,
  );

  const addRecentSearch = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    recents = [
      trimmed,
      ...recents.filter((item) => item.toLowerCase() !== trimmed.toLowerCase()),
    ].slice(0, MAX_RECENT);
    writeStorage(recents);
    emit();
  }, []);

  const removeRecentSearch = useCallback((query: string) => {
    recents = recents.filter((item) => item !== query);
    writeStorage(recents);
    emit();
  }, []);

  const clearRecentSearches = useCallback(() => {
    recents = [];
    writeStorage(recents);
    emit();
  }, []);

  return {
    recent: mounted ? stored : EMPTY,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
  };
}
