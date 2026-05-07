import { lazy, Suspense, type ReactNode } from "react";
import type { RouteObject } from "react-router-dom";
import { AnimatedPage } from "@/components/animations/AnimatedPage";

const HomePage = lazy(() => import("@/pages/HomePage"));
const MovieListPage = lazy(() => import("@/pages/MovieListPage"));
const MovieDetailPage = lazy(() => import("@/pages/MovieDetailPage"));
const SearchPage = lazy(() => import("@/pages/SearchPage"));
const GenrePage = lazy(() => import("@/pages/GenrePage"));
const PersonDetailPage = lazy(() => import("@/pages/PersonDetailPage"));
const WatchlistPage = lazy(() => import("@/pages/WatchlistPage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
      <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  );
}

function WrapAnimated({ children }: { children: ReactNode }) {
  return <AnimatedPage>{children}</AnimatedPage>;
}

export const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <Suspense fallback={<PageLoader />}>
        <WrapAnimated>
          <HomePage />
        </WrapAnimated>
      </Suspense>
    ),
  },
  {
    path: "/movies",
    element: (
      <Suspense fallback={<PageLoader />}>
        <WrapAnimated>
          <MovieListPage />
        </WrapAnimated>
      </Suspense>
    ),
  },
  {
    path: "/movies/:id",
    element: (
      <Suspense fallback={<PageLoader />}>
        <WrapAnimated>
          <MovieDetailPage />
        </WrapAnimated>
      </Suspense>
    ),
  },
  {
    path: "/search",
    element: (
      <Suspense fallback={<PageLoader />}>
        <WrapAnimated>
          <SearchPage />
        </WrapAnimated>
      </Suspense>
    ),
  },
  {
    path: "/genre/:genreId",
    element: (
      <Suspense fallback={<PageLoader />}>
        <WrapAnimated>
          <GenrePage />
        </WrapAnimated>
      </Suspense>
    ),
  },
  {
    path: "/person/:personId",
    element: (
      <Suspense fallback={<PageLoader />}>
        <WrapAnimated>
          <PersonDetailPage />
        </WrapAnimated>
      </Suspense>
    ),
  },
  {
    path: "/watchlist",
    element: (
      <Suspense fallback={<PageLoader />}>
        <WrapAnimated>
          <WatchlistPage />
        </WrapAnimated>
      </Suspense>
    ),
  },
  {
    path: "/about",
    element: (
      <Suspense fallback={<PageLoader />}>
        <WrapAnimated>
          <AboutPage />
        </WrapAnimated>
      </Suspense>
    ),
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<PageLoader />}>
        <WrapAnimated>
          <NotFoundPage />
        </WrapAnimated>
      </Suspense>
    ),
  },
];
