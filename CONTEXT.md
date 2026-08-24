# Domain Glossary

The vocabulary used across the services seam. Architecture terms (module, interface, seam, depth, locality, leverage) live in the codebase-design vocabulary, not here.

## TMDB

The external data source. All domain data (movies, people, discovery lists) is fetched from the TMDB HTTP API.

## tmdb seam

`src/services/tmdb.ts` — the single deepened module that crosses the boundary to TMDB. Its interface is `request<T>(config, schema): Promise<T>`: one HTTP call, validated against a Zod schema, throwing `ServiceError` on failure. Every domain query function goes through this seam. It is the only place that knows about axios + the `api` axios instance (`src/utils/axios.ts`).

## ServiceError

The typed error thrown across the tmdb seam. `{ code, message, statusCode?, originalError? }`. Constructed by `toServiceError` from any thrown value (AxiosError, ZodError, timeout, network). Guarded by `isServiceError`. Retry policy (in `main.tsx`) reads `statusCode` to skip retrying 4xx except 429.

## Movie

A film. Domain module at `src/services/movie/`. Query functions (`getCompleteMovieData`, `getSimilarMovies`, `getMovieRecommendations`, `searchMovies`) live in `queries.ts`; Zod schemas + inferred types in `validation.ts`. `CompleteMovieData` is a movie with credits/images/videos appended in a single TMDB call (`append_to_response`).

## Discovery

Browsing movies without a specific title: popular, now playing, upcoming, top rated, by genre. Domain module at `src/services/discovery/`. The four list endpoints differ only by URL, so `discoverList(kind, page)` is table-driven by `LIST_URLS`. `getDiscoveryLists` fans out to all four in parallel.

## Person

A cast/crew member. Domain module at `src/services/person/`. Routed through the tmdb seam like the others (previously bypassed it via raw axios — now consolidated).

## Query keys

TanStack Query owns the cache, retries, loading, and error state. Query-key factories live in the hooks (`useMovie`, `useDiscovery`, `useSearch`, `usePerson`) and are the cache identity. There is no separate service-layer cache.

## Decisions

- The service layer returns `Promise<T>` and throws `ServiceError`. There is no `ServiceResponse` envelope — TanStack Query is the only state envelope.
- One adapter (axios in prod) justifies the seam; no second adapter exists. A second adapter would be the point at which `request`'s interface is worth abstracting further.