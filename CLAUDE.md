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

### Directory Structure
```
src/
├── api/                           # API layer - separate files for different TMDB endpoints
│   ├── main-movie.get.ts          # Popular movie data with images
│   ├── now-playing.get.ts         # Currently playing movies
│   ├── upcoming.get.ts            # Upcoming movie releases
│   ├── popular.get.ts             # Popular movies listing
│   ├── movie-detail.get.ts        # Individual movie details
│   ├── movie-credits.get.ts       # Movie cast and crew
│   ├── movie-images.get.ts        # Movie posters and backdrops
│   ├── movie-keywords.get.ts      # Movie keywords and tags
│   └── movie-videos.get.ts        # Movie trailers and videos
├── components/                    # Reusable React components
│   ├── movie/                     # Movie-specific components
│   │   ├── cast-card.tsx          # Cast member card component
│   │   ├── main-card.tsx          # Featured movie card
│   │   └── movie-card.tsx         # Standard movie card
│   ├── carousel.tsx               # Image/movie carousel
│   ├── footer.tsx                 # Application footer
│   ├── navbar.tsx                 # Navigation header
│   ├── pagination.tsx             # Pagination controls
│   ├── skeleton.tsx               # Loading skeleton components
│   └── tabs.tsx                   # Tab navigation component
├── hooks/                         # Custom React hooks
│   └── useCarouselScroll.ts       # Carousel scrolling logic
├── layouts/                       # Layout components
│   └── default.tsx                # Default layout with navbar and footer
├── pages/                         # Route-level page components
│   ├── coming-soon.tsx            # Coming soon page
│   ├── index.tsx                  # Homepage with movie listings
│   ├── movie/
│   │   ├── index.tsx              # Movies listing page
│   │   └── [id].tsx               # Dynamic movie detail page
├── utils/                         # Utility functions
│   ├── axios.ts                   # Axios configuration with interceptors
│   ├── helpers.ts                 # General helper functions
│   └── vite-env.d.ts              # Vite environment types
├── App.tsx                        # Main application component
├── index.css                      # Global styles
├── main.tsx                       # Application entry point
├── routes.tsx                     # Centralized route configuration
└── vite-env.d.ts                  # Vite type definitions
```

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