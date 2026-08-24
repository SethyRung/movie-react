# Agent Notes

## Quick Commands

Package manager is **bun**. Use `bun run <script>` / `bun add`.

| Action     | Command                                   |
| ---------- | ----------------------------------------- |
| Dev server | `bun run dev` (http://localhost:3000)     |
| Build      | `bun run build` (`next build`, Turbopack) |
| Start prod | `bun run start`                           |
| Lint       | `bun run lint` / `bun run lint:fix`       |
| Format     | `bun run fmt` / `bun run fmt:check`       |

**Verification order:** `lint` → `fmt:check` → `build`. There is **no `test` script yet** — Vitest is planned (see `.scratch/next-port/`), not installed.

## Environment

- Server-only TMDB vars in `.env.local` (gitignored): `TMDB_API_KEY` and `TMDB_API_URL` (`https://api.themoviedb.org/3`). See `.env.example` (tracked).
- **Never** prefix TMDB vars with `NEXT_PUBLIC_` and never import them in client code — the key must stay server-side. Server components and Route Handlers read `process.env` directly.
- `@types/node` is installed; `process.env` is fine in server code.

## Project Architecture

- **Next.js 16.3.2, App Router, `src/` dir, Turbopack.** React 19 + **React Compiler** (`reactCompiler: true` in `next.config.ts`).
- **Client/server boundary:** content pages (`/`, `/movies`, `/movies/[id]`, `/genre/[id]`, `/person/[id]`) are Server Components that call the domain query functions and pass props down. Anything using hooks, `localStorage`, GSAP, or `next-themes` carries `"use client"`. The root `app/layout.tsx` is a server component rendering client providers.
- **TMDB seam:** `src/services/tmdb.ts` — the single deepened module crossing to TMDB. `request<T>({ path, params?, revalidate? }, schema): Promise<T>` — one server `fetch`, validated against a Zod schema, throws `ServiceError` on failure. Uses `next: { revalidate }` for caching (default 300s). This is the **only** module that knows the TMDB transport.
- **`src/services/error.ts`** — `ServiceError`, `toServiceError` (handles `HttpResponseError`, `ZodError`, timeout, network), `isServiceError`. The legacy axios/AxiosError mapping is gone; do not reintroduce axios.
- **Domain query modules** (`services/{movie,discovery,person}/queries.ts`) return `Promise<T>`. Zod schemas + inferred types live in each domain's `validation.ts`. `discovery/queries.ts` is table-driven: `discoverList(kind, page)` over `LIST_URLS`; `getDiscoveryLists` fans out in parallel.
- **TanStack Query is intentionally dropped.** Server pages need no client cache; the search page uses plain client fetch to `/api/search`. **Do not reintroduce** TanStack Query, and **do not reintroduce** a `BaseService`/`ServiceResponse`/`ServiceCache` layer — it duplicates the framework and masks bugs.
- **Routing:** App Router file-system routes; `next/link` for navigation. The old `react-router-dom` route table is gone.
- **Animations:** GSAP with `ScrollTrigger`, `TextPlugin`, and the **premium** `ScrollSmoother` plugin. Register plugins **client-side only**; load `ScrollSmootherWrapper` and animation components via `next/dynamic` with `{ ssr: false }` or guard with `typeof window`. Never run GSAP during SSR.
- **Theming:** `next-themes` `ThemeProvider` in the root layout (`attribute="class"`, `enableSystem`).

## Styling & UI

- **Tailwind CSS v4** via `@tailwindcss/postcss`; theme tokens/CSS variables live in `src/app/globals.css`. No `tailwind.config.js`.
- **shadcn/ui** (Radix base, Nova preset); `components.json` is configured for this project. Add components with `bunx shadcn@latest add <component>`.
- The **one** `cn()` helper is `src/lib/utils.ts` (clsx + tailwind-merge). There is no `@/utils/cn`.

## Tooling

- **Linter:** `oxlint` (`oxlint.config.ts`) — typescript + react + **nextjs** plugins; env browser + node. `no-explicit-any`, `ban-types`, `no-empty-object-type` are off. Ignores: `node_modules`, `.next`, `next-env.d.ts`, `legacy`.
- **Formatter:** `oxfmt` (`oxfmt.config.ts`) — 2-space, `printWidth` 100, `trailingComma` all, semi, **double quotes**.
- **No ESLint.** create-next-app's ESLint config/deps were removed; don't re-add them.

## TypeScript

- `tsconfig.json` is Next's generated config: strict, `moduleResolution: "bundler"`, `jsx: "react-jsx"`, `paths: { "@/*": ["./src/*"] }`.
- **Only `@/*` → `./src/*`** is defined. No `@components`, `@features`, etc. Keep `paths` so the shadcn CLI resolves `@/components/ui`.
- `legacy/` is in `tsconfig` `exclude` — it is the old Vite source kept as a **reference only** and must stay excluded from build and lint.

## Port in Progress

- This repo is mid-port from Vite to Next.js. The plan lives in `.scratch/next-port/spec.md` with tickets under `.scratch/next-port/issues/`.
- `legacy/` is the unmodified Vite app for behavior reference — do not edit, lint, or build it. It is removed in the final ticket.
- Domain glossary (TMDB, tmdb seam, ServiceError, Movie, Discovery, Person, CompleteMovieData, discoverList, getDiscoveryLists) is preserved by the port; the prose version is in `legacy/CONTEXT.md` until cleanup.

## Conventions

- Conventional-commits style by convention only (see `git log`) — no commitlint config or hook enforces it.
- A shadcn MCP server is configured in `.mcp.json`.
