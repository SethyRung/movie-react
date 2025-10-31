// Performance monitoring utilities
export interface PerformanceMetrics {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, unknown>;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private observers: PerformanceObserver[] = [];

  // Start measuring a performance metric
  startMeasure(name: string, metadata?: Record<string, unknown>): void {
    this.metrics.set(name, {
      name,
      startTime: performance.now(),
      metadata,
    });
  }

  // End measuring a performance metric
  endMeasure(name: string): PerformanceMetrics | null {
    const metric = this.metrics.get(name);
    if (!metric) {
      console.warn(`No metric found for: ${name}`);
      return null;
    }

    const endTime = performance.now();
    const duration = endTime - metric.startTime;

    const completedMetric: PerformanceMetrics = {
      ...metric,
      endTime,
      duration,
    };

    this.metrics.set(name, completedMetric);
    this.logMetric(completedMetric);

    return completedMetric;
  }

  // Get a specific metric
  getMetric(name: string): PerformanceMetrics | undefined {
    return this.metrics.get(name);
  }

  // Get all metrics
  getAllMetrics(): PerformanceMetrics[] {
    return Array.from(this.metrics.values());
  }

  // Clear all metrics
  clearMetrics(): void {
    this.metrics.clear();
  }

  // Log metric to console
  private logMetric(metric: PerformanceMetrics): void {
    if (import.meta.env.DEV) {
      console.log(`📊 Performance: ${metric.name}`, {
        duration: `${metric.duration?.toFixed(2)}ms`,
        metadata: metric.metadata,
      });
    }
  }

  // Measure async function execution
  async measureAsync<T>(
    name: string,
    fn: () => Promise<T>,
    metadata?: Record<string, unknown>
  ): Promise<T> {
    this.startMeasure(name, metadata);
    try {
      const result = await fn();
      this.endMeasure(name);
      return result;
    } catch (error) {
      this.endMeasure(name);
      throw error;
    }
  }

  // Measure sync function execution
  measureSync<T>(
    name: string,
    fn: () => T,
    metadata?: Record<string, unknown>
  ): T {
    this.startMeasure(name, metadata);
    try {
      const result = fn();
      this.endMeasure(name);
      return result;
    } catch (error) {
      this.endMeasure(name);
      throw error;
    }
  }

  // Monitor Web Vitals
  observeWebVitals(): void {
    if (typeof window === 'undefined') return;

    // Largest Contentful Paint (LCP)
    try {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('🎯 LCP:', lastEntry.startTime);
      }).observe({ entryTypes: ['largest-contentful-paint'] });
    } catch {
      console.warn('LCP observation not supported');
    }

    // First Input Delay (FID)
    try {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          console.log('⚡ FID:', (entry as PerformanceEventTiming).processingStart - entry.startTime);
        });
      }).observe({ entryTypes: ['first-input'] });
    } catch {
      console.warn('FID observation not supported');
    }

    // Cumulative Layout Shift (CLS)
    try {
      let clsValue = 0;
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (!(entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number }).hadRecentInput) {
            clsValue += (entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number }).value || 0;
          }
        });
        console.log('📐 CLS:', clsValue);
      }).observe({ entryTypes: ['layout-shift'] });
    } catch {
      console.warn('CLS observation not supported');
    }
  }

  // Disconnect all observers
  disconnect(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Debounce utility for performance
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Throttle utility for performance
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Memoization utility
export function memoize<T extends (...args: unknown[]) => unknown>(
  func: T,
  keyGenerator?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = func(...args) as ReturnType<T>;
    cache.set(key, result);
    return result;
  }) as T;
}

// Request idle callback utility
export function requestIdleCallback(
  callback: (deadline?: IdleDeadline) => void,
  options?: IdleRequestOptions
): number {
  if (window.requestIdleCallback) {
    return window.requestIdleCallback(callback, options);
  }

  // Fallback for browsers without requestIdleCallback
  return setTimeout(() => callback(), 1) as unknown as number;
}

export function cancelIdleCallback(handle: number): void {
  if (window.cancelIdleCallback) {
    window.cancelIdleCallback(handle);
  } else {
    clearTimeout(handle);
  }
}

// Preload resources
export function preloadResource(url: string, type: 'image' | 'script' | 'style'): Promise<void> {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = type;

    if (type === 'image') {
      link.type = 'image/webp'; // Default to webp for images
    }

    link.onload = () => {
      document.head.removeChild(link);
      resolve();
    };

    link.onerror = () => {
      document.head.removeChild(link);
      reject(new Error(`Failed to preload: ${url}`));
    };

    document.head.appendChild(link);
  });
}

// Intersection Observer utility for lazy loading
export function createIntersectionObserver(
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
): IntersectionObserver {
  return new IntersectionObserver(callback, {
    rootMargin: '50px 0px',
    threshold: 0.1,
    ...options,
  });
}

// Resize Observer utility with debouncing
export function createResizeObserver(
  callback: ResizeObserverCallback,
  delay: number = 100
): ResizeObserver {
  let timeoutId: NodeJS.Timeout;

  return new ResizeObserver((entries, observer) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(entries, observer), delay);
  });
}

export default performanceMonitor;