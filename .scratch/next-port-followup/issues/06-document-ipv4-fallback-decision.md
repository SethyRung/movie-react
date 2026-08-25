# 06: Document IPv4 undici fallback decision

**What to build:** Record the accepted deviation from the spec in the project docs rather than removing the code. The tmdb seam's `tmdbFetch` keeps its IPv4 fallback: it first tries the standard server `fetch`, and on a `TypeError` (dual-stack connection failure in some environments) flips an in-process `ipv4Only` flag and retries through an `undici` `Agent` forced to IPv4. Add a short note to `AGENTS.md` (under the tmdb seam / environment section) stating that this fallback is an intentional operational deviation from the spec's "plain server fetch" wording, kept as a runtime defence, so future agents understand why `undici` is present and why `tmdbFetch` is not a single bare `fetch`. No behaviour change; documentation only.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] `AGENTS.md` describes the IPv4 fallback in the tmdb seam, naming it as an accepted deviation from the port spec's plain-server-fetch wording
- [ ] The note explains the trigger (`TypeError` from the standard fetch) and the resolution (in-process `ipv4Only` flag + `undici` IPv4-only `Agent` retry)
- [ ] No code behaviour changes (the fallback stays as-is); only docs are touched
- [ ] `bun run lint` → `bun run fmt:check` → `bun run build` all pass, in that order
- [ ] `bun run test` passes