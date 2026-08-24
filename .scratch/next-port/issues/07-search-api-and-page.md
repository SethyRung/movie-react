# 07: Search — /api/search Route Handler + client Search page

**What to build:** The search experience split across the server/client boundary. A `/api/search` Route Handler calls `searchMovies` server-side (using the secret `TMDB_API_KEY`) and returns paginated JSON. The `/search` page is a client component that debounces the query input, fetches `/api/search`, renders results, and remembers recent searches in `localStorage` with `typeof window` SSR guards. Ports `SearchBar`, `SearchResults`, and `useRecentSearches`. This is the only client-reachable path to TMDB.

**Blocked by:** 01 (test harness + root layout shell)

**Status:** ready-for-agent

- [ ] `/api/search?q=<term>&page=<n>` returns JSON matching the paginated movie shape, with the TMDB key never exposed to the client
- [ ] `/search` debounces input and renders results from `/api/search`
- [ ] Recent searches persist across reloads via `localStorage` without SSR hydration mismatches
- [ ] A services unit test asserts `searchMovies` parses/validates a mocked TMDB response and throws `ServiceError` for a non-ok response
- [ ] An HTTP route test asserts `/api/search` returns the expected JSON shape with `fetch` mocked
- [ ] `bun run lint`, `bun run fmt:check`, and `bun run build` pass
