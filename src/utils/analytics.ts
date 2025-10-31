// Analytics and monitoring utilities
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
  timestamp?: number;
  userId?: string;
  sessionId?: string;
}

export interface PageView {
  path: string;
  title: string;
  referrer?: string;
  timestamp: number;
  userId?: string;
  sessionId?: string;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'count' | 'percentage';
  timestamp: number;
  page?: string;
  userId?: string;
  sessionId?: string;
}

class AnalyticsService {
  private sessionId: string;
  private userId?: string;
  private isEnabled: boolean;
  private apiEndpoint?: string;
  private eventQueue: AnalyticsEvent[] = [];
  private flushTimer?: NodeJS.Timeout;

  constructor(config?: {
    apiEndpoint?: string;
    userId?: string;
    enabled?: boolean;
  }) {
    this.sessionId = this.generateSessionId();
    this.userId = config?.userId;
    this.isEnabled = config?.enabled ?? import.meta.env.PROD;
    this.apiEndpoint = config?.apiEndpoint;

    if (this.isEnabled) {
      this.startPeriodicFlush();
      this.trackPageView();
      this.trackPerformanceMetrics();
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  private startPeriodicFlush(): void {
    // Flush events every 30 seconds
    this.flushTimer = setInterval(() => {
      this.flushEvents();
    }, 30000);

    // Flush on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.flushEvents();
      });
    }
  }

  // Track custom events
  track(event: AnalyticsEvent): void {
    if (!this.isEnabled) return;

    const enrichedEvent: AnalyticsEvent = {
      ...event,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
    };

    this.eventQueue.push(enrichedEvent);

    // Immediately flush critical events
    if (event.name.startsWith('error_') || event.name.startsWith('critical_')) {
      this.flushEvents();
    }
  }

  // Track page views
  trackPageView(path?: string, title?: string): void {
    if (!this.isEnabled) return;

    const pageView: PageView = {
      path: path || (typeof window !== 'undefined' ? window.location.pathname : ''),
      title: title || (typeof document !== 'undefined' ? document.title : ''),
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId,
    };

    this.track({
      name: 'page_view',
      properties: pageView as unknown as Record<string, unknown>,
    });
  }

  // Track user interactions
  trackClick(element: string, properties?: Record<string, unknown>): void {
    this.track({
      name: 'click',
      properties: {
        element,
        ...properties,
      },
    });
  }

  trackSearch(query: string, resultsCount?: number): void {
    this.track({
      name: 'search',
      properties: {
        query,
        resultsCount,
      },
    });
  }

  trackMovieView(movieId: number, movieTitle: string): void {
    this.track({
      name: 'movie_view',
      properties: {
        movieId,
        movieTitle,
      },
    });
  }

  trackFavorite(movieId: number, movieTitle: string, action: 'add' | 'remove'): void {
    this.track({
      name: 'favorite',
      properties: {
        movieId,
        movieTitle,
        action,
      },
    });
  }

  trackWatchlist(movieId: number, movieTitle: string, action: 'add' | 'remove'): void {
    this.track({
      name: 'watchlist',
      properties: {
        movieId,
        movieTitle,
        action,
      },
    });
  }

  // Track performance metrics
  trackPerformanceMetrics(): void {
    if (!this.isEnabled || typeof window === 'undefined') return;

    // Track Web Vitals
    this.trackLCP();
    this.trackFID();
    this.trackCLS();
    this.trackFCP();
    this.trackTTFB();
  }

  private trackLCP(): void {
    try {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.trackPerformanceMetric('LCP', lastEntry.startTime, 'ms');
      }).observe({ entryTypes: ['largest-contentful-paint'] });
    } catch {
      console.warn('LCP tracking not supported');
    }
  }

  private trackFID(): void {
    try {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const fid = (entry as PerformanceEventTiming).processingStart - entry.startTime;
          this.trackPerformanceMetric('FID', fid, 'ms');
        });
      }).observe({ entryTypes: ['first-input'] });
    } catch {
      console.warn('FID tracking not supported');
    }
  }

  private trackCLS(): void {
    try {
      let clsValue = 0;
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (!(entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number }).hadRecentInput) {
            clsValue += (entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number }).value || 0;
            this.trackPerformanceMetric('CLS', clsValue, 'count');
          }
        });
      }).observe({ entryTypes: ['layout-shift'] });
    } catch {
      console.warn('CLS tracking not supported');
    }
  }

  private trackFCP(): void {
    try {
      const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0] as PerformanceEntry;
      if (fcpEntry) {
        this.trackPerformanceMetric('FCP', fcpEntry.startTime, 'ms');
      }
    } catch {
      console.warn('FCP tracking not available');
    }
  }

  private trackTTFB(): void {
    try {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
        this.trackPerformanceMetric('TTFB', ttfb, 'ms');
      }
    } catch {
      console.warn('TTFB tracking not available');
    }
  }

  private trackPerformanceMetric(name: string, value: number, unit: 'ms' | 'bytes' | 'count' | 'percentage'): void {
    this.track({
      name: `performance_${name.toLowerCase()}`,
      properties: {
        value,
        unit,
        page: typeof window !== 'undefined' ? window.location.pathname : undefined,
      },
    });
  }

  // Track errors
  trackError(error: Error, context?: Record<string, unknown>): void {
    this.track({
      name: 'error',
      properties: {
        message: error.message,
        name: error.name,
        stack: error.stack,
        context,
      },
    });
  }

  // Track API calls
  trackApiCall(endpoint: string, method: string, duration: number, status: number, error?: string): void {
    this.track({
      name: 'api_call',
      properties: {
        endpoint,
        method,
        duration,
        status,
        error,
      },
    });
  }

  // Set user ID
  setUserId(userId: string): void {
    this.userId = userId;
  }

  // Flush events to server
  private async flushEvents(): Promise<void> {
    if (!this.isEnabled || !this.apiEndpoint || this.eventQueue.length === 0) {
      return;
    }

    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          events,
          sessionId: this.sessionId,
          userId: this.userId,
          timestamp: Date.now(),
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        }),
      });
    } catch (error) {
      console.error('Failed to send analytics events:', error);
      // Re-add events to queue if failed
      this.eventQueue.unshift(...events);
    }
  }

  // Enable/disable analytics
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    if (enabled && !this.flushTimer) {
      this.startPeriodicFlush();
    } else if (!enabled && this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = undefined;
    }
  }

  // Get current session info
  getSessionInfo(): { sessionId: string; userId?: string } {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
    };
  }

  // Cleanup
  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flushEvents();
  }
}

// Singleton instance
export const analytics = new AnalyticsService({
  enabled: import.meta.env.PROD,
  apiEndpoint: import.meta.env.VITE_ANALYTICS_ENDPOINT,
});

// Hook for using analytics in components
export const useAnalytics = () => {
  return {
    track: analytics.track.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    trackClick: analytics.trackClick.bind(analytics),
    trackSearch: analytics.trackSearch.bind(analytics),
    trackMovieView: analytics.trackMovieView.bind(analytics),
    trackFavorite: analytics.trackFavorite.bind(analytics),
    trackWatchlist: analytics.trackWatchlist.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    setUserId: analytics.setUserId.bind(analytics),
    getSessionInfo: analytics.getSessionInfo.bind(analytics),
  };
};

export default analytics;