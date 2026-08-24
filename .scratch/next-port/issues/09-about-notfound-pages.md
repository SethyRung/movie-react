# 09: About + Not Found pages

**What to build:** The static `/about` page and the App Router `not-found.tsx`, both rendered inside the root shell. Ports `AboutPage` and `NotFoundPage` content from the legacy source. These are the simplest routes and validate the not-found contract for unknown URLs and for missing detail pages.

**Blocked by:** 01 (test harness + root layout shell)

**Status:** ready-for-agent

- [ ] `/about` renders its content inside the shell
- [ ] An unknown URL renders `not-found.tsx` inside the shell (with the header/footer)
- [ ] `bun run lint`, `bun run fmt:check`, and `bun run build` pass
