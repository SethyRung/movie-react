import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { performanceMonitor, debounce, throttle, createIntersectionObserver, createResizeObserver } from '@/utils/performance';

// Hook for measuring component render performance
export function useRenderPerformance(componentName: string) {
  const renderCount = useRef(0);
  // eslint-disable-next-line react-hooks/purity
  const lastRenderTime = useRef(performance.now());

  useEffect(() => {
    renderCount.current += 1;
    const now = performance.now();
    const timeSinceLastRender = now - lastRenderTime.current;

    performanceMonitor.startMeasure(`${componentName}-render`, {
      renderCount: renderCount.current,
      timeSinceLastRender,
    });

    // End measure after the render is complete
    requestAnimationFrame(() => {
      performanceMonitor.endMeasure(`${componentName}-render`);
    });

    lastRenderTime.current = now;
  }); // eslint-disable-line react-hooks/exhaustive-deps
}

// Hook for debounced callbacks
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): (...args: Parameters<T>) => void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(
    debounce((...args: unknown[]) => callbackRef.current(...args as Parameters<T>), delay) as (...args: Parameters<T>) => void,
    [delay, ...deps]
  );
}

// Hook for throttled callbacks
export function useThrottledCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  limit: number,
  deps: React.DependencyList = []
): (...args: Parameters<T>) => void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(
    throttle((...args: unknown[]) => callbackRef.current(...args as Parameters<T>), limit) as (...args: Parameters<T>) => void,
    [limit, ...deps]
  );
}

// Hook for memoized values
export function useMemoizedValue<T>(value: T): T {
  const memoizedRef = useRef<{
    value: T;
  } | undefined>(undefined);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  if (memoizedRef.current == null) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    memoizedRef.current = {
      value,
    };
  } else if (memoizedRef.current.value !== value) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    memoizedRef.current = {
      value,
    };
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return memoizedRef.current!.value;
}

// Hook for intersection observer (lazy loading)
export function useIntersectionObserver(
  options?: IntersectionObserverInit,
  deps: React.DependencyList = []
) {
  const [entries, setEntries] = useState<IntersectionObserverEntry[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const observe = useCallback((element: Element) => {
    if (observerRef.current) {
      observerRef.current.observe(element);
    }
  }, []);

  const unobserve = useCallback((element: Element) => {
    if (observerRef.current) {
      observerRef.current.unobserve(element);
    }
  }, []);

  useEffect(() => {
    observerRef.current = createIntersectionObserver((newEntries) => {
      setEntries(newEntries);
    }, options);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, ...deps]);

  return { entries, observe, unobserve };
}

// Hook for resize observer
export function useResizeObserver<T extends Element>(
  delay: number = 100,
  deps: React.DependencyList = []
) {
  const [entries, setEntries] = useState<ResizeObserverEntry[]>([]);
  const observerRef = useRef<ResizeObserver | null>(null);

  const observe = useCallback((element: T) => {
    if (observerRef.current) {
      observerRef.current.observe(element);
    }
  }, []);

  const unobserve = useCallback((element: T) => {
    if (observerRef.current) {
      observerRef.current.unobserve(element);
    }
  }, []);

  useEffect(() => {
    observerRef.current = createResizeObserver((newEntries) => {
      setEntries(newEntries);
    }, delay);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, ...deps]);

  return { entries, observe, unobserve };
}

// Hook for measuring async operations
export function useAsyncPerformance<T extends (...args: unknown[]) => Promise<unknown>>(
  name: string,
  asyncFn: T
): T {
  return useCallback(async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const result = await performanceMonitor.measureAsync(name, () => asyncFn(...args), {
      args: args.length,
      timestamp: Date.now(),
    });
    return result as ReturnType<T>;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, asyncFn]) as T;
}

// Hook for monitoring scroll performance
export function useScrollPerformance(delay: number = 16) {
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  
  const throttledHandleScroll = useMemo(() => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return throttle(() => {
      if (!isScrolling) {
        setIsScrolling(true);
      }

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, delay);
    }, delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, isScrolling]);

  useEffect(() => {
    document.addEventListener('scroll', throttledHandleScroll, { passive: true });

    return () => {
      document.removeEventListener('scroll', throttledHandleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [throttledHandleScroll]);

  return isScrolling;
}

// Hook for resource preloading
export function useResourcePreloader() {
  const [preloadedResources, setPreloadedResources] = useState<Set<string>>(new Set());
  const [preloadingErrors, setPreloadingErrors] = useState<Set<string>>(new Set());

  const preloadResource = useCallback(async (url: string, type: 'image' | 'script' | 'style') => {
    if (preloadedResources.has(url)) {
      return;
    }

    const actualPreload = async () => {
      if (type === 'image') {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = url;
        document.head.appendChild(link);
      } else if (type === 'script') {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'script';
        link.href = url;
        document.head.appendChild(link);
      } else if (type === 'style') {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = url;
        document.head.appendChild(link);
      }
    };

    try {
      await performanceMonitor.measureAsync(
        `preload-${type}-${url}`,
        actualPreload
      );

      setPreloadedResources(prev => new Set([...prev, url]));
    } catch (error) {
      console.error(`Failed to preload ${type}: ${url}`, error);
      setPreloadingErrors(prev => new Set([...prev, url]));
    }
  }, [preloadedResources]);

  const preloadMultipleResources = useCallback(async (
    resources: Array<{ url: string; type: 'image' | 'script' | 'style' }>
  ) => {
    const promises = resources.map(({ url, type }) => preloadResource(url, type));
    await Promise.allSettled(promises);
  }, [preloadResource]);

  return {
    preloadResource,
    preloadMultipleResources,
    preloadedResources,
    preloadingErrors,
  };
}

// Hook for measuring web vitals
export function useWebVitals() {
  const [vitals, setVitals] = useState({
    LCP: 0,
    FID: 0,
    CLS: 0,
    FCP: 0,
    TTFB: 0,
  });

  useEffect(() => {
    // Measure Largest Contentful Paint
    try {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        setVitals(prev => ({ ...prev, LCP: lastEntry.startTime }));
      }).observe({ entryTypes: ['largest-contentful-paint'] });
    } catch {
      console.warn('LCP measurement not supported');
    }

    // Measure First Input Delay
    try {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          setVitals(prev => ({
            ...prev,
            FID: (entry as PerformanceEventTiming).processingStart - entry.startTime
          }));
        });
      }).observe({ entryTypes: ['first-input'] });
    } catch {
      console.warn('FID measurement not supported');
    }

    // Measure Cumulative Layout Shift
    try {
      let clsValue = 0;
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (!(entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number }).hadRecentInput) {
            clsValue += (entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number }).value || 0;
            setVitals(prev => ({ ...prev, CLS: clsValue }));
          }
        });
      }).observe({ entryTypes: ['layout-shift'] });
    } catch {
      console.warn('CLS measurement not supported');
    }

    // Measure First Contentful Paint
    try {
      const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0] as PerformanceEntry;
      if (fcpEntry) {
        setTimeout(() => {
          setVitals(prev => ({ ...prev, FCP: fcpEntry.startTime }));
        }, 0);
      }
    } catch {
      console.warn('FCP measurement not available');
    }

    // Measure Time to First Byte
    try {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        setTimeout(() => {
          setVitals(prev => ({ ...prev, TTFB: navigationEntry.responseStart - navigationEntry.requestStart }));
        }, 0);
      }
    } catch {
      console.warn('TTFB measurement not available');
    }
  }, []);

  return vitals;
}