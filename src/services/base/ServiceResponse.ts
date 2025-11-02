export interface ServiceResponse<T> {
  data: T | null;
  error: ServiceError | null;
  isLoading: boolean;
  fromCache: boolean;
  success: boolean;
}

export interface ServiceError {
  code: string;
  message: string;
  statusCode?: number;
  originalError?: unknown;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    totalPages: number;
    totalResults: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  key?: string;
  invalidateOnMutation?: boolean;
}

export interface RequestConfig {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  cache?: CacheOptions;
}

// Type guard functions for ServiceResponse
export function isSuccessResponse<T>(response: ServiceResponse<T>): response is ServiceResponse<T> & { data: T; error: null; success: true } {
  return response.success === true && response.data !== null && response.error === null;
}

export function isErrorResponse<T>(response: ServiceResponse<T>): response is ServiceResponse<T> & { data: null; error: ServiceError; success: false } {
  return response.success === false && response.data === null && response.error !== null;
}

export function isCachedResponse<T>(response: ServiceResponse<T>): boolean {
  return response.fromCache === true;
}

export function isLoadingResponse<T>(response: ServiceResponse<T>): boolean {
  return response.isLoading === true;
}

export function hasData<T>(response: ServiceResponse<T>): response is ServiceResponse<T> & { data: T } {
  return response.data !== null;
}

export function hasError<T>(response: ServiceResponse<T>): response is ServiceResponse<T> & { error: ServiceError } {
  return response.error !== null;
}

// Utility type guard for checking if a response has paginated data
export function isPaginatedResponse<T>(response: ServiceResponse<unknown>): response is ServiceResponse<{
  results: T[];
  page: number;
  total_pages: number;
  total_results: number;
}> {
  return isSuccessResponse(response) &&
         typeof response.data === 'object' &&
         response.data !== null &&
         'results' in response.data &&
         'page' in response.data &&
         'total_pages' in response.data &&
         'total_results' in response.data &&
         Array.isArray(response.data.results);
}

// Type guard for ServiceError validation
export function isValidServiceError(error: unknown): error is ServiceError {
  return typeof error === 'object' &&
         error !== null &&
         'code' in error &&
         'message' in error &&
         typeof (error as Record<string, unknown>).code === 'string' &&
         typeof (error as Record<string, unknown>).message === 'string';
}