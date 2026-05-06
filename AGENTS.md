# Agent Notes

## Quick Commands

| Action        | Command                                    |
| ------------- | ------------------------------------------ |
| Dev server    | `pnpm dev` (http://localhost:5173)         |
| Build         | `pnpm build` (runs `tsc -b && vite build`) |
| Preview build | `pnpm preview`                             |
| Lint          | `pnpm lint` / `pnpm lint:fix`              |
| Format        | `pnpm fmt` / `pnpm fmt:check`              |

**Verification order:** `lint` → `fmt` → `build`. There is no separate `type-check` or `test` script.

## Environment

- **Node.js 18+** required; **pnpm** preferred.
- Copy `.env.example` to `.env` and set `VITE_API_URL` and `VITE_API_KEY` (TMDB key).

## Build & Type-Check Gotchas

- **`pnpm build` currently fails** because `babel-plugin-react-compiler` is missing. It is required by `@rolldown/plugin-babel` + `reactCompilerPreset()` in `vite.config.ts`.
- **`tsc -b` currently fails** because `tsconfig.app.json` lacks `paths`, so many alias imports (e.g., `@components/AppHeader`, `@features/movies`) are unresolved.
- **`pnpm dev` works** — the dev server does not run the Babel production transform and Vite resolves aliases at runtime.

## Project Architecture

- **Frontend:** React 19 + TypeScript + Vite 8 (bundler is rolldown).
- **Styling:** Tailwind CSS **v4** — config lives in `src/assets/styles/main.css` via `@theme`; **no `tailwind.config.js`**.
- **State:** Zustand (client) + TanStack Query (server).
- **Routing:** React Router DOM v7.
- **Animations:** GSAP with `ScrollTrigger`, `TextPlugin`, `ScrollSmoother`; plugins registered **globally** in `main.tsx`.

### Directory Layout

- `src/features/movies/` — primary feature module (components, hooks, stores, types).
- `src/components/ui/` — design-system primitives (Button, Input, Modal, Loading, etc.).
- `src/components/` — shared business components (AppHeader, AppFooter, Search, carousel, tabs).
- `src/pages/Home/HomePage.tsx` — real homepage entrypoint.
- `src/services/` — API layer with a `movieAPI` singleton exposing `.movie` and `.discovery` services.
- `src/routes.tsx` — active route table (eager imports).
- `src/lib/utils.ts` — `cn()` (clsx + tailwind-merge) and `mergeUI()` for merging Tailwind classes in props.

### Gotchas

- `src/pages/index.tsx` is an **orphaned legacy file**; the router imports from `@pages/Home`, so edits there have no effect.
- `src/routes/lazy.tsx` exists but is **unused** in the current app. All routes are eagerly loaded from `src/routes.tsx`.
- `components.json` (shadcn/ui style) references `src/index.css`, but the actual global stylesheet is **`src/assets/styles/main.css`**.
- **Two `cn()` utilities exist:** `src/lib/utils.ts` (used by shadcn components via `@/lib/utils`) and `src/utils/cn.ts` (legacy/duplicate). Prefer `src/lib/utils.ts` for new UI work.
- `class-variance-authority` is imported in `src/components/ui/*` but is **not listed in `package.json`**.

### Path Aliases

Defined in `vite.config.ts`:
`@`, `@components`, `@features`, `@pages`, `@hooks`, `@types`, `@utils`, `@assets`, `@tests`, `@lib`

**Caveats:**

- `tsconfig.app.json` does **not** define `paths`, so `tsc -b` cannot resolve most aliases. Code uses both `@components/X` and `@/components/X` styles inconsistently.
- `@tests` resolves to `src/tests/` which **does not exist**.
- `@lib` is defined in Vite but missing from `tsconfig.app.json` and is unused in the codebase.

## Testing

- **No testing infrastructure is installed.** There are no `test`, `test:ui`, or `test:coverage` scripts, no `/tests/` directory, and no Vitest/Testing Library/MSW dependencies in `package.json`.

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
