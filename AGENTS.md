# Agent Notes

## Quick Commands

Package manager is **bun**. Use `bun run <script>` / `bun add`.

| Action     | Command                                   |
| ---------- | ----------------------------------------- |
| Dev server | `bun run dev` (http://localhost:3000)     |
| Build      | `bun run build` (`next build`, Turbopack) |
| Start prod | `bun run start`                           |
| Test       | `bun run test` / `bun run test:watch`     |
| Lint       | `bun run lint` / `bun run lint:fix`       |
| Format     | `bun run fmt` / `bun run fmt:check`       |

**Verification order:** `lint` → `fmt:check` → `build`. Also run `bun run test` (Vitest: services + HTTP route seams).

## Environment

- Server-only TMDB vars in `.env.local` (gitignored): `TMDB_API_KEY` and `TMDB_API_URL` (`https://api.themoviedb.org/3`). See `.env.example` (tracked).
- **Never** prefix TMDB vars with `NEXT_PUBLIC_` and never import them in client code — the key must stay server-side. Server Components and Route Handlers read `process.env` directly.
- `@types/node` is installed; `process.env` is fine in server code.

## Project Architecture

- **Next.js 16.3.2, App Router, `src/` dir, Turbopack.** React 19 + **React Compiler** (`reactCompiler: true` in `next.config.ts`).
- **Client/server boundary:** content pages (`/`, `/movies`, `/movies/[id]`, `/genre/[id]`, `/person/[id]`, `/about`) are Server Components that call the domain query functions and pass props down. `/search` and `/watchlist` are client pages. Anything using hooks, `localStorage`, GSAP, or `next-themes` carries `"use client"`. The root `app/layout.tsx` is a server component rendering client providers.
- **TMDB seam:** `src/services/tmdb.ts` — the single deepened module crossing to TMDB. `request<T>({ path, params?, revalidate? }, schema): Promise<T>` — one server `fetch`, validated against a Zod schema, throws `ServiceError` on failure. Uses `next: { revalidate }` for caching (default 300s). This is the **only** module that knows the TMDB transport.
- **IPv4 fallback (accepted spec deviation):** `tmdbFetch` first tries the standard server `fetch`. On a `TypeError` (dual-stack connection failure in some environments) it flips an in-process `ipv4Only` flag and retries through an `undici` `Agent` forced to IPv4. This is an intentional operational deviation from the port spec's "plain server fetch" wording, kept as a runtime defence — that is why `undici` is present and why `tmdbFetch` is not a single bare `fetch`.
- **`src/services/error.ts`** — `ServiceError`, `toServiceError` (handles `HttpResponseError`, `ZodError`, timeout, network), `isServiceError`. Do not reintroduce axios.
- **Domain query modules** (`services/{movie,discovery,person}/queries.ts`) return `Promise<T>`. Zod schemas + inferred types live in each domain's `validation.ts`. `discovery/queries.ts` is table-driven: `discoverList(kind, page)` over `LIST_URLS`; `getDiscoveryLists` fans out in parallel.
- **TanStack Query is intentionally dropped.** Server pages need no client cache; the search page uses plain client fetch to `/api/search`. **Do not reintroduce** TanStack Query, and **do not reintroduce** a `BaseService`/`ServiceResponse`/`ServiceCache` layer — it duplicates the framework and masks bugs.
- **Routing:** App Router file-system routes; `next/link` for navigation. Routes: `/`, `/movies`, `/movies/[id]`, `/genre/[id]`, `/person/[id]`, `/search`, `/watchlist`, `/about`, `not-found.tsx`. The only client-reachable TMDB path is `GET /api/search`.
- **Search:** `/search` is a client page that debounces input and fetches `/api/search`. Recent searches persist in `localStorage` (`cinephil:recent-searches:v1`) with SSR-empty snapshots so hydration stays stable.
- **Watchlist:** `/watchlist` is a client page over `useWatchlist` (`localStorage` key `cinephil:watchlist:v1`, SSR-empty). Add/remove from movie cards and the movie detail hero; toast via `sonner`.
- **Animations:** GSAP with `ScrollTrigger`, `TextPlugin`, and the **premium** `ScrollSmoother` plugin. Register plugins **client-side only**; load `ScrollSmootherWrapper` and animation components via `next/dynamic` with `{ ssr: false }` or guard with `typeof window`. Never run GSAP during SSR.
- **Theming:** `next-themes` `ThemeProvider` in the root layout (`attribute="class"`, `enableSystem`, `disableTransitionOnChange`, `storageKey="cinephil-theme"`).

## Styling & UI

- **Tailwind CSS v4** via `@tailwindcss/postcss`; theme tokens/CSS variables live in `src/app/globals.css`. No `tailwind.config.js`. Prefer stock utilities over arbitrary values.
- **shadcn/ui** (Radix base, Nova preset); `components.json` is configured for this project. Add components with `bunx shadcn@latest add <component>`.
- The **one** `cn()` helper is `src/lib/utils.ts` (clsx + tailwind-merge). There is no `@/utils/cn`.

## Testing

Vitest (`vitest.config.ts`, `environment: "node"`) with `globalThis.fetch` mocked via `src/test/fetch-mock.ts`. Tests assert external behavior at two seams — not implementation details (server vs client, file structure, caching knobs).

- **Seam 1 — services:** domain query functions + the tmdb seam. Mock `fetch` to return canned TMDB JSON (or errors) and assert the parsed value or that `ServiceError` is thrown.
- **Seam 2 — HTTP routes:** render/invoke pages and `GET /api/search` with `fetch` mocked, then assert HTML (discovery sections, movie title/cast, person name, genre results) or the search JSON shape. The API response must never include `TMDB_API_KEY`.

Client-only interactions (watchlist toggle, theme, debounce, GSAP) are outside these seams.

## Tooling

- **Linter:** `oxlint` (`oxlint.config.ts`) — typescript + react + **nextjs** plugins; env browser + node. `no-explicit-any`, `ban-types`, `no-empty-object-type` are off. Ignores: `node_modules`, `.next`, `next-env.d.ts`.
- **Formatter:** `oxfmt` (`oxfmt.config.ts`) — 2-space, `printWidth` 100, `trailingComma` all, semi, **double quotes**.
- **No ESLint.** create-next-app's ESLint config/deps were removed; don't re-add them.

## TypeScript

- `tsconfig.json` is Next's generated config: strict, `moduleResolution: "bundler"`, `jsx: "react-jsx"`, `paths: { "@/*": ["./src/*"] }`.
- **Only `@/*` → `./src/*`** is defined. No `@components`, `@features`, etc. Keep `paths` so the shadcn CLI resolves `@/components/ui`.

## Domain glossary

- **TMDB** — external movie data source.
- **tmdb seam** — `src/services/tmdb.ts`. `request<T>(config, schema): Promise<T>`. The only module that knows the TMDB transport.
- **ServiceError** — `{ code, message, statusCode?, originalError? }`. Built by `toServiceError`. Guarded by `isServiceError`.
- **Movie** — `src/services/movie/`. `getCompleteMovieData`, `getSimilarMovies`, `getMovieRecommendations`, `searchMovies`. `CompleteMovieData` is a movie with credits/images/videos from `append_to_response`.
- **Discovery** — `src/services/discovery/`. `discoverList(kind, page)` is table-driven by `LIST_URLS`. `getDiscoveryLists` fans out in parallel. `getMoviesByGenre` is the genre list.
- **Person** — `src/services/person/`. `getPerson(id)`.

Services return `Promise<T>` and throw `ServiceError`. There is no `ServiceResponse` envelope.

## Conventions

- Conventional-commits style by convention only (see `git log`) — no commitlint config or hook enforces it.
- A shadcn MCP server is configured in `.mcp.json`.
