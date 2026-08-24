# Spec: Port movie-react to Next.js (App Router)

## Problem Statement

As the maintainer of movie-react, I have a React 19 + Vite single-page app that browses TMDB content (movies, discovery lists, people, search, a localStorage watchlist). The TMDB API key is shipped to every browser (`VITE_API_KEY` is `NEXT_PUBLIC`-equivalent by necessity in Vite), there is no server-side rendering or SEO, first paint waits on client-side data fetching, and the react-router + TanStack Query architecture cannot leverage server components. I want the same UX delivered on Next.js so the TMDB key stays server-side, content pages render on the server, and the app gains Next's routing/rendering model — without regressing any existing feature.

## Solution

Port the app to Next.js 16 App Router. The TMDB boundary (the tmdb seam) moves server-side: it uses `fetch` with a server-only `TMDB_API_KEY` (no `NEXT_PUBLIC_` prefix) and Next's fetch caching (`revalidate`). Content-browsing pages (`/`, `/movies`, `/movies/:id`, `/genre/:genreId`, `/person/:personId`) become Server Components that call the domain query functions directly and pass data to client components for interactive bits. Search becomes a client page that debounces and calls a `/api/search` Route Handler (the only client-reachable TMDB path). Watchlist stays a client page over `localStorage`. Theming uses `next-themes`; GSAP animations (including the premium `ScrollSmoother`) load client-only via dynamic imports with `ssr: false`. TanStack Query is dropped — server pages have no client cache, and the search page uses plain client fetch. The toolchain stays `bun` + `oxlint`/`oxfmt` + Tailwind v4 + shadcn (Radix, Nova preset).

## User Stories

1. As a visitor, I want the home page to show popular, now playing, upcoming, and top-rated discovery lists rendered on the server, so that it loads fast and is indexable.
2. As a visitor, I want to browse the popular movies list with category tabs (popular / now playing / upcoming / top rated), so that I can explore different discovery categories.
3. As a visitor, I want to paginate through a discovery list, so that I can see more than the first page of results.
4. As a visitor, I want to open a movie detail page and see its hero, metadata, cast, videos, and images, so that I can learn about a specific movie.
5. As a visitor, I want to see similar movies and recommendations on a movie detail page, so that I can discover related titles.
6. As a visitor, I want to browse movies by genre, so that I can find titles in a category I like.
7. As a visitor, I want to paginate through a genre's movies, so that I can see more titles in that genre.
8. As a visitor, I want to open a person detail page and see their biography, birth/death info, and known-for department, so that I can learn about a cast/crew member.
9. As a visitor, I want to search for movies by title with debounced input, so that I get live results without pressing enter.
10. As a visitor, I want my recent searches remembered across reloads, so that I can quickly re-run a previous search.
11. As a visitor, I want to add movies to and remove movies from a watchlist that persists in my browser, so that I can track titles to watch later.
12. As a visitor, I want to view my watchlist on a dedicated page, so that I can see the titles I have saved.
13. As a visitor, I want an empty state on the watchlist page when I have no saved movies, so that I am guided to browse.
14. As a visitor, I want to read an about page, so that I can learn about the project.
15. As a visitor, I want a styled not-found page when I hit an unknown URL, so that I am not shown a raw error.
16. As a visitor, I want to toggle between light and dark themes, so that I can use the site comfortably in any lighting.
17. As a visitor, I want my theme preference remembered across reloads, so that the site loads in my chosen theme without a flash.
18. As a visitor, I want smooth scrolling and scroll-triggered animations, so that the experience feels polished.
19. As a visitor, I want a skip-to-content link, so that I can navigate accessibly by keyboard.
20. As a visitor, I want a header with navigation and a footer with site info, so that I can move between pages and see attribution.
21. As a visitor, I want toast notifications for actions, so that I get feedback when I add/remove a watchlist item.
22. As a visitor, I want the TMDB API key to never appear in my browser's network traffic or bundle, so that the key stays secret.
23. As a visitor, I want a movie detail page to be crawlable with correct metadata, so that links to it render rich previews.
24. As a visitor, I want loading states while data is being fetched on client pages, so that I know the app is working.
25. As a visitor, I want graceful error states when a TMDB request fails (not found, rate limited, network), so that I see a helpful message instead of a crash.
26. As a maintainer, I want the TMDB boundary to remain a single deepened seam with Zod validation and `ServiceError`, so that the architecture stays consistent with the existing ADR.
27. As a maintainer, I want the domain query modules (movie, discovery, person) to keep their current interfaces, so that the port touches the transport not the domain.
28. As a maintainer, I want the app to build and type-check cleanly under Next's TypeScript config, so that CI stays green.
29. As a maintainer, I want `bun run lint` and `bun run fmt:check` to pass, so that style is enforced as before.
30. As a maintainer, I want the legacy Vite source retained as a reference during the port, so that I can compare behavior.
31. As a maintainer, I want the project docs (AGENTS.md, README.md) to describe the Next architecture when the port is done, so that future agents have accurate context.

