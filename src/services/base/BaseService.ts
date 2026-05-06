import type { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";
import type {
  ServiceResponse,
  ServiceError,
  RequestConfig,
  CacheOptions,
  PaginationParams,
} from "./ServiceResponse";
import { ServiceErrorFactory, RetryHandler } from "./errorHandling";
import { ServiceCache } from "./cache";
import type { ZodSchema } from "zod";

// Generic type for request parameters
type RequestParams = Record<string, string | number | boolean | undefined | null>;

export abstract class BaseService {
  protected httpClient: AxiosInstance;
  protected cache: ServiceCache;
  protected defaultTimeout: number = 10000;
  protected defaultRetries: number = 3;
  protected defaultRetryDelay: number = 1000;
  private cleanupInterval: NodeJS.Timeout | null = null;
  protected abstract readonly serviceName: string;

  constructor(httpClient: AxiosInstance, enablePeriodicCleanup: boolean = false) {
    this.httpClient = httpClient;
    this.cache = new ServiceCache();

    // Set up periodic cache cleanup only if explicitly enabled
    // This prevents memory leaks in environments where services are created frequently
    if (enablePeriodicCleanup) {
      this.cleanupInterval = setInterval(() => {
        this.cache.cleanup();
      }, 60000); // Cleanup every minute
    }
  }

  /**
   * Cleanup method to prevent memory leaks
   * Should be called when service instance is no longer needed
   */
  public cleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.cache.clear();
  }

  /**
   * Dispose method for TypeScript destructor pattern
   */
  public dispose(): void {
    this.cleanup();
  }

  protected async request<T>(
    config: AxiosRequestConfig,
    options: RequestConfig = {},
    validationSchema?: ZodSchema<T>,
  ): Promise<ServiceResponse<T>> {
    const startTime = Date.now();
    const cacheKey = this.cache.generateKeyForService(
      config.url || "",
      config.params as RequestParams,
      this.serviceName,
    );

    // Check cache first if caching is enabled
    if (options.cache) {
      const cachedData = this.cache.get<T>(cacheKey);
      if (cachedData) {
        return {
          data: cachedData,
          error: null,
          isLoading: false,
          fromCache: true,
          success: true,
        };
      }
    }

    try {
      // Prepare request configuration
      const requestConfig: AxiosRequestConfig = {
        ...config,
        timeout: options.timeout ?? this.defaultTimeout,
      };

      // Execute request with retry logic
      const response = await RetryHandler.retryWithBackoff(
        () => this.httpClient.request(requestConfig),
        options.retries ?? this.defaultRetries,
        options.retryDelay ?? this.defaultRetryDelay,
      );

      let data = response.data;

      // Validate response data if schema is provided
      if (validationSchema) {
        try {
          data = validationSchema.parse(data);
        } catch (validationError) {
          const error = ServiceErrorFactory.fromValidationError(validationError);
          return this.createErrorResponse<T>(error, Date.now() - startTime);
        }
      }

      // Cache successful response if caching is enabled
      if (options.cache) {
        this.cache.set(cacheKey, data, options.cache);
      }

      return {
        data,
        error: null,
        isLoading: false,
        fromCache: false,
        success: true,
      };
    } catch (error) {
      const serviceError = this.handleRequestError(error, options);
      return this.createErrorResponse<T>(serviceError, Date.now() - startTime);
    }
  }

  protected async get<T>(
    url: string,
    params?: RequestParams,
    options: RequestConfig = {},
    validationSchema?: ZodSchema<T>,
  ): Promise<ServiceResponse<T>> {
    return this.request<T>(
      {
        method: "GET",
        url,
        params,
      },
      options,
      validationSchema,
    );
  }

  protected async post<T>(
    url: string,
    data?: unknown,
    options: RequestConfig = {},
    validationSchema?: ZodSchema<T>,
  ): Promise<ServiceResponse<T>> {
    return this.request<T>(
      {
        method: "POST",
        url,
        data,
      },
      options,
      validationSchema,
    );
  }

  protected async put<T>(
    url: string,
    data?: unknown,
    options: RequestConfig = {},
    validationSchema?: ZodSchema<T>,
  ): Promise<ServiceResponse<T>> {
    return this.request<T>(
      {
        method: "PUT",
        url,
        data,
      },
      options,
      validationSchema,
    );
  }

  protected async delete<T>(
    url: string,
    options: RequestConfig = {},
    validationSchema?: ZodSchema<T>,
  ): Promise<ServiceResponse<T>> {
    return this.request<T>(
      {
        method: "DELETE",
        url,
      },
      options,
      validationSchema,
    );
  }

  // Utility method for paginated requests
  protected async getPaginated<T>(
    url: string,
    params: PaginationParams & RequestParams = {},
    options: RequestConfig = {},
    validationSchema?: ZodSchema<T>,
  ): Promise<
    ServiceResponse<{
      results: T[];
      page: number;
      total_pages: number;
      total_results: number;
    }>
  > {
    const response = await this.get(url, params, options, validationSchema);

    if (response.success && response.data) {
      // Check if response.data has TMDB pagination format
      const data = response.data as unknown;
      if (
        data &&
        typeof data === "object" &&
        "results" in data &&
        "page" in data &&
        "total_pages" in data
      ) {
        const { results, page, total_pages, total_results } = data as {
          results: T[];
          page: number;
          total_pages: number;
          total_results: number;
        };

        return {
          data: {
            results,
            page,
            total_pages,
            total_results,
          },
          error: null,
          isLoading: false,
          fromCache: response.fromCache,
          success: true,
        };
      }
    }

    return response as ServiceResponse<{
      results: T[];
      page: number;
      total_pages: number;
      total_results: number;
    }>;
  }

  private handleRequestError(error: unknown, options: RequestConfig): ServiceError {
    // Handle timeout errors
    if (error instanceof Error && error.message.includes("timeout")) {
      return ServiceErrorFactory.fromTimeoutError(options.timeout ?? this.defaultTimeout);
    }

    // Handle Axios errors
    if (this.isAxiosError(error)) {
      return ServiceErrorFactory.fromAxiosError(error);
    }

    // Handle network errors
    return ServiceErrorFactory.fromNetworkError(error);
  }

  private isAxiosError(error: unknown): error is AxiosError {
    return error instanceof Object && "isAxiosError" in error;
  }

  private createErrorResponse<T>(error: ServiceError, duration: number): ServiceResponse<T> {
    // Log error for debugging
    console.error(`Service Error [${error.code}]: ${error.message}`, {
      statusCode: error.statusCode,
      duration: `${duration}ms`,
      originalError: error.originalError,
    });

    return {
      data: null,
      error,
      isLoading: false,
      fromCache: false,
      success: false,
    };
  }

  // Cache management utilities
  protected invalidateCache(pattern?: string): void {
    if (pattern) {
      // Invalidate cache entries matching pattern
      const stats = this.cache.getStats();
      stats.keys.filter((key) => key.includes(pattern)).forEach((key) => this.cache.delete(key));
    } else {
      // Clear all cache
      this.cache.clear();
    }
  }

  protected getCacheStats() {
    return this.cache.getStats();
  }

  // Utility method to create cache options
  protected createCacheOptions(ttl: number, key?: string): CacheOptions {
    return {
      ttl,
      key,
      invalidateOnMutation: true,
    };
  }
}
