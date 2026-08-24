# 10: Docs, cleanup, final verify

**What to build:** Close out the port. Rewrite `AGENTS.md` to describe the Next.js architecture (App Router, server-side tmdb seam with `fetch` + secret `TMDB_API_KEY`, the client/server boundary, dropped TanStack Query, `next-themes`, GSAP client-only loading, the Vitest test seams, and the `bun`/`oxlint`/`oxfmt` toolchain). Write a new `README.md` for the Next project. Bump the `LICENSE` year. Remove the `./legacy/` reference directory once all routes are ported and verified. Run the full verification gate green.

**Blocked by:** 02, 03, 04, 05, 06, 07, 08, 09 (all route slices)

**Status:** ready-for-agent

- [ ] `AGENTS.md` accurately describes the Next architecture and replaces the Vite-era content
- [ ] `README.md` documents the Next project (scripts, env, architecture summary)
- [ ] `LICENSE` year is current
- [ ] `./legacy/` is removed
- [ ] `bun run lint` → `bun run fmt:check` → `bun run build` all pass, in that order
- [ ] `bun run test` passes (all services + HTTP route tests green)
