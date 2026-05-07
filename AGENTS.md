# Agent Notes

## Quick Commands

| Action        | Command                                    |
| ------------- | ------------------------------------------ |
| Dev server    | `pnpm dev` (http://localhost:5173)         |
| Build         | `pnpm build` (runs `tsc -b && vite build`) |
| Preview build | `pnpm preview`                             |
| Lint          | `pnpm lint` / `pnpm lint:fix`              |
| Format        | `pnpm fmt` / `pnpm fmt:check`              |

**Verification order:** `lint` → `fmt` → `build`. No `test` or `type-check` scripts exist.

## Environment

- **Node.js 18+** required; **pnpm** preferred.
- `.env` already exists with placeholder `VITE_API_KEY`. Set a real TMDB key to use the API.

## Build & Type-Check Gotchas

- **`pnpm build` currently fails at `tsc -b`** because:
  1. `src/services/base/BaseService.ts` uses `NodeJS.Timeout` and `src/services/base/cache.ts` uses `process.env.NODE_ENV`, but `tsconfig.app.json` only includes `"types": ["vite/client"]` — missing `"node"`.
  2. `src/utils/axios.ts` imports `./env`, which does not exist. It should export `envConfig` with `API_URL` and `API_KEY`.
- **`pnpm dev` works** — Vite doesn't run `tsc -b` and resolves aliases at runtime.
- `dist/` contains a **stale build** from Nov 2025.

## Project Architecture

- **Frontend:** React 19 + TypeScript + Vite 8 (bundler is rolldown).
- **Styling:** Tailwind CSS **v4** — config lives in `src/assets/css/main.css` via `@theme`; **no `tailwind.config.js`**.
- **State:** TanStack Query (server). No Zustand stores currently exist.
- **Routing:** React Router DOM v7. Routes are defined in `src/router/index.ts` (currently an empty array).
- **Animations:** GSAP with `ScrollTrigger`, `TextPlugin`, `ScrollSmoother`; plugins registered **globally** in `main.tsx`.

### Directory Layout

- `src/router/index.ts` — active route table (eager imports, currently empty).
- `src/pages/` — exists but is **empty**.
- `src/hooks/` — exists but is **empty**.
- `src/features/` — does **not** exist.
- `src/components/` — shared business components (`AppHeader`, `AppFooter`, `ScrollSmootherWrapper`).
- `src/components/ui/` — design-system primitives (only `button.tsx` currently).
- `src/services/` — API layer with a `MovieAPI` singleton exposing `.movie` and `.discovery` services.
- `src/lib/utils.ts` — `cn()` utility (clsx + tailwind-merge).
- `src/types/indext.ts` — empty file with a **typo in the filename** (`indext` not `index`).

### Gotchas

- **Only the `@` alias is defined** (in both `vite.config.ts` and `tsconfig.app.json`). No `@components`, `@features`, etc. aliases exist, despite old notes claiming otherwise.
- `src/utils/axios.ts` imports `./env`, which is missing. This file needs to be created to satisfy the build.
- `components.json` (shadcn/ui style) correctly references `src/assets/css/main.css`.
- `class-variance-authority` **is** listed in `package.json` and is used by shadcn components.
- Only **one** `cn()` utility exists: `src/lib/utils.ts`. The old duplicate at `src/utils/cn.ts` has been removed.

### Path Aliases

Defined in `vite.config.ts` and `tsconfig.app.json`:

```
"@/*": ["./src/*"]
```

No other aliases are configured. The shadcn CLI relies on the root `tsconfig.json` having `paths` to resolve `@/components/ui`. If it is missing, shadcn components install to the wrong location.

## Testing

- **No testing infrastructure is installed.** There are no `test` scripts, no `/tests/` directory, and no Vitest/Testing Library/MSW dependencies in `package.json`.

## TypeScript Quirks

- Strict mode enabled with `noUnusedLocals` and `noUnusedParameters`.
- `verbatimModuleSyntax: true` — type-only imports must use `import type { ... }`.
- `jsx: "react-jsx"`.
- `moduleResolution: "bundler"` with `allowImportingTsExtensions: true`.
- `any` is allowed in source (oxlint disables `@typescript-eslint/no-explicit-any`).

## Code Style

- **Linter:** `oxlint` — config in `oxlint.config.ts`; typescript and react plugins enabled.
- **Formatter:** `oxfmt` — config in `oxfmt.config.ts`; 2-space tabs, printWidth 100, trailingComma `all`, semi, singleQuote `false`.
- `oxlint.config.ts` disables `@typescript-eslint/no-explicit-any`, `@typescript-eslint/ban-types`, and `@typescript-eslint/no-empty-object-type`.

## shadcn/ui

- Install components with `pnpm dlx shadcn@latest add <component>`.
- The root `tsconfig.json` must define `paths` so the CLI can resolve `@/components/ui`. If components install to the wrong location, check that `tsconfig.json` contains:
  ```json
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] }
  }
  ```
