import { Suspense, lazy, ComponentType, ReactNode, useMemo } from 'react';
import { LoadingScreen } from './LoadingScreen';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

interface LazyLoadProps<P extends Record<string, unknown> = Record<string, unknown>> {
  loader: () => Promise<{ default: ComponentType<P> }>;
  fallback?: ReactNode;
  errorFallback?: ReactNode;
  errorBoundary?: boolean;
  retry?: boolean;
  retryCount?: number;
  props: P;
}

// Non-generic version for export
export type LazyLoadPropsNonGeneric = LazyLoadProps<Record<string, unknown>>;


export const LazyLoad = <P extends Record<string, unknown> = Record<string, unknown>>({
  loader,
  fallback,
  errorFallback,
  errorBoundary = true,
  retry = true,
  retryCount = 3,
  props,
}: LazyLoadProps<P>) => {
  /* eslint-disable react-hooks/static-components */
  const LazyComponent = useMemo(() => lazy(() => {
    return new Promise<{ default: ComponentType<Record<string, unknown>> }>((resolve, reject) => {
      const attemptLoad = (attempt: number) => {
        loader()
          .then((module) => resolve(module as { default: ComponentType<Record<string, unknown>> }))
          .catch((error) => {
            if (retry && attempt < retryCount) {
              console.warn(`Lazy load failed (attempt ${attempt + 1}/${retryCount}):`, error);
              setTimeout(() => attemptLoad(attempt + 1), 1000 * Math.pow(2, attempt));
            } else {
              reject(error);
            }
          });
      };
      attemptLoad(0);
    });
  }), [loader, retry, retryCount]);
  /* eslint-enable react-hooks/static-components */

  const loadingFallback = useMemo(() => fallback || (
    <LoadingScreen
      message="Loading component..."
      variant="minimal"
      showProgress={false}
    />
  ), [fallback]);

  const errorComponent = useMemo(() => errorFallback || (
    <div className="flex items-center justify-center p-8 text-center">
      <div className="space-y-4">
        <div className="text-destructive">
          <svg
            className="h-12 w-12 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            Failed to load component
          </h3>
          <p className="text-muted-foreground text-sm">
            Please check your connection and try again.
          </p>
        </div>
        {retry && (
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  ), [errorFallback, retry]);

  /* eslint-disable react-hooks/static-components */
  const content = (
    <Suspense fallback={loadingFallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
  /* eslint-enable react-hooks/static-components */

  if (errorBoundary) {
    return (
      <ErrorBoundary
        fallback={errorComponent}
        maxRetries={retryCount}
        enableErrorReporting={import.meta.env.PROD}
      >
        {content}
      </ErrorBoundary>
    );
  }

  return content;
};

// Higher-order component for lazy loading
/* eslint-disable react-refresh/only-export-components */
export const withLazyLoad = <P extends Record<string, unknown> = Record<string, unknown>>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  options: Omit<LazyLoadProps<P>, 'loader' | 'props'> = {}
) => {
  const LazyComponent = (props: P) => (
    <LazyLoad<P>
      loader={importFunc}
      {...options}
      props={props}
    />
  );

  LazyComponent.displayName = `withLazyLoad(${importFunc.name || 'Component'})`;
  return LazyComponent as ComponentType<P>;
};

export default LazyLoad;
/* eslint-enable react-refresh/only-export-components */