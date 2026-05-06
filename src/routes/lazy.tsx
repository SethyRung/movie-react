import { lazy } from "react";
import { withLazyLoad } from "@/components/ui/Loading";

// Lazy loaded components with error boundaries
export const LazyHomePage = withLazyLoad(() => import("@/pages/Home"), {
  errorBoundary: true,
  retryCount: 3,
  fallback: (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading Home...</p>
      </div>
    </div>
  ),
});

export const LazyMovieListPage = withLazyLoad(() => import("@/pages/Movies/MovieListPage"), {
  errorBoundary: true,
  retryCount: 3,
  fallback: (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading Movies...</p>
      </div>
    </div>
  ),
});

export const LazyMovieDetailPage = withLazyLoad(() => import("@/pages/Movies/MovieDetailPage"), {
  errorBoundary: true,
  retryCount: 3,
  fallback: (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading Movie Details...</p>
      </div>
    </div>
  ),
});

export const LazyNotFoundPage = withLazyLoad(() => import("@/pages/NotFound/NotFoundPage"), {
  errorBoundary: true,
  retryCount: 2,
  fallback: (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  ),
});

/* eslint-disable react-refresh/only-export-components */
// Prefetch utilities
export const prefetchHomePage = () => {
  import("@/pages/Home");
};

export const prefetchMoviePages = () => {
  import("@/pages/Movies/MovieListPage");
  import("@/pages/Movies/MovieDetailPage");
};

export const prefetchNotFoundPage = () => {
  import("@/pages/NotFound/NotFoundPage");
};

// Critical components (non-lazy)
export const CriticalComponents = {
  Navbar: lazy(() => import("@/components/AppHeader")),
  Footer: lazy(() => import("@/components/AppFooter")),
};

export default {
  LazyHomePage,
  LazyMovieListPage,
  LazyMovieDetailPage,
  LazyNotFoundPage,
  CriticalComponents,
  prefetchHomePage,
  prefetchMoviePages,
  prefetchNotFoundPage,
};
/* eslint-enable react-refresh/only-export-components */
