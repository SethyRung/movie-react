# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Core Development:**
- **Start development server**: `pnpm dev` (runs on http://localhost:5173)
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

## Project Architecture

This is a **React 19 enterprise-grade movie website** with a sophisticated **3-tier service architecture**.

### Tech Stack

- **React 19** with TypeScript 5.9 (strict mode)
- **Vite with rolldown-vite** for ultra-fast builds
- **Tailwind CSS v4** with custom design system
- **TanStack Query** for server state management
- **Zustand** for client state management
- **React Router DOM v7** for routing
- **Zod** for runtime validation
- **Vitest** for testing with MSW for API mocking

### Enterprise Service Architecture

The application implements a **3-tier service architecture** that separates concerns:

1. **Base Service Layer** (`src/services/base/`):
   - `BaseService.ts` - Abstract base class with caching, retry logic, error handling
   - `ServiceResponse.ts` - Standardized response wrapper types
   - `cache.ts` - Intelligent caching with TTL and cleanup
   - `errorHandling.ts` - Comprehensive error factory and retry handlers

2. **Feature Service Layer** (`src/services/movie/`, `src/services/discovery/`):
   - `MovieService.ts` - Complete TMDB movie API integration
   - `DiscoveryService.ts` - Movie discovery and browsing
   - Built-in Zod validation schemas
   - Optimized batch requests and parallel processing

3. **API Client Layer** (`src/utils/axios.ts`):
   - Three specialized Axios instances:
     - `withApiKey` - TMDB API calls (auto-includes API key)
     - `withAuth` - Authenticated endpoints (Bearer token)
     - `withoutAuth` - Public API calls
   - Comprehensive interceptors for error handling and auth

### Feature-Based Architecture

The project follows a **feature-based organization** rather than technical layers:

```
src/features/movies/
├── components/           # Movie-specific UI components
├── hooks/               # Movie-specific React hooks
├── services/            # Movie API services
├── stores/              # Zustand state stores
└── types/               # TypeScript definitions
```

### Path Aliases

Comprehensive alias system configured in Vite and TypeScript:
- `@/` - src/
- `@components/` - src/components/
- `@features/` - src/features/
- `@pages/` - src/pages/
- `@hooks/` - src/hooks/
- `@types/` - src/types/
- `@utils/` - src/utils/
- `@assets/` - src/assets/
- `@tests/` - tests/ (test files moved from src/)

### State Management Strategy

**Hybrid Approach:**
- **TanStack Query** for server state (API caching, background updates)
- **Zustand** for client state (UI state, user preferences)
- **Service Layer** handles business logic and data transformation
- **Component-level state** for local UI interactions

### Testing Infrastructure

**Complete Testing Setup:**
- **Vitest** as test runner with jsdom environment
- **React Testing Library** for component testing
- **MSW (Mock Service Worker)** for API mocking
- **Coverage thresholds** set at 70% for all metrics
- Tests located in `tests/` directory mirroring src/ structure

### Build & Performance Optimizations

**Bundle Splitting Strategy:**
- Manual chunk splitting by feature and vendor libraries
- Separate chunks for React ecosystem, UI libraries, features, and pages
- Code splitting for routes and components
- Bundle size analysis tools integrated

**Performance Features:**
- Intelligent caching in service layer with configurable TTL
- Image optimization with responsive loading
- Performance monitoring with custom hooks
- Lighthouse CI integration

### Styling System

**Tailwind CSS v4 Configuration:**
- Custom color system (primary, secondary, tertiary, grey variants)
- Responsive breakpoints: lgMobile (480px), tablet (844px), desktop (1280px)
- Dark/light theme support with CSS custom properties
- Custom scrollbar styling

### Type Safety & Validation

**Comprehensive TypeScript Usage:**
- Strict TypeScript configuration
- Zod schemas for API response validation
- Service layer validates all external data
- Generic types for reusable service patterns

### Key Architectural Patterns

1. **Service Layer Pattern**: Clean separation between UI and data fetching
2. **Repository Pattern**: Services encapsulate API interactions
3. **Factory Pattern**: Error handling and service creation
4. **Observer Pattern**: React hooks for state management
5. **Strategy Pattern**: Multiple Axios instances for different auth needs

### Package Manager

- **pnpm** is the preferred package manager
- Configured via pnpm-workspace.yaml with MSW override
- Use `pnpm install` for dependencies

### Testing Commands

The test files have been migrated from `src/` to `tests/` directory. When running tests:
- Use relative paths from project root: `pnpm test tests/utils/`
- All tests maintain the same structure and functionality
- Test utilities are located at `tests/test-utils.tsx`

### Important Implementation Details

- The service layer includes **memory leak prevention** with cleanup methods
- **Retry logic** with exponential backoff for failed requests
- **Batch processing** for multiple movie requests
- **Cache invalidation** strategies
- **Comprehensive error handling** with typed error responses
- **Accessibility** prioritized in navigation components
- **Mobile-first responsive design** throughout