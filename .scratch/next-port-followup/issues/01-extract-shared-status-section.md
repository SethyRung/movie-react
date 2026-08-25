# 01: Extract shared status/error UI section

**What to build:** A single reusable presentational component that renders the "this section is unavailable / empty / not found" state currently duplicated as per-page status components across the home, movie list, movie detail, genre, and person pages. Each page's hand-rolled status block (`MovieStatus`, `GenreStatus`, `PersonStatus`, `MoviesUnavailable`, and the home page's inline fallback) is replaced by calls to the shared component, varying only the label, title, and message. The component is a client component only if it needs interactivity; otherwise keep it a plain server-renderable component consistent with the existing Server Component pages.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] One shared status section component exists and is used by the home, movie list, movie detail, genre, and person pages
- [ ] No per-page status component duplicates remain (the old `MovieStatus`/`GenreStatus`/`PersonStatus`/`MoviesUnavailable` shapes are gone)
- [ ] Rendered fallback behaviour is unchanged for each page (same label/title/message wording as before)
- [ ] `bun run lint` → `bun run fmt:check` → `bun run build` all pass, in that order
- [ ] `bun run test` passes (existing HTTP route tests still assert the fallback content where they did before)