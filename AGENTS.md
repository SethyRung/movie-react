# Agent Notes

## Quick Commands

Package manager is **bun** (`bun.lock`; `pnpm-lock.yaml` removed). Use `bun run <script>` / `bun add`.

| Action        | Command                                       |
| ------------- | --------------------------------------------- |
| Dev server    | `bun run dev` (http://localhost:5173)         |
| Build         | `bun run build` (runs `tsc -b && vite build`) |
| Preview build | `bun run preview`                             |
| Lint          | `bun run lint` / `bun run lint:fix`           |
| Format        | `bun run fmt` / `bun run fmt:check`           |

**Verification order:** `lint` → `fmt:check` → `build`. There is **no `test` script** and no test framework installed.

## Environment

- `.env` exists; required vars: `VITE_API_URL` (TMDB base, `https://api.themoviedb.org/3`) and `VITE_API_KEY` (TMDB key). See `.env.example`.
- `src/utils/env.ts` exports `envConfig` from `import.meta.env`. The axios instance (`src/utils/axios.ts`) injects `api_key` via a request interceptor.

## Build

`bun run build` passes (both `tsc -b` and `vite build`). Vite 8 uses the rolldown bundler. The build emits a chunk-size warning (~5 MB main chunk) — pre-existing, not a failure. `bun run dev` does not run `tsc -b`.

## Project Architecture

- **Frontend:** React 19 + TypeScript + Vite 8 (rolldown). **React Compiler** is enabled via `@vitejs/plugin-react`'s `reactCompilerPreset` + `@rolldown/plugin-babel` in `vite.config.ts`.
- **Styling:** Tailwind CSS **v4** — config lives in `src/assets/css/main.css` via `@theme`; **no `tailwind.config.js`**.
- **Server state:** TanStack Query v5. Configured in `main.tsx` (`QueryClient`): `staleTime` 5m, `gcTime` 10m, `refetchOnWindowFocus: false`, `retry` is a predicate that skips 4xx (except 429) using `isServiceError`.
- **Client state:** `useState` + `localStorage` (see `useWatchlist`, `useRecentSearches`). `zustand` is a listed dependency but is **unused**.
- **Routing:** React Router DOM v7. Route table in `src/router/index.tsx` (lazy-loaded pages, wrapped in `AnimatedPage`).
- **Animations:** GSAP with `ScrollTrigger`, `TextPlugin`, `ScrollSmoother`; plugins registered **globally** in `main.tsx`.

### Services layer (the TMDB seam)

There is **no service class hierarchy, no `ServiceResponse` envelope, and no service-layer cache**. The architecture is:

- `src/services/tmdb.ts` — the single deepened seam: `request<T>(config, schema): Promise<T>`. One HTTP call (via the `api` axios instance), validated against a Zod schema, throws `ServiceError` on failure.
- `src/services/error.ts` — `ServiceError` type, `toServiceError` dispatcher, `isServiceError` guard.
- Domain **query modules** (`services/{movie,discovery,person}/queries.ts`) — named functions returning `Promise<T>`. Hooks call these inside `queryFn`. TanStack Query owns cache/retry/loading/error.
  - `discovery/queries.ts`: the four list endpoints (popular/nowPlaying/upcoming/topRated) collapse into one table-driven `discoverList(kind, page)` keyed by `LIST_URLS`.
  - `person/` is a first-class domain module like the others.
- Query-key factories live in the hooks (`useMovie`, `useDiscovery`, `useSearch`, `usePerson`); they are the cache identity.
- Zod schemas + inferred types live in each domain's `validation.ts`.

See `CONTEXT.md` for the domain glossary. **Do not reintroduce** a `BaseService`/`ServiceResponse`/`ServiceCache` layer — it duplicated TanStack Query and masked bugs.

## TypeScript Quirks

- Strict mode with `noUnusedLocals` and `noUnusedParameters`.
- `verbatimModuleSyntax: true` — type-only imports must use `import type { ... }`.
- `jsx: "react-jsx"`, `moduleResolution: "bundler"`, `allowImportingTsExtensions: true`.
- `tsconfig.app.json` `types` is `["vite/client"]` only (no `"node"`) — do not use `NodeJS.*` or `process.env` in app source.
- `any` is allowed (oxlint disables `@typescript-eslint/no-explicit-any`).

## Code Style

- **Linter:** `oxlint` — config in `oxlint.config.ts`; typescript + react plugins. Disables `no-explicit-any`, `ban-types`, `no-empty-object-type`. Env: `browser` + `node`.
- **Formatter:** `oxfmt` — config in `oxfmt.config.ts`; 2-space indent, `printWidth` 100, `trailingComma` all, semi, **double quotes** (`singleQuote: false`).
- There is **one** `cn()` utility: `src/lib/utils.ts` (clsx + tailwind-merge). There is no `@/utils/cn`.

## Vite Config Gotcha

`vite.config.ts` uses `import.meta.dirname` (not `__dirname`) for the `@` alias. Vite 8 warns that `__dirname` is unsupported by `configLoader: 'native'` (planned default) — don't reintroduce it.

## Path Aliases

Only `@/*` → `./src/*` is defined, in both `vite.config.ts` and `tsconfig.app.json` (and the root `tsconfig.json` `paths`). No `@components`, `@features`, etc.

## shadcn/ui

- Install with `bunx shadcn@latest add <component>` (or `pnpm dlx shadcn@latest add ...`).
- The root `tsconfig.json` must keep `paths: { "@/*": ["./src/*"] }` so the CLI resolves `@/components/ui`; otherwise components install to the wrong location.
- `components.json` references `src/assets/css/main.css`.
- A shadcn MCP server is configured in `.mcp.json`.

## Commit Conventions

`commitlint` + `config-conventional` are listed as devDeps but there is **no config file and no git hook** — not enforced. Conventional-commits style is used by convention only (see `git log`).
