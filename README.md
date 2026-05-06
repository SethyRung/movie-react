# Movie Website - React 🎬

A modern, feature-rich movie discovery application built with React 19, TypeScript, and enterprise-grade architecture. This project demonstrates professional frontend development practices with a comprehensive feature-based architecture, optimized performance, and exceptional developer experience.

## Overview 🌟

This Movie Website is a sophisticated web application that provides users with an immersive movie discovery experience. Built with the latest React ecosystem and following enterprise development patterns, it showcases modern frontend architecture with TypeScript, comprehensive testing, and scalable state management. The application integrates with The Movie Database (TMDB) API to deliver real-time movie data, search functionality, and detailed movie information.

## Live Demo 🚀

You can check out the live version of this application here:

https://sethyrung-movie-react.vercel.app/

## Features ✨

### Core Functionality

- **🎬 Movie Discovery**: Browse popular, now playing, and upcoming movies
- **🔍 Advanced Search**: Real-time movie search with intelligent filtering
- **📖 Detailed Movie Information**: Comprehensive movie pages with synopsis, cast, crew, ratings, and trailers
- **🎭 Cast & Crew Details**: Explore actor profiles and filmography
- **🎨 Movie Galleries**: High-quality movie posters and backdrop images
- **📱 Responsive Design**: Optimized for all devices with mobile-first approach

### Technical Features

- **⚡ Lightning Fast**: Built with Vite and rolldown for optimal performance
- **🔄 Smart Caching**: Intelligent data caching and state management with React Query
- **🎯 TypeScript**: Full type safety across the entire application
- **🧪 Comprehensive Testing**: Unit tests, integration tests, and test coverage reporting
- **🎨 Modern UI**: Tailwind CSS v4 with custom design system
- **🔄 Component Library**: Reusable UI components with variants and accessibility
- **📊 State Management**: Zustand for scalable, performant state management

## Tech Stack 🛠️

### Frontend Framework & Runtime

- **React 19**: Latest React version with modern hooks and concurrent features
- **TypeScript 5.9**: Strict type checking and enhanced developer experience
- **Vite with rolldown**: Ultra-fast build tool and development server

### Styling & UI

- **Tailwind CSS v4**: Utility-first CSS framework with custom design system
- **Lucide React**: Beautiful, consistent icon system
- **Radix UI**: Accessible, unstyled component primitives
- **Tailwind Variants**: Component variant system for consistent UI patterns

### State Management & Data Fetching

- **Zustand**: Lightweight, performant state management
- **TanStack Query**: Powerful server state management and caching
- **Axios**: HTTP client with interceptors and error handling

### Routing & Navigation

- **React Router DOM v7**: Declarative routing with modern patterns

### Development & Testing

- **Vitest**: Fast unit testing framework
- **Testing Library**: Component testing utilities
- **MSW**: API mocking for testing
- **ESLint & Prettier**: Code quality and formatting
- **Commitlint**: Conventional commit standards

### Utilities & Libraries

- **date-fns**: Modern date utility library
- **Zod**: TypeScript-first schema validation
- **clsx & tailwind-merge**: Utility class management
- **Iconify**: Comprehensive icon library with MDI icons

## Getting Started 🚀

### Prerequisites

