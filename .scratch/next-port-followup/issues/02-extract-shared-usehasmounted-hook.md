# 02: Extract shared useHasMounted hook

**What to build:** A single shared `useHasMounted` hook that the watchlist and recent-searches hooks both import, replacing the two verbatim copies currently defined locally inside `useWatchlist` and `useRecentSearches`. The shared hook keeps the same SSR-safe "mount then reveal" semantics (returns `false` on the server and first client render, `true` after mount) so the existing SSR-empty-snapshot behaviour via `useSyncExternalStore` is preserved and no hydration mismatch is introduced.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] One shared `useHasMounted` hook exists under `src/hooks/` and is imported by both `useWatchlist` and `useRecentSearches`
- [ ] The local `useHasMounted` definitions inside those two hooks are removed
- [ ] Watchlist and recent-searches SSR-empty snapshot behaviour is unchanged (no hydration mismatch, list/recent searches stay empty on the server)
- [ ] `bun run lint` → `bun run fmt:check` → `bun run build` all pass, in that order
- [ ] `bun run test` passes
