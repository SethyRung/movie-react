"use client";

import { useCallback, useSyncExternalStore } from "react";
import { toast } from "sonner";
import { useHasMounted } from "./use-has-mounted";

const STORAGE_KEY = "cinephil:watchlist:v1";
const LEGACY_STORAGE_KEY = "cinephil_watchlist";
const EMPTY: WatchlistItem[] = [];

export type WatchlistItem = {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string | null;
  addedAt: number;
};

export type WatchlistMovie = {
  id: number;
  title: string;
  poster_path?: string | null;
  vote_average?: number;
  release_date?: string | null;
};

let items: WatchlistItem[] = [];
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function isWatchlistItem(value: unknown): value is WatchlistItem {
  if (typeof value !== "object" || value === null) return false;
  const item = value as WatchlistItem;
  return (
    typeof item.id === "number" &&
    typeof item.title === "string" &&
    (typeof item.poster_path === "string" || item.poster_path === null) &&
    typeof item.vote_average === "number" &&
    (typeof item.release_date === "string" || item.release_date === null) &&
    typeof item.addedAt === "number"
  );
}

function readKey(key: string): WatchlistItem[] {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isWatchlistItem);
  } catch {
    return [];
  }
}

function readStorage(): WatchlistItem[] {
  const current = readKey(STORAGE_KEY);
  if (current.length > 0) return current;
  return readKey(LEGACY_STORAGE_KEY);
}

function writeStorage(next: WatchlistItem[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* private mode / quota */
  }
}

if (typeof window !== "undefined") {
  items = readStorage();
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

function toWatchlistMovie(movie: WatchlistMovie): Omit<WatchlistItem, "addedAt"> {
  return {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path ?? null,
    vote_average: movie.vote_average ?? 0,
    release_date: movie.release_date ?? null,
  };
}

export function useWatchlist() {
  const mounted = useHasMounted();
  const stored = useSyncExternalStore(
    subscribe,
    () => items,
    () => EMPTY,
  );
  const watchlist = mounted ? stored : EMPTY;

  const isInWatchlist = useCallback(
    (id: number) => watchlist.some((item) => item.id === id),
    [watchlist],
  );

  const addToWatchlist = useCallback((movie: WatchlistMovie) => {
    const nextItem = { ...toWatchlistMovie(movie), addedAt: Date.now() };
    if (items.some((item) => item.id === nextItem.id)) return;
    items = [nextItem, ...items];
    writeStorage(items);
    emit();
    toast.success(`${nextItem.title} added to watchlist`);
  }, []);

  const removeFromWatchlist = useCallback((id: number, title?: string) => {
    const current = items.find((item) => item.id === id);
    const name = title || current?.title || "Movie";
    items = items.filter((item) => item.id !== id);
    writeStorage(items);
    emit();
    toast(`${name} removed from watchlist`);
  }, []);

  const toggleWatchlist = useCallback(
    (movie: WatchlistMovie) => {
      if (items.some((item) => item.id === movie.id)) {
        removeFromWatchlist(movie.id, movie.title);
        return;
      }
      addToWatchlist(movie);
    },
    [addToWatchlist, removeFromWatchlist],
  );

  return {
    watchlist,
    isInWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
  };
}