## Implementation Decisions

- **Routing:** React Router DOM is replaced by the App Router file-system routes. The route table maps 1:1: `/`, `/movies`, `/movies/[id]`, `/genre/[id]`, `/person/[id]`, `/search`, `/watchlist`, `/about`, and `not-found.tsx`. `react-router-dom` `<Link>` becomes `next/link` `<Link>`.
- **tmdb seam (transport change):** `src/services/tmdb.ts` `request<T>(config, schema)` keeps its single-call + Zod-validate + throw-`ServiceError` contract. The config shape changes from an axios request config to `{ path, params?, revalidate? }`. The adapter changes from axios to server `fetch` against `TMDB_API_URL` with `TMDB_API_KEY` injected as `api_key`, and `next: { revalidate }` for caching. This is the only module that knows about the TMDB transport. The existing ADR holds: no `BaseService`/`ServiceResponse`/`ServiceCache` layer, services return `Promise<T>` and throw `ServiceError`.
- **ServiceError:** `toServiceError` is retargeted from `AxiosError` to fetch-era failures: `HttpResponseError` (non-ok response, carries TMDB `status_message`), `ZodError` (validation), `DOMException` TimeoutError, `TypeError` (network), and a fallback. `isServiceError` and the `ServiceError` shape are unchanged.
- **Domain query modules:** `movie`, `discovery`, `person` `queries.ts` port with the single mechanical change of `url` → `path` in their `request` calls. `validation.ts` (Zod schemas + inferred types) ports verbatim. `discoverList(kind, page)` stays table-driven by `LIST_URLS`; `getDiscoveryLists` keeps its parallel fan-out with `allSettled`.
- **Environment:** Server-only `TMDB_API_KEY` and `TMDB_API_URL` in `.env.local` (gitignored). `.env.example` is tracked. No `NEXT_PUBLIC_` TMDB vars exist. Server components and route handlers read `process.env` directly; no client code may import the key.
- **Client/server boundary:** `Home`, `MovieList`, `MovieDetail`, `Genre`, `PersonDetail` are Server Components. They await the relevant domain query and pass plain props to presentational components. Components that use hooks (`useState`, `useEffect`, `useRef`, GSAP, `next-themes`, `localStorage`) carry `"use client"`. The root layout is a Server Component that renders client providers (`ThemeProvider`, `Toaster`, `ScrollSmootherWrapper`).
- **Search:** A `/api/search` Route Handler calls `searchMovies` server-side and returns JSON; the `/search` page is a client component that debounces input and fetches `/api/search`. Recent searches persist via `localStorage` with `typeof window` SSR guards.
- **Watchlist:** `/watchlist` is a client component over the ported `useWatchlist` hook (`localStorage` + SSR guards). Toast feedback via `sonner`.
- **TanStack Query:** Dropped. Server pages need no client cache; the search page uses plain client fetch + local state. `useMovie`/`useDiscovery`/`usePerson` hooks are retired (their work moves into server components). `useSearch` is replaced by the client search page's own state.
- **Theming:** `next-themes` `ThemeProvider` in the root layout (`attribute="class"`, `enableSystem`, `disableTransitionOnChange`) with the existing theme toggle. CSS variables live in `globals.css` (shadcn Nova).
- **GSAP / animations:** `ScrollSmoother` (premium plugin), `ScrollTrigger`, `TextPlugin`, and `@gsap/react`'s `useGSAP` are registered client-side only. `ScrollSmootherWrapper` and any animation components are loaded via `next/dynamic` with `{ ssr: false }` or guarded with `typeof window` / `useIsomorphicLayoutEffect`. `AnimatedPage` page transitions are implemented via a client transition wrapper in the layout/template layer.
- **Scroll-to-top:** The `useScrollToTop` behavior is handled at the layout level (scroll restoration on route change) rather than a global hook in `main.tsx`.
- **shadcn/ui:** Re-initialized for Next (Radix base, Nova preset). Components port across as client components where they use Radix/hooks; `@/*` alias preserved. New components are added via the shadcn CLI as needed by each page.
- **Tooling:** `bun` (scripts: `dev`/`build`/`start`/`lint`/`lint:fix`/`fmt`/`fmt:check`), `oxlint` (typescript + react + nextjs plugins), `oxfmt` (2-space, double-quote, `printWidth 100`). ESLint is not used. The `legacy/` directory is excluded from `tsconfig` and both linters.
- **Legacy reference:** The old Vite source lives in `./legacy/` (untracked, excluded from build/lint) as a behavior reference; removed at the end of the port.

