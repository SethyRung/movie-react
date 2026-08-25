# 04: Tidy discovery module

**What to build:** Clean up the discovery domain module in two ways. First, delete the exported `MainMovieResponseSchema` and `MainMovieResponse` type that are never imported anywhere — they are speculative generality left over from the port. Second, route the "all discovery requests failed" error in `getDiscoveryLists` through the project's `ServiceError`/`toServiceError` path instead of throwing a plain object literal, so the thrown error is a real `ServiceError` (with a `statusCode` where applicable) and `isServiceError` guards it without relying on structural coincidence. The fan-out behaviour (`Promise.allSettled`, partial success when some lists resolve) is unchanged; only the all-failed error construction changes.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] `MainMovieResponseSchema` and `MainMovieResponse` are deleted from the discovery validation module and nothing imports them
- [ ] `getDiscoveryLists`'s all-failed throw produces a value that `isServiceError` recognises as a real `ServiceError` (constructed via `toServiceError` or an explicit `ServiceError` with `statusCode`), not a plain object literal
- [ ] Partial-success behaviour is unchanged: when some discovery lists resolve, `getDiscoveryLists` still returns them rather than throwing
- [ ] `bun run lint` → `bun run fmt:check` → `bun run build` all pass, in that order
- [ ] `bun run test` passes (existing discovery tests still green; add/extend a test asserting the all-failed error is a `ServiceError` if none covers it)