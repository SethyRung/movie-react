# CinePhil

A modern, responsive movie discovery web application built with React 19, TypeScript, and Vite. CinePhil integrates with [The Movie Database (TMDB)](https://www.themoviedb.org/) API to deliver real-time movie data, advanced search, detailed movie pages, and personalized watchlists.

## Features

- **Movie Discovery** — Browse Popular, Now Playing, Upcoming, and Top Rated movies
- **Advanced Search** — Search movies by title with recent search history
- **Detailed Movie Pages** — View cast, videos, production details, similar movies, and recommendations
- **Genre Filtering** — Explore movies by genre
- **Personal Watchlist** — Save movies to a local watchlist with quick add/remove
- **Dark Mode** — Automatic and manual theme switching with persistence
- **Responsive Design** — Fully optimized for mobile, tablet, and desktop
- **PWA Ready** — Includes web app manifest for installable experience
- **Accessibility** — Keyboard navigation, focus states, reduced-motion support, and WCAG-compliant touch targets
- **Smooth Animations** — GSAP-powered page transitions, scroll reveals, and hover interactions

## Tech Stack

| Category         | Technology                                       |
| ---------------- | ------------------------------------------------ |
| Framework        | React 19                                         |
| Language         | TypeScript 6                                     |
| Bundler          | Vite 8 (Rolldown)                                |
| Styling          | Tailwind CSS v4                                  |
| UI Components    | shadcn/ui + Radix UI                             |
| State Management | TanStack Query (server), Zustand (client)        |
| Routing          | React Router DOM v7                              |
| Animations       | GSAP (ScrollTrigger, TextPlugin, ScrollSmoother) |
| Icons            | Iconify (offline bundles)                        |
| Linting          | oxlint                                           |
| Formatting       | oxfmt                                            |

## Getting Started

### Prerequisites

- **Node.js 18+**
- **pnpm** (preferred package manager)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd movie-react

# Install dependencies
pnpm install

# Set up environment variables
cp .env .env.local
# Edit .env.local and add your TMDB API key
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_API_URL=https://api.themoviedb.org/3
VITE_API_KEY=your_tmdb_api_key_here
```

> Get a free TMDB API key at [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)

### Development

```bash
# Start the development server
pnpm dev
```

The application will be available at `http://localhost:5173`.

### Build

```bash
# Type-check and build for production
pnpm build

# Preview the production build
pnpm preview
```

## Available Scripts

| Script           | Description                         |
| ---------------- | ----------------------------------- |
| `pnpm dev`       | Start development server            |
| `pnpm build`     | Type-check and build for production |
| `pnpm preview`   | Preview the production build        |
| `pnpm lint`      | Run oxlint for code quality         |
| `pnpm lint:fix`  | Auto-fix linting issues             |
| `pnpm fmt`       | Format code with oxfmt              |
| `pnpm fmt:check` | Check code formatting               |

## Project Structure

```
├── public/                 # Static assets & PWA manifest
├── src/
│   ├── assets/css/         # Global styles & Tailwind theme
│   ├── components/
│   │   ├── animations/     # GSAP animation wrappers
│   │   ├── layout/         # Page containers
│   │   ├── movie/          # Movie-specific components (cards, carousels, cast, etc.)
│   │   ├── search/         # Search bar & results
│   │   └── ui/             # shadcn/ui primitives & design system
│   ├── hooks/              # Custom React hooks (data fetching, theme, watchlist)
│   ├── lib/                # Utility functions (cn, etc.)
│   ├── pages/              # Route-level page components
│   ├── router/             # Route definitions
│   ├── services/           # API layer (TMDB services, caching, error handling)
│   ├── types/              # Shared TypeScript types
│   └── utils/              # Environment config & axios instances
├── docs/                   # Documentation (REDESIGN_PLAN.md)
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── oxlint.config.ts
```

## Architecture Highlights

- **Service Layer** — `BaseService` provides typed HTTP requests with automatic caching, retry logic, and Zod validation
- **TanStack Query** — All server state is managed via React Query with sensible defaults (5min stale time, 10min GC time)
- **Path Aliases** — `@/*` maps to `src/*` in both Vite and TypeScript
- **shadcn/ui** — Components are installed via the shadcn CLI into `src/components/ui`
- **No `tailwind.config.js`** — Tailwind v4 configuration lives in `src/assets/css/main.css` via `@theme`

## API

This project uses the [TMDB API v3](https://developer.themoviedb.org/reference/intro/getting-started). All requests are authenticated via the `api_key` query parameter injected by an Axios interceptor.

## License

MIT
