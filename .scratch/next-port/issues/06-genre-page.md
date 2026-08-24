# 06: Genre page

**What to build:** The `/genre/[id]` route as a Server Component that reads `searchParams` for the page, calls `getMoviesByGenre(genreId, page)`, and renders the genre's movies with pagination. Ports `GenrePage`, reusing the shared `MovieGrid`/`MovieCard` from ticket 02. Pagination is driven by URL `searchParams` so it is linkable and SSR-friendly.

**Blocked by:** 02 (home page + shared movie display components)

**Status:** ready-for-agent

- [ ] `/genre/[id]` renders the first page of movies for that genre
- [ ] Pagination advances pages via `searchParams` and stays within `total_pages`
- [ ] An HTTP route test asserts the page renders results and that the `page` searchParam changes the mocked `getMoviesByGenre` call
- [ ] `bun run lint`, `bun run fmt:check`, and `bun run build` pass