- **Node.js**: Version 18+ (LTS recommended)
- **pnpm**: Preferred package manager (install with `npm install -g pnpm`)
- **TMDB API Key**: Register at [TMDB](https://www.themoviedb.org/signup) to get your free API key

### Installation Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/SethyRung/Movie-Website-React.git
   cd Movie-Website-React
   ```

2. **Install Dependencies**

   ```bash
   pnpm install
   # alternatively: npm install
   ```

3. **Environment Setup**

   ```bash
   # Copy the environment template
   cp .env.example .env

   # Edit .env and add your TMDB API key
   VITE_API_URL="https://api.themoviedb.org/3"
   VITE_API_KEY="your_actual_tmdb_api_key_here"
   ```

4. **Start Development Server**

   ```bash
   pnpm dev
   # alternatively: npm run dev
   ```

   The application will be available at `http://localhost:5173`

### Available Scripts

#### Development

- `pnpm dev` - Start development server with hot reload
- `pnpm type-check` - Run TypeScript type checking without emitting files

#### Building & Production

- `pnpm build` - Build for production (TypeScript compilation + Vite build)
- `pnpm preview` - Preview production build locally

#### Code Quality

- `pnpm lint` - Run ESLint for code quality checks
- `pnpm lint:fix` - Auto-fix linting issues

#### Testing

- `pnpm test` - Run unit tests with Vitest
- `pnpm test:ui` - Run tests with interactive UI
- `pnpm test:coverage` - Generate test coverage report

#### Analysis & Performance

- `pnpm analyze` - Analyze bundle size with visual report
- `pnpm performance:audit` - Run Lighthouse performance audit
- `pnpm security:audit` - Check for security vulnerabilities

## Usage 🎬🍿

Once the application is running:

1. **Browse Movies**: Explore popular, now playing, and upcoming movies on the homepage
2. **Search**: Use the search functionality to find specific movies by title
3. **View Details**: Click on any movie card to see comprehensive information including:
   - Synopsis and overview
   - Cast and crew information
   - Ratings and release dates
   - Movie trailers and videos
   - High-quality images and posters
4. **Responsive Experience**: Enjoy the optimized experience across desktop, tablet, and mobile devices

## Project Architecture 📁

This project follows a **feature-based architecture** designed for scalability and maintainability:

```
src/
├── features/                      # Feature-based modules (business logic)
│   ├── movies/                    # Movie management feature
│   │   ├── components/            # Movie-specific components
│   │   │   ├── MovieCard/         # Self-contained movie card component
│   │   │   ├── MovieList/         # Movie listing component
│   │   │   ├── MovieDetails/      # Movie detail view component
│   │   │   ├── MovieSearch/       # Movie search component
│   │   │   └── CastList/          # Cast member listing
│   │   ├── hooks/                 # Movie-specific hooks
│   │   │   ├── useMovies.ts       # Movie data fetching with caching
│   │   │   ├── useMovieDetails.ts # Individual movie details
│   │   │   └── useMovieSearch.ts  # Search functionality
│   │   ├── services/              # Movie API services
│   │   │   ├── movieApi.ts        # TMDB movie API calls
│   │   │   └── movieCache.ts      # Movie caching strategy
│   │   ├── stores/                # Feature-specific state management
│   │   │   └── movieStore.ts      # Zustand store for movie state
│   │   ├── types/                 # Movie feature types
│   │   │   └── movie.types.ts     # Movie-related type definitions
│   │   └── index.ts               # Feature barrel export
│   └── [other features...]        # Auth, search, favorites, etc.
│
├── components/                    # Reusable components
│   ├── ui/                        # Basic UI components (design system)
│   │   ├── Button/                # Button component with variants
│   │   ├── Input/                 # Input component with validation
│   │   ├── Modal/                 # Modal/overlay component
│   │   ├── Loading/               # Loading states and spinners
│   │   ├── ErrorBoundary/         # Error boundary components
│   │   └── Layout/                # Layout components
│   └── business/                  # Business logic components
│       ├── Carousel/              # Enhanced carousel component
│       ├── Tabs/                  # Tab navigation component
│       └── Pagination/            # Pagination component
│
├── services/                      # API and service layer
│   ├── base/                      # Base service infrastructure
│   │   ├── BaseService.ts         # Base API service class
│   │   ├── ServiceResponse.ts     # Standardized response types
│   │   ├── cache.ts               # Caching utilities
│   │   └── errorHandling.ts       # Error handling utilities
│   ├── movie/                     # Movie-specific services
│   │   ├── MovieService.ts        # Movie API service
│   │   ├── types.ts               # Movie service types
│   │   └── validation.ts          # Service validation
│   └── discovery/                 # Discovery service
│       ├── DiscoveryService.ts    # Movie discovery API
│       ├── types.ts               # Discovery types
│       └── validation.ts          # Discovery validation
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
│   └── movie/                     # Dynamic movie routes
│       ├── [id].tsx               # Individual movie page
│       └── index.tsx              # Movie index
│
├── hooks/                         # Shared hooks
│   ├── useCarousel.ts             # Carousel functionality
│   ├── useLocalStorage.ts         # Storage utilities
│   └── useApi.ts                  # Generic API hook
│
├── types/                         # Shared type definitions
│   ├── common.types.ts            # Common application types
│   └── api.types.ts               # API response types
│
├── utils/                         # Shared utilities
│   ├── cn.ts                      # Classname utility (clsx + tailwind-merge)
│   ├── formatting.ts              # Formatting utilities
│   ├── validation.ts              # Validation schemas
│   └── constants.ts               # Shared constants
│
├── tests/                         # Global test configuration
│   ├── setup.ts                   # Test setup and configuration
│   ├── mocks/                     # API mocks and fixtures
│   │   └── handlers.ts            # MSW handlers for API mocking
│   └── utils/                     # Test utilities
│       ├── test-utils.tsx         # Custom render functions
│       └── render-with-providers.tsx # Test providers wrapper
│
├── assets/                        # Static assets
│   ├── images/                    # Image files
│   ├── icons/                     # Icon files
│   └── styles/                    # Global styles
│       ├── variables.css          # CSS custom properties
│       └── themes.css             # Theme definitions
│
├── App.tsx                        # Main app component with providers
├── main.tsx                       # Application entry point
├── routes.tsx                     # React Router configuration
└── index.css                      # Global styles
```

### Architecture Principles

- **Feature-Based Organization**: Components are organized by business features for better maintainability
- **Separation of Concerns**: Clear boundaries between UI, business logic, and data fetching
- **Scalable State Management**: Zustand for feature-specific state with persistence
- **Type Safety**: Comprehensive TypeScript usage with strict type checking
- **Testing Infrastructure**: Complete testing setup with Vitest and React Testing Library
- **Developer Experience**: Path aliases, hot reloading, and comprehensive tooling

## Development Workflow 🛠️

### Code Quality Standards

This project maintains high code quality standards with automated tooling:

- **ESLint**: Enforces code quality and consistency
- **Prettier**: Automatic code formatting
- **TypeScript**: Strict type checking for catch errors at compile time
- **Commitlint**: Ensures conventional commit messages

### Testing Strategy

- **Unit Tests**: Component-level testing with React Testing Library
- **Integration Tests**: API service and hook testing
- **Mock Service Worker (MSW)**: API mocking for reliable testing
- **Coverage Reports**: Maintain high test coverage across the codebase

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit with conventional message
git add .
git commit -m "feat: add new movie search functionality"

# Push and create pull request
git push origin feature/your-feature-name
```

## Contributing 🤝

We welcome contributions! Please follow our contribution guidelines:

### Before Contributing

1. **Read the Architecture**: Understand the feature-based architecture
2. **Check Issues**: Look for existing issues or create one for your contribution
3. **Setup Development**: Ensure your local environment is working

### Contribution Process

1. **Fork** the repository
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Follow Code Standards**:
   - Write TypeScript types for all new code
   - Add tests for new functionality
   - Follow existing component patterns
   - Use conventional commit messages
4. **Run quality checks**:
   ```bash
   pnpm lint
   pnpm type-check
   pnpm test
   ```
5. **Commit your changes** (`git commit -m 'feat: add amazing feature'`)
6. **Push to the branch** (`git push origin feature/amazing-feature`)
7. **Create a Pull Request** with a detailed description

### Development Guidelines

- **Follow the feature-based architecture** when adding new functionality
- **Write tests** for all new features and bug fixes
- **Update documentation** when adding new features
- **Keep components small and focused** on single responsibilities
- **Use TypeScript strictly** - avoid `any` types

## Performance & Optimization 📈

The application is optimized for performance with:

- **Bundle Analysis**: Regular bundle size monitoring
- **Code Splitting**: Lazy loading of components and routes
- **Image Optimization**: Responsive images with proper loading strategies
- **Caching Strategy**: Intelligent API response caching
- **Performance Auditing**: Regular Lighthouse performance checks

## Security 🔒

Security measures implemented:

- **Environment Variables**: Sensitive data stored securely
- **API Key Protection**: TMDB API key properly secured
- **Dependency Auditing**: Regular security vulnerability checks
- **Input Validation**: Form validation with Zod schemas
- **Type Safety**: TypeScript prevents many runtime errors

## Deployment 🚀

### Production Build

```bash
# Build for production
pnpm build

# Preview production build locally
pnpm preview
```

### Environment Variables for Production

Ensure these environment variables are set in your production environment:

- `VITE_API_URL`: TMDB API endpoint
- `VITE_API_KEY`: Your TMDB API key

## License 📄

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact 📧

For any inquiries, suggestions, or collaborations:

- **GitHub**: [Sethy Rung](https://github.com/SethyRung)
- **Project Link**: [https://github.com/SethyRung/Movie-Website-React](https://github.com/SethyRung/Movie-Website-React)
- **Live Demo**: [https://sethyrung-movie-react.vercel.app/](https://sethyrung-movie-react.vercel.app/)

## Acknowledgments 🙏

- **[TMDB](https://www.themoviedb.org/)**: For providing the amazing movie database API
- **[React Team](https://react.dev/)**: For the incredible React framework
- **[Vite Team](https://vitejs.dev/)**: For the lightning-fast build tool
- **[Tailwind CSS](https://tailwindcss.com/)**: For the excellent utility-first CSS framework
