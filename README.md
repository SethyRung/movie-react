# movie-react

A TMDB movie browser built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4. Browse discovery lists, movie details, cast, search, and a local watchlist — with server-side rendering and a secret TMDB API key.

## Features

- **Discovery** — popular, now playing, upcoming, and top-rated lists (home + `/movies`)
- **Movie details** — hero, cast, videos, stills, similar titles, and recommendations
- **Browse by genre** — paginated genre listings
- **Person pages** — cast/crew biographies
- **Search** — debounced movie search via a server Route Handler
- **Watchlist** — persisted in `localStorage`, with toast feedback
- **About** — project notes and TMDB attribution
- **Theming** — light/dark via `next-themes`, no flash
- **Animations** — GSAP `ScrollSmoother` + scroll-triggered motion

## Tech stack

| Area       | Choice                                                 |
| ---------- | ------------------------------------------------------ |
| Framework  | Next.js 16.3.2 (App Router, Turbopack)                 |
| UI         | React 19, TypeScript, Tailwind CSS v4                  |
| Components | shadcn/ui (Radix, Nova preset)                         |
| Animations | GSAP (`ScrollSmoother`, `ScrollTrigger`, `TextPlugin`) |
| Theming    | `next-themes`                                          |
| Validation | Zod (TMDB response schemas)                            |
| Tests      | Vitest (mocked `fetch`, services + HTTP route seams)   |
| Tooling    | `bun`, `oxlint`, `oxfmt` (no ESLint)                   |
| Compiler   | React Compiler (`reactCompiler: true`)                 |

## Getting started

### Prerequisites

- [bun](https://bun.sh) 1.4+
- A [TMDB API key](https://developer.themoviedb.org/docs)

### Install

```bash
bun install
```

### Environment

Copy the example and add your TMDB key:

```bash
cp .env.example .env.local
```

```env
TMDB_API_URL=https://api.themoviedb.org/3
TMDB_API_KEY=your_tmdb_key
```

The key is **server-only** — never prefix it with `NEXT_PUBLIC_` and never import it in client code.

### Run

```bash
bun run dev
```

Open http://localhost:3000.

## Scripts

| Script       | Description                                |
| ------------ | ------------------------------------------ |
| `dev`        | Start the dev server (port 3000)           |
| `build`      | Production build (`next build`, Turbopack) |
| `start`      | Run the production build                   |
| `test`       | Run Vitest once                            |
| `test:watch` | Run Vitest in watch mode                   |
| `lint`       | Lint with `oxlint`                         |
| `lint:fix`   | Lint and auto-fix                          |
| `fmt`        | Format with `oxfmt`                        |
| `fmt:check`  | Check formatting without writing           |

**Verification order:** `lint` → `fmt:check` → `build`. Also run `bun run test`.

## Project structure

```
src/
  app/                 App Router: layout, pages, /api/search, not-found
  services/            TMDB seam + domain query modules
    tmdb.ts            Server fetch + Zod validation (the only TMDB transport)
    error.ts           ServiceError / toServiceError / isServiceError
    movie/             Movie queries + Zod schemas
    discovery/         Discovery list + genre queries
    person/            Person queries + schemas
  lib/                 cn(), image helpers, genre/search/discovery URLs
  hooks/               useWatchlist, useRecentSearches
  components/          UI + feature components
  test/                fetch mock, fixtures, Vitest setup
```

Path alias: `@/*` → `./src/*`.

## Architecture

- **Server-side TMDB seam.** `src/services/tmdb.ts` is the single module that talks to TMDB: one server `fetch`, Zod-validated, throwing `ServiceError` on failure. Cached with Next `fetch` `revalidate` (default 300s).
- **Server Components** for content pages (`/`, `/movies`, `/movies/[id]`, `/genre/[id]`, `/person/[id]`, `/about`) call domain query functions and pass props to presentational components.
- **`GET /api/search`** is the only client-reachable TMDB path. `/search` debounces and fetches it. The key never appears in the JSON body.
- **Client components** (`"use client"`) wrap hooks, `localStorage` (watchlist, recent searches), `next-themes`, and GSAP. `ScrollSmoother` loads via `next/dynamic` with `{ ssr: false }`.
- **No TanStack Query** and no `BaseService`/`ServiceResponse`/`ServiceCache` layer.
- **Tests** mock `globalThis.fetch` and assert at two seams: domain queries/`ServiceError`, and rendered route HTML / search JSON.

## License

See [LICENSE](./LICENSE).
