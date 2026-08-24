# 08: Watchlist page

**What to build:** The `/watchlist` route as a client component over the ported `useWatchlist` hook (movies persisted in `localStorage`, with `typeof window` SSR guards) plus `usePageTitle`-equivalent behavior. Renders the saved movies using the shared `MovieGrid`/`MovieCard` (from ticket 02), shows an empty state when nothing is saved, and emits `sonner` toasts on add/remove. Because add/remove and localStorage persistence are client-only interactions outside the two Vitest seams, this slice is verified via the dev loop / browser rather than an automated test.

**Blocked by:** 02 (home page + shared movie display components)

**Status:** ready-for-agent

- [ ] `/watchlist` renders saved movies from `localStorage` with no SSR hydration mismatch
- [ ] Empty state shows when the watchlist is empty
- [ ] Adding/removing a movie (from a movie card/detail) updates the list and shows a toast
- [ ] The watchlist persists across reloads
- [ ] `bun run lint`, `bun run fmt:check`, and `bun run build` pass
