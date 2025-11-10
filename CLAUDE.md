# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Core Development:**
- **Start development server**: `pnpm dev` (runs on http://localhost:5173+ - will find next available port)
- **Build for production**: `pnpm build` (TypeScript compilation + Vite build)
- **Preview production build**: `pnpm preview`
- **Type checking**: `pnpm type-check` (TypeScript without emitting files)

**Code Quality:**
- **Lint**: `pnpm lint` (ESLint checks)
- **Lint and fix**: `pnpm lint:fix` (Auto-fix linting issues)

**Testing:**
- **Run tests**: `pnpm test` (Vitest unit tests)
- **Interactive test UI**: `pnpm test:ui` (Visual test runner)
- **Coverage report**: `pnpm test:coverage` (Generate coverage report)
- **Single test file**: `pnpm test tests/utils/cn.test.ts` (Run specific test file)

**Analysis & Performance:**
- **Bundle analysis**: `pnpm analyze` (Visual bundle size report)
- **Performance audit**: `pnpm performance:audit` (Lighthouse audit)
- **Security audit**: `pnpm security:audit` (Vulnerability checks)

## Environment Setup

The project uses The Movie Database (TMDB) API. Required environment variables:

1. Copy `.env.example` to `.env`
2. Set `VITE_API_URL="https://api.themoviedb.org/3"`
3. Set `VITE_API_KEY` to your TMDB API key

## Current Project Status

**🚧 Live Production Application**

This is a **fully functional and deployed** movie website with a complete feature set. The application is live at https://sethyrung-movie-react.vercel.app/ and includes:

- ✅ Complete movie discovery (popular, now playing, upcoming)
- ✅ Advanced search functionality
- ✅ Detailed movie pages with cast, crew, ratings, and trailers
- ✅ Responsive design optimized for all devices
- ✅ Enterprise-grade architecture with 3-tier service layer
- ✅ Comprehensive testing and performance optimization

## Tech Stack

- **React 19** with TypeScript 5.9 (strict mode)
- **Vite with rolldown-vite** for ultra-fast builds
- **Tailwind CSS v4** with custom design system (no config file needed)
- **TanStack Query** for server state management
- **Zustand** for client state management
- **React Router DOM v7** for routing
- **GSAP** for animations and scroll interactions
- **Zod** for runtime validation
- **Vitest** for testing with MSW for API mocking

## Enterprise Service Architecture (IMPLEMENTED)

The application implements a **complete 3-tier service architecture**:

### 1. Base Service Layer (`src/services/base/`)
- **`BaseService.ts`**: Abstract base class with intelligent caching, retry logic, comprehensive error handling, and Zod validation integration
- **`ServiceResponse.ts`**: Standardized response wrapper with type guards and pagination support
- **`cache.ts`**: Environment-aware caching system with TTL, cleanup, and memory leak prevention
- **`errorHandling.ts`**: Comprehensive error factory with retry handlers and exponential backoff

### 2. Feature Service Layer
- **`src/services/movie/`**: Complete TMDB movie API integration with validation schemas
- **`src/services/discovery/`**: Movie discovery and browsing services
- All services include built-in Zod validation, parallel processing, and optimized batch requests

### 3. API Client Layer (`src/utils/axios.ts`)
- **`withApiKey`**: TMDB API calls with automatic API key inclusion
- **`withAuth`**: Authenticated endpoints with Bearer token support
- **`withoutAuth`**: Public API calls
- Comprehensive interceptors for error handling and authentication

## Feature-Based Architecture (FULLY IMPLEMENTED)

```
src/features/movies/
├── components/           # Movie-specific UI components (MovieCard, MainCard, CastCard)
├── hooks/               # Movie-specific React hooks (useMovies, useMovieDetails, etc.)
├── services/            # Movie API services
├── stores/              # Zustand state stores
└── types/               # TypeScript definitions
```

## Path Aliases

Comprehensive alias system configured in Vite and TypeScript:
- `@/` - src/
- `@components/` - src/components/
- `@features/` - src/features/
- `@pages/` - src/pages/
- `@hooks/` - src/hooks/
- `@types/` - src/types/
- `@utils/` - src/utils/
- `@assets/` - src/assets/
- `@lib/` - src/lib/
- `@tests/` - tests/ (test files moved from src/)

## Styling System (Tailwind CSS v4)

**Configuration located in `src/assets/styles/main.css`:**
- Uses modern **`@theme`** directive (no separate config file needed)
- Custom color system with primary, secondary, tertiary, and grey variants
- Custom fonts: Red Hat Mono, Red Hat Text, Roboto
- Responsive breakpoints: lgMobile (480px), tablet (844px), desktop (1280px)
- Dark/light theme support with CSS custom properties
- Custom scrollbar styling and hide-scrollbar utility

## State Management Strategy

**Hybrid Approach (Fully Implemented):**
- **TanStack Query**: Server state with API caching, background updates, and optimistic updates
- **Zustand**: Client state for UI state and user preferences
- **Service Layer**: Business logic, data transformation, and validation
- **Component-level state**: Local UI interactions

## Build & Performance Optimizations

**Advanced Bundle Splitting (vite.config.ts):**
- Manual chunk splitting by feature and vendor libraries
- Separate chunks for React ecosystem, UI libraries, features, and pages
- Code splitting for routes and components
- Optimized asset file naming and organization

**Performance Features:**
- Intelligent caching with environment-specific TTLs
- Image optimization with responsive loading
- Performance monitoring hooks
- Lighthouse integration
- GSAP for smooth animations and scroll effects

## Animation & Interactions

**GSAP Integration (main.tsx):**
- GSAP plugins globally registered: useGSAP, ScrollTrigger, TextPlugin, ScrollSmoother
- Smooth scrolling with ScrollSmootherWrapper
- Enhanced movie card animations
- Optimized performance with scroll-based animations

## Type Safety & Validation

**Comprehensive TypeScript Usage:**
- Strict TypeScript configuration
- Zod schemas for API response validation in all services
- Service layer validates all external data
- Generic types for reusable service patterns
- Type guards for ServiceResponse handling

## Key Architectural Patterns (IMPLEMENTED)

1. **Service Layer Pattern**: Clean separation between UI and data fetching
2. **Repository Pattern**: Services encapsulate API interactions
3. **Factory Pattern**: Error handling and service creation
4. **Observer Pattern**: React hooks for state management
5. **Strategy Pattern**: Multiple Axios instances for different auth needs

## Package Manager

- **pnpm** is the preferred package manager
- Configured via pnpm-workspace.yaml with MSW override
- Use `pnpm install` for dependencies

## Testing Infrastructure

**Complete Testing Setup:**
- **Vitest** as test runner with jsdom environment
- **React Testing Library** for component testing
- **MSW (Mock Service Worker)** for API mocking
- **Coverage thresholds** set at 70% for all metrics
- Tests located in `tests/` directory mirroring src/ structure

## Implementation Details

- **Memory leak prevention**: Service cleanup methods and cache management
- **Retry logic**: Exponential backoff for failed requests
- **Batch processing**: Optimized multiple movie requests
- **Cache invalidation**: Environment-aware strategies
- **Comprehensive error handling**: Typed error responses with detailed logging
- **Accessibility**: WCAG compliance with keyboard navigation and screen reader support
- **Mobile-first responsive design**: Touch interactions and optimized layouts
- **GSAP animations**: Smooth scroll enhancements and UI interactions
- **Production deployment**: Live application with comprehensive monitoring

## Development Workflow

The application is **production-ready** and actively maintained. When working on this codebase:

1. **Follow feature-based architecture** when adding new functionality
2. **Use the service layer pattern** for all API interactions
3. **Leverage existing components** from the UI library
4. **Maintain type safety** with TypeScript and Zod validation
5. **Test new features** using the comprehensive testing setup
6. **Optimize performance** using built-in caching and bundle splitting

The codebase demonstrates enterprise-grade React development with modern patterns, comprehensive tooling, and production-quality implementation.