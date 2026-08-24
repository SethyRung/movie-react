# movie-react

A TMDB movie browser built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4. Browse discovery lists, movie details, cast, search, and a local watchlist — with server-side rendering and a secret TMDB API key.

## Features

- **Discovery** — popular, now playing, upcoming, and top-rated lists (home + `/movies`)
- **Movie details** — hero, cast, videos, similar titles, and recommendations
- **Browse by genre** — paginated genre listings
- **Person pages** — cast/crew biographies
- **Search** — debounced movie search via a server Route Handler
- **Watchlist** — persisted in `localStorage`, with toast feedback
- **Theming** — light/dark via `next-themes`, no flash
- **Animations** — GSAP `ScrollSmoother` + scroll-triggered reveals

## Tech stack

| Area       | Choice                                                 |
| ---------- | ------------------------------------------------------ |
| Framework  | Next.js 16.3.2 (App Router, Turbopack)                 |
| UI         | React 19, TypeScript, Tailwind CSS v4                  |
| Components | shadcn/ui (Radix, Nova preset)                         |
| Animations | GSAP (`ScrollSmoother`, `ScrollTrigger`, `TextPlugin`) |
| Theming    | `next-themes`                                          |
| Validation | Zod (TMDB response schemas)                            |
| Tooling    | `bun`, `oxlint`, `oxfmt` (no ESLint)                   |
| Compiler   | React Compiler (`reactCompiler: true`)                 |

## Getting started

### Prerequisites

- Node.js 20+
- [bun](https://bun.sh) 1.4+
- A [TMDB API key](https://developer.themoviedb.org/docs)

### Install

```bash
bun install
```

### Environment

Copy the example and add your TMDB key:

```bash
cp .env.example .env
```

```env
TMDB_API_URL=https://api.themoviedb.org/3
TMDB_API_KEY=your_tmdb_key
```

The key is **server-only** — it is never prefixed with `NEXT_PUBLIC_` and never reaches the browser.

### Run

```bash
bun run dev
```

Open http://localhost:3000.

## Scripts

| Script      | Command             | Description                      |
| ----------- | ------------------- | -------------------------------- |
| `dev`       | `bun run dev`       | Start the dev server (port 3000) |
| `build`     | `bun run build`     | Production build (`next build`)  |
| `start`     | `bun run start`     | Run the production build         |
| `lint`      | `bun run lint`      | Lint with `oxlint`               |
| `lint:fix`  | `bun run lint:fix`  | Lint and auto-fix                |
| `fmt`       | `bun run fmt`       | Format with `oxfmt`              |
| `fmt:check` | `bun run fmt:check` | Check formatting without writing |

**Verification order:** `lint` → `fmt:check` → `build`.

## Project structure

```
src/
  app/            App Router: layout, pages, globals.css
  services/       TMDB seam + domain query modules
    tmdb.ts       Server fetch + Zod validation (the only TMDB transport)
    error.ts      ServiceError / toServiceError / isServiceError
    movie/        Movie queries + Zod schemas
    discovery/    Discovery list queries + schemas
    person/       Person queries + schemas
  lib/            cn() utility
  components/     UI + feature components
```

Path alias: `@/*` → `./src/*`.

## Architecture

- **Server-side TMDB seam.** `src/services/tmdb.ts` is the single module that crosses to TMDB: one server `fetch`, validated against a Zod schema, throwing `ServiceError` on failure. Responses are cached via Next's `fetch` `revalidate` option.
- **Server Components** for content pages (`/`, `/movies`, `/movies/[id]`, `/genre/[id]`, `/person/[id]`) call the domain query functions directly and pass props to client components for interactivity.
- **`/api/search`** is the only client-reachable path to TMDB; the `/search` page debounces and fetches it.
- **Client components** (`"use client"`) wrap anything using hooks, `localStorage` (watchlist, recent searches), `next-themes`, or GSAP. `ScrollSmoother` loads via `next/dynamic` with `{ ssr: false }`.
- **No TanStack Query** — server pages render on the server; the search page uses plain client fetch.

## License

See [LICENSE](./LICENSE).
