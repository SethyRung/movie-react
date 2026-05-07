import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router-dom";

const HomePage = lazy(() => import("@/pages/HomePage"));
const MovieListPage = lazy(() => import("@/pages/MovieListPage"));
const MovieDetailPage = lazy(() => import("@/pages/MovieDetailPage"));
const SearchPage = lazy(() => import("@/pages/SearchPage"));
const GenrePage = lazy(() => import("@/pages/GenrePage"));
const PersonDetailPage = lazy(() => import("@/pages/PersonDetailPage"));
const WatchlistPage = lazy(() => import("@/pages/WatchlistPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <Suspense fallback={<PageLoader />}>
        <HomePage />
      </Suspense>
    ),
  },
  {
    path: "/movies",
    element: (
      <Suspense fallback={<PageLoader />}>
        <MovieListPage />
      </Suspense>
    ),
  },
  {
    path: "/movies/:id",
    element: (
      <Suspense fallback={<PageLoader />}>
        <MovieDetailPage />
      </Suspense>
    ),
  },
  {
    path: "/search",
    element: (
      <Suspense fallback={<PageLoader />}>
        <SearchPage />
      </Suspense>
    ),
  },
  {
    path: "/genre/:genreId",
    element: (
      <Suspense fallback={<PageLoader />}>
        <GenrePage />
      </Suspense>
    ),
  },
  {
    path: "/person/:personId",
    element: (
      <Suspense fallback={<PageLoader />}>
        <PersonDetailPage />
      </Suspense>
    ),
  },
  {
    path: "/watchlist",
    element: (
      <Suspense fallback={<PageLoader />}>
        <WatchlistPage />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<PageLoader />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
];
