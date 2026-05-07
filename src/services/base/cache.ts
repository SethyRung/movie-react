import type { CacheOptions } from "./ServiceResponse";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export class ServiceCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private readonly defaultTTL: number;

  constructor() {
    // Environment-specific TTLs
    this.defaultTTL = this.getEnvironmentSpecificTTL();
  }

  private getEnvironmentSpecificTTL(): number {
    const isDevelopment = import.meta.env.DEV;
    const isTest = import.meta.env.MODE === "test";

    if (isTest) {
      return 30 * 1000; // 30 seconds for tests
    }

    if (isDevelopment) {
      return 2 * 60 * 1000; // 2 minutes for development (fresher data)
    }

    return 10 * 60 * 1000; // 10 minutes for production (better performance)
  }

  set<T>(key: string, data: T, options?: CacheOptions): void {
    const ttl = options?.ttl ?? this.defaultTTL;
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };

    this.cache.set(key, entry);
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    // Check if cache entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // Get cache statistics
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  // Generate cache key from URL and parameters, with optional service name prefix
  static generateKey(
    baseUrl: string,
    params?: Record<string, string | number | boolean | undefined | null>,
    serviceName?: string,
  ): string {
    const paramString = params
      ? "?" +
        new URLSearchParams(
          Object.entries(params)
            .filter(([, value]) => value !== undefined && value !== null)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => [key, String(value)]),
        ).toString()
      : "";

    // Include service name to prevent cache key collisions between services
    const prefix = serviceName ? `${serviceName}:` : "";
    return `${prefix}${baseUrl}${paramString}`;
  }

  // Generate cache key for a specific service instance
  generateKeyForService(
    baseUrl: string,
    params?: Record<string, string | number | boolean | undefined | null>,
    serviceName?: string,
  ): string {
    return ServiceCache.generateKey(baseUrl, params, serviceName);
  }
}
