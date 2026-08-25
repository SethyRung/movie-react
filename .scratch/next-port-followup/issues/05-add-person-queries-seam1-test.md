# 05: Add person queries Seam 1 unit test

**What to build:** A Vitest services unit test for the person domain query, mirroring the existing `movie/queries.test.ts` and `discovery/queries.test.ts` patterns so the person domain is exercised directly at the services seam (Seam 1) rather than only indirectly via the HTTP route test. The test mocks `globalThis.fetch` to return canned TMDB person JSON and asserts the parsed/validated return value, and asserts that a non-ok TMDB response causes `getPerson` to throw a `ServiceError`. This closes the spec's Seam 1 requirement that "the domain query functions and the tmdb seam are exercised" for every domain, including person.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] `src/services/person/queries.test.ts` exists and follows the shared `fetch-mock` helper pattern used by the other domain tests
- [ ] A passing test asserts `getPerson` returns the parsed/validated person for a mocked ok TMDB response
- [ ] A passing test asserts `getPerson` throws a `ServiceError` (guarded by `isServiceError`) for a mocked non-ok TMDB response
- [ ] A passing test asserts an invalid person shape fails validation (Zod) rather than returning bad data
- [ ] `bun run lint` → `bun run fmt:check` → `bun run build` all pass, in that order
- [ ] `bun run test` passes with the new file included