## Testing Decisions

- **What makes a good test here:** tests assert external behavior only — inputs and outputs at the seam — never implementation details (server vs client component, file structure, fetch vs axios, caching knobs). A test should survive the port being restructured internally.
- **Seam 1 — services unit tests (Vitest):** the domain query functions and the tmdb seam are exercised by calling them with `globalThis.fetch` mocked to return canned TMDB-shaped JSON (and error responses), then asserting on the parsed/validated return value and that `ServiceError` is thrown for non-ok responses and invalid shapes. This locks the Zod schemas and the `ServiceError` mapping at the domain boundary.
- **Seam 2 — HTTP route tests (Vitest):** pages and the `/api/search` Route Handler are exercised by rendering/invoking them with `fetch` mocked, then asserting on the rendered HTML (key content per route: discovery sections on `/`, movie title/cast on `/movies/:id`, person name on `/person/:id`, genre results on `/genre/:id`) and the `/api/search` JSON shape. This is the highest seam that captures routing + SSR + data wiring without a browser.
- **Prior art:** none — the repo has no existing tests and no test framework. This spec introduces Vitest as the first test dependency and establishes the fetch-mock pattern both seams share.
- **Out of these seams:** client-only interactions (watchlist add/remove, theme toggle, debounced search behavior, GSAP animations) are not covered by the two Vitest seams; they are verified via the dev loop / browser during implementation and noted as a follow-up browser-seam if desired.

## Out of Scope

- Browser e2e / interaction tests (Playwright) for watchlist toggle, theme toggle, and debounce — the chosen Vitest seams don't reach client-only state; a future browser seam may add these.
- Visual regression / screenshot tests.
- Core Web Vitals / performance optimization beyond what SSR naturally improves.
- Changing the TMDB domain model or Zod schemas (they port verbatim).
- Real (non-mocked) TMDB integration tests in CI.
- Migrating git history or changing the remote.
- Adding new product features; this is a behavior-preserving port.

## Further Notes

- The Next.js scaffold, server-side tmdb seam, `ServiceError` retarget, shadcn re-init, env files, and tooling swap are already complete as the foundation for this spec; the work remaining is the route-by-route port described in the linked tickets.
- The tmdb seam's transport change (axios → fetch) is the one wide-ish refactor, but its blast radius is contained to `tmdb.ts`, `error.ts`, and the `url`→`path` edits in the three `queries.ts` files — already landed — so no expand/contract sequencing is needed.
- Domain glossary vocabulary (TMDB, tmdb seam, ServiceError, Movie, Discovery, Person, CompleteMovieData, discoverList, getDiscoveryLists) is used throughout and is preserved by the port.
