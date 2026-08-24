# 01: Test harness + root layout shell

**What to build:** The shared foundation every port slice renders into and tests against. Stand up Vitest with a shared `fetch`-mock helper (canned TMDB JSON + error responses) so both test seams (services unit + HTTP route) have a common pattern and a first test runs green. Build the root App Router layout that hosts the whole app: the skip-to-content link, `AppHeader`, `AppFooter`, a `ThemeProvider` (`next-themes`, class attribute, system theme, no flash), the `sonner` `Toaster`, and `ScrollSmootherWrapper` loaded client-only via `next/dynamic` with `ssr: false`. The default `/` page renders inside this real shell and the app boots in dev. GSAP plugins are registered client-side only.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] `bun run dev` serves `/` inside the full shell (header, footer, skip-link, theme toggle) with no hydration errors
- [ ] Toggling theme persists across reloads with no flash of incorrect theme
- [ ] Vitest is installed and `bun run test` runs a passing sample test using the shared fetch-mock helper
- [ ] `bun run lint` and `bun run fmt:check` pass
- [ ] No GSAP/`ScrollSmoother` code executes during SSR (verified by clean server render)
