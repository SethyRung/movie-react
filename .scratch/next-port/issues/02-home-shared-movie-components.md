# 02: Home page + shared movie display components

**What to build:** The `/` route as a Server Component that calls `getDiscoveryLists` and renders the popular, now playing, upcoming, and top-rated discovery sections. This slice also ports the shared movie display components the rest of the port reuses: `MovieCard`, `MovieGrid`, `MovieCarousel`, and `RatingDisplay` — adapted from the legacy source as client components where they use hooks/interactivity. The home page is demoable with all four discovery sections populated server-side, with graceful handling when some lists fail (the fan-out already settles partially).

**Blocked by:** 01 (test harness + root layout shell)

**Status:** ready-for-agent

- [ ] `/` renders all available discovery sections with real server-fetched data
- [ ] `MovieCard` displays poster, title, rating, and release info; `MovieCarousel` scrolls horizontally; `MovieGrid` lays out responsively
- [ ] An HTTP route test (Vitest, mocked `fetch`) asserts the home page HTML contains each discovery section
- [ ] `next/link` is used for navigation from cards into movie detail
- [ ] `bun run lint`, `bun run fmt:check`, and `bun run build` pass
