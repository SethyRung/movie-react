# 03: Extract shared param/id helpers

**What to build:** A single shared module of route-param helpers for the detail pages, replacing the duplicated `parseMovieId`/`parsePersonId` and `isNotFoundError` logic currently copy-pasted across the movie detail and person detail pages. The shared helpers parse a route `id` searchParam into a positive integer (or signal invalid/missing) and recognise a `ServiceError` whose code marks a not-found result, so each detail page can decide its not-found state with one shared call rather than its own copy.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] One shared param/id helper module exists under `src/lib/` and is imported by both the movie detail and person detail pages
- [ ] The local `parseMovieId`/`parsePersonId` and `isNotFoundError` definitions inside those pages are removed
- [ ] Invalid/missing id and not-found behaviour is unchanged for both detail pages (still render the not-found state, not a crash)
- [ ] `bun run lint` → `bun run fmt:check` → `bun run build` all pass, in that order
- [ ] `bun run test` passes (existing HTTP route tests for movie/person detail still assert title and cast/person name)