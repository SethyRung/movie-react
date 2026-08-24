# 03: Movie list page

**What to build:** The `/movies` route as a Server Component that reads `searchParams` for the discovery kind (popular / now playing / upcoming / top rated) and page, calls `discoverList(kind, page)`, and renders the list with category tabs and pagination. Ports `MovieListPage` and `CategoryTabs`, reusing the shared `MovieGrid`/`MovieCard` from ticket 02. Category switches and pagination are driven by URL `searchParams` so they are linkable and SSR-friendly.

**Blocked by:** 02 (home page + shared movie display components)

**Status:** ready-for-agent

- [ ] `/movies` renders the selected discovery list for page 1 by default
- [ ] Category tabs change the list via `searchParams` (no client router state required)
- [ ] Pagination advances pages via `searchParams` and stays within `total_pages`
- [ ] An HTTP route test asserts the page renders the expected list and that a `kind`/`page` searchParam changes the mocked `discoverList` call
- [ ] `bun run lint`, `bun run fmt:check`, and `bun run build` pass
