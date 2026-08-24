# 05: Person detail page

**What to build:** The `/person/[id]` route as a Server Component that calls `getPerson` and renders the person's biography, birth/death info, place of birth, known-for department, and profile image. Ports `PersonDetailPage` from the legacy source. The page is server-rendered with metadata for crawlability.

**Blocked by:** 01 (test harness + root layout shell)

**Status:** ready-for-agent

- [ ] `/person/[id]` renders the person's name, biography, and known-for department from server-fetched data
- [ ] A missing/invalid person id shows a not-found-style error state, not a crash
- [ ] An HTTP route test asserts the page HTML contains the person's name
- [ ] `bun run lint`, `bun run fmt:check`, and `bun run build` pass
