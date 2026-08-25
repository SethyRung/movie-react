# Spec: Next.js port review follow-ups

## Problem Statement

A two-axis code review of the last 20 commits (the Vite → Next.js 16 App Router port, fixed point `94cc8819`) surfaced seven P2 findings: five Standards judgement calls and two Spec gaps. None are blockers, but together they leave duplicated code, an unused exported type, an error thrown as a literal instead of a real `ServiceError`, a missing Seam 1 test for the person domain, and an undocumented deviation from the spec's "plain server fetch" wording. This set of tickets closes those findings.

## Solution

Six small, independent tracer-bullet tickets (no blocking edges between them — each can start immediately). Each is a complete, verifiable fix ending in the project's verification gate (`bun run lint` → `bun run fmt:check` → `bun run build`, plus `bun run test` where relevant).

## Findings addressed

- **Standards S1 — Duplicated Code:** per-page status/error UI blocks across home, movie list, movie detail, genre, and person pages. → ticket 01.
- **Standards S2 — Duplicated Code:** `useHasMounted` copy-pasted in `useWatchlist` and `useRecentSearches`. → ticket 02.
- **Standards S3 — Duplicated Code:** `parseMovieId`/`parsePersonId` and `isNotFoundError` duplicated across movie and person detail pages. → ticket 03.
- **Standards S4 — Speculative Generality:** unused `MainMovieResponseSchema`/`MainMovieResponse`. → ticket 04.
- **Standards S5 — ServiceError thrown as literal:** `getDiscoveryLists` throws a plain object instead of routing through `toServiceError`/`ServiceError`. → ticket 04.
- **Spec F1 — Missing Seam 1 test:** no `src/services/person/queries.test.ts`; person only exercised via the HTTP route test. → ticket 05.
- **Spec F2 — IPv4 undici fallback scope creep:** `tmdbFetch`'s IPv4 fallback is an operational deviation from the spec's plain-server-fetch wording; decision is to keep it and document it. → ticket 06.

## Out of Scope

- Any behaviour change beyond the cleanup described (this is not a re-port).
- Reintroducing axios, TanStack Query, or a `BaseService`/`ServiceResponse`/`ServiceCache` layer (still forbidden by the ADR).
- Browser e2e tests for client-only interactions (still out of scope, per the port spec).
