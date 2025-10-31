# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `pnpm dev` or `npm run dev` (runs on http://localhost:5173)
- **Build for production**: `pnpm build` or `npm run build` (runs TypeScript compilation + Vite build)
- **Preview production build**: `pnpm preview` or `npm run preview`
- **Lint code**: `pnpm lint` or `npm run lint` (ESLint with TypeScript and React plugins)

## Environment Setup

The project uses The Movie Database (TMDB) API. You need to set up environment variables:

1. Copy `.env.example` to `.env`
2. Set `VITE_API_URL="https://api.themoviedb.org/3"`
3. Set `VITE_API_KEY` to your TMDB API key

## Project Architecture

### Tech Stack

- **Framework**: React 18 with TypeScript
- **Bundler**: Vite (using rolldown-vite)
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios with custom interceptors
- **Icons**: Iconify React with MDI icons
- **Package Manager**: pnpm (preferred) - note pnpm-workspace.yaml configuration

### Professional Directory Structure

The project follows a **feature-based architecture** with clear separation of concerns, designed for scalability and team collaboration:

```
src/
├── features/                      # Feature-based modules (business logic)
│   ├── movies/                    # Movie management feature
│   │   ├── components/            # Movie-specific components
│   │   │   ├── MovieCard/         # Self-contained movie card component
│   │   │   │   ├── MovieCard.tsx
│   │   │   │   ├── MovieCard.test.tsx
│   │   │   │   ├── MovieCard.types.ts
│   │   │   │   └── index.ts
│   │   │   ├── MovieList/         # Movie listing component
│   │   │   ├── MovieDetails/      # Movie detail view component
│   │   │   ├── MovieSearch/       # Movie search component
│   │   │   └── CastList/          # Cast member listing
│   │   ├── hooks/                 # Movie-specific hooks
│   │   │   ├── useMovies.ts       # Movie data fetching with caching
│   │   │   ├── useMovieDetails.ts # Individual movie details
│   │   │   ├── useFavorites.ts    # Favorites management
│   │   │   └── useMovieSearch.ts  # Search functionality
│   │   ├── services/              # Movie API services
│   │   │   ├── movieApi.ts        # TMDB movie API calls
│   │   │   └── movieCache.ts      # Movie caching strategy
│   │   ├── stores/                # Feature-specific state management
│   │   │   └── movieStore.ts      # Zustand store for movie state
│   │   ├── types/                 # Movie feature types
│   │   │   └── movie.types.ts     # Movie-related type definitions
│   │   └── index.ts               # Feature barrel export
│   ├── auth/                      # Authentication feature
│   ├── search/                    # Search functionality feature
│   └── favorites/                 # User favorites feature
│
├── components/                # Reusable components
│   ├── ui/                    # Basic UI components (design system)
│   │   ├── Button/            # Button component with variants
│   │   ├── Input/             # Input component with validation
│   │   ├── Modal/             # Modal/overlay component
│   │   ├── Loading/           # Loading states and spinners
│   │   ├── ErrorBoundary/     # Error boundary components
│   │   └── Layout/            # Layout components
│   └── business/              # Business logic components
│       ├── Carousel/          # Enhanced carousel component
│       ├── Tabs/              # Tab navigation component
│       └── Pagination/        # Pagination component
├── hooks/                     # Shared hooks
│   ├── useCarousel.ts         # Carousel functionality
│   ├── useLocalStorage.ts     # Storage utilities
│   └── useApi.ts              # Generic API hook
├── types/                     # Shared type definitions
│   ├── common.types.ts        # Common application types
│   └── api.types.ts           # API response types
├── utils/                     # Shared utilities
│       ├── cn.ts              # Classname utility (clsx + tailwind-merge)
│       ├── formatting.ts      # Formatting utilities
│       ├── validation.ts      # Validation schemas
│       └── constants.ts       # Shared constants
│
├── pages/                         # Route-level page components
│   ├── Home/                      # Homepage
│   │   ├── HomePage.tsx           # Main homepage component
│   │   ├── HomePage.test.tsx      # Homepage tests
│   │   └── index.ts               # Page export
│   ├── Movies/                    # Movie pages
│   │   ├── MovieListPage.tsx      # Movie listing page
│   │   ├── MovieDetailPage.tsx    # Movie detail page
│   │   ├── MovieListPage.test.tsx # Movie listing tests
│   │   ├── MovieDetailPage.test.tsx # Movie detail tests
│   │   └── index.ts               # Pages export
│   ├── NotFound/                  # 404 error page
│   └── _app/                      # App-level components
│       ├── App.tsx                # Main app component with providers
│       ├── App.styles.css         # App-level styles
│       └── index.ts               # App export

├── assets/                        # Static assets
│   ├── images/                    # Image files
│   ├── icons/                     # Icon files
│   └── styles/                    # Global styles
│       ├── variables.css          # CSS custom properties
│       └── themes.css             # Theme definitions

└── tests/                         # Global test configuration
    ├── setup.ts                   # Test setup and configuration
    ├── mocks/                     # API mocks and fixtures
    │   └── handlers.ts            # MSW handlers for API mocking
    └── utils/                     # Test utilities
        ├── test-utils.tsx         # Custom render functions
        └── render-with-providers.tsx # Test providers wrapper
```

### Architecture Principles

**Feature-Based Organization**: Components are organized by business features rather than technical layers, making it easier to find and modify related functionality.

**Separation of Concerns**: Clear boundaries between UI components, business logic, data fetching, and state management.

**Scalable State Management**: Zustand for feature-specific state with persistence and devtools integration.

**Type Safety**: Comprehensive TypeScript usage with strict type checking throughout the application.

**Testing Infrastructure**: Complete testing setup with Vitest, React Testing Library, and MSW for API mocking.

**Developer Experience**: Path aliases, hot reloading, comprehensive tooling, and clear documentation.

### API Architecture

The project uses a structured API layer with three Axios instances in `src/utils/axios.ts`:

- `withApiKey`: For TMDB API calls (includes api_key parameter)
- `withAuth`: For authenticated endpoints (includes Bearer token)
- `withoutAuth`: For public API calls without authentication

API functions are organized by endpoint (e.g., `main-movie.get.ts`, `now-playing.get.ts`) and include proper TypeScript types for responses.

### Component Architecture

- **Layout**: DefaultLayout wraps all pages with Navbar and Footer
- **Pages**: Route components in `src/pages/` directory
- **Components**: Reusable UI components with a focus on movie-related components
- **Routing**: Centralized in `src/routes.tsx` with React Router setup

### Key Features

- **Movie discovery**: Popular, now playing, and upcoming movies
- **Movie details**: Detailed view with images, cast, credits, videos
- **Responsive design**: Mobile-first approach with Tailwind CSS
- **Carousel functionality**: Custom carousel with scroll controls
- **Tab navigation**: Dynamic content switching on homepage

### Styling Approach

- Uses Tailwind CSS v4 with custom color system (secondary-500, tertiary-500, grey-500)
- Responsive breakpoints: tablet, desktop, lgMobile
- Component styling uses utility classes with some inline conditional styling
- Custom components like Tabs, Carousel, MovieCard have their own styling logic

### TypeScript Configuration

- Strict TypeScript enabled with comprehensive linting rules
- Composite project setup with separate configs for app and node environments
- JSX configured for React 18 with `react-jsx` transform

### Development Notes

- The project uses pnpm as the package manager (see pnpm-workspace.yaml)
- Vite is configured with rolldown for faster builds
- ESLint includes Prettier integration for consistent code formatting
- Environment variables are prefixed with `VITE_` for Vite compatibility
