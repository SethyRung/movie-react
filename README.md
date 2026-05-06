# Movie Website - React 🎬

A modern movie discovery application built with React 19, TypeScript, and Vite. It integrates with The Movie Database (TMDB) API to deliver real-time movie data, search, and detailed information.

## Live Demo 🚀

https://sethyrung-movie-react.vercel.app/

## Features ✨

- **🎬 Movie Discovery**: Browse popular, now playing, and upcoming movies
- **🔍 Advanced Search**: Real-time movie search with intelligent filtering
- **📖 Detailed Movie Information**: Comprehensive movie pages with synopsis, cast, crew, ratings, and trailers
- **🎭 Cast & Crew Details**: Explore actor profiles and filmography
- **🎨 Movie Galleries**: High-quality movie posters and backdrop images
- **📱 Responsive Design**: Optimized for all devices with mobile-first approach

## Tech Stack 🛠️

- **React 19** + **TypeScript 6**
- **Vite 8** (bundler: rolldown)
- **Tailwind CSS v4** — config lives in `src/assets/styles/main.css` via `@theme`; no `tailwind.config.js`
- **React Router DOM v7**
- **TanStack Query** — server state management and caching
- **Zustand** — client state management
- **GSAP** — animations (`ScrollTrigger`, `TextPlugin`, `ScrollSmoother`)
- **Radix UI** — accessible primitives
- **Axios** — HTTP client
- **oxlint** + **oxfmt** — linting and formatting

## Getting Started 🚀

### Prerequisites

- **Node.js**: 18+ (LTS recommended)
- **pnpm**: Preferred package manager (`npm install -g pnpm`)
- **TMDB API Key**: Register at [TMDB](https://www.themoviedb.org/signup)

### Installation

```bash
# Clone
git clone https://github.com/SethyRung/Movie-Website-React.git
cd Movie-Website-React

# Install dependencies
pnpm install

# Environment setup
cp .env.example .env
# Edit .env and add your TMDB API key:
# VITE_API_URL="https://api.themoviedb.org/3"
# VITE_API_KEY="your_actual_tmdb_api_key_here"

# Start dev server
pnpm dev
```

The app runs at `http://localhost:5173`.

### Available Scripts

| Script                        | Description                                   |
| ----------------------------- | --------------------------------------------- |
| `pnpm dev`                    | Start development server                      |
| `pnpm build`                  | Build for production (`tsc -b && vite build`) |
| `pnpm preview`                | Preview production build locally              |
| `pnpm lint` / `pnpm lint:fix` | Run oxlint                                    |
| `pnpm fmt` / `pnpm fmt:check` | Run oxfmt formatter                           |

## Project Architecture 📁

```
src/
├── features/movies/          # Primary feature module
│   ├── components/           # MovieCard, MainCard, CastCard
│   ├── hooks/                # useMovies, useMovieDetails, useMovieSearch, useMainMovie, useFavorites
│   ├── stores/               # Zustand store for movie state
│   └── types/                # Movie feature types
├── components/
│   ├── ui/                   # Design-system primitives (Button, Input, Alert, Skeleton, Loading, ErrorBoundary)
│   ├── AppHeader.tsx
│   ├── AppFooter.tsx
│   ├── Search/
│   ├── carousel.tsx
│   ├── tabs.tsx
│   ├── pagination.tsx
│   └── skeleton.tsx
├── pages/
│   ├── Home/HomePage.tsx     # Homepage entrypoint
│   ├── Movies/               # MovieListPage, MovieDetailPage
│   ├── NotFound/
│   ├── movie/                # Legacy dynamic route files (unused)
│   ├── index.tsx             # Orphaned legacy homepage (unused)
│   └── coming-soon.tsx
├── services/                 # API layer
│   ├── base/                 # BaseService, ServiceResponse, errorHandling, cache
│   ├── movie/                # MovieService
│   ├── discovery/            # DiscoveryService
│   └── index.ts              # movieAPI singleton
├── routes.tsx                # Active route table (eager imports)
├── routes/lazy.tsx           # Unused lazy route definitions
├── lib/utils.ts              # cn() + mergeUI()
├── utils/                    # Shared utilities (cn, formatting, constants, axios, env, helpers, performance)
├── hooks/                    # Shared hooks (useCarouselScroll)
├── types/                    # Shared type definitions
├── assets/styles/main.css    # Global Tailwind v4 stylesheet
├── main.tsx                  # Entry point (GSAP plugins registered globally here)
└── App.tsx
```

### Key Conventions

- **Feature-based organization**: Business logic lives in `src/features/movies/`.
- **Path aliases**: Vite resolves `@components`, `@features`, `@pages`, `@hooks`, `@types`, `@utils`, `@assets`, `@lib`, etc. (`tsconfig.app.json` currently lacks these `paths`, so `tsc -b` cannot resolve them — but Vite handles them at dev/build time).
- **Global styles**: Tailwind v4 theme is configured in `src/assets/styles/main.css` via `@theme` and `@theme static` blocks.
- **UI components**: Shadcn/ui-style components in `src/components/ui/` import `cn` from `@/lib/utils`.

## Known Issues ⚠️

- **`pnpm build` currently fails** because `babel-plugin-react-compiler` is missing. It is required by `@rolldown/plugin-babel` + `reactCompilerPreset()` in `vite.config.ts`.
- **`tsc -b` currently fails** because `tsconfig.app.json` lacks `paths`, so many alias imports are unresolved.
- **`pnpm dev` works** — the dev server does not run the Babel production transform and Vite resolves aliases at runtime.

## License 📄

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact 📧

- **GitHub**: [Sethy Rung](https://github.com/SethyRung)
- **Project Link**: [https://github.com/SethyRung/Movie-Website-React](https://github.com/SethyRung/Movie-Website-React)
- **Live Demo**: [https://sethyrung-movie-react.vercel.app/](https://sethyrung-movie-react.vercel.app/)

## Acknowledgments 🙏

- **[TMDB](https://www.themoviedb.org/)**: For providing the movie database API
- **[React Team](https://react.dev/)**: For the React framework
- **[Vite Team](https://vitejs.dev/)**: For the build tool
- **[Tailwind CSS](https://tailwindcss.com/)**: For the utility-first CSS framework
