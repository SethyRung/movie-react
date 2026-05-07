import { AxiosError } from "axios";
import type { ServiceError } from "./ServiceResponse";

export class ServiceErrorFactory {
  static fromAxiosError(error: AxiosError): ServiceError {
    const statusCode = error.response?.status;
    const message = this.extractErrorMessage(error);

    return {
      code: this.getErrorCode(statusCode),
      message,
      statusCode,
      originalError: error,
    };
  }

  static fromNetworkError(error: unknown): ServiceError {
    return {
      code: "NETWORK_ERROR",
      message: "Network connection failed. Please check your internet connection.",
      originalError: error,
    };
  }

  static fromValidationError(error: unknown): ServiceError {
    return {
      code: "VALIDATION_ERROR",
      message: "Invalid data received from server.",
      originalError: error,
    };
  }

  static fromTimeoutError(timeout: number): ServiceError {
    return {
      code: "TIMEOUT_ERROR",
      message: `Request timed out after ${timeout}ms.`,
      statusCode: 408,
    };
  }

  private static extractErrorMessage(error: AxiosError): string {
    // Try to extract error message from TMDB API response
    const tmdbMessage = (error.response?.data as { status_message?: string })?.status_message;
    if (tmdbMessage) {
      return tmdbMessage;
    }

    // Fallback to standard HTTP messages
    const statusCode = error.response?.status;
    switch (statusCode) {
      case 400:
        return "Bad request. Please check your parameters.";
      case 401:
        return "Authentication failed. Please check your API credentials.";
      case 403:
        return "Access forbidden. You don't have permission to access this resource.";
      case 404:
        return "The requested resource was not found.";
      case 429:
        return "Too many requests. Please wait before trying again.";
      case 500:
        return "Internal server error. Please try again later.";
      case 502:
        return "Bad gateway. The server encountered an error.";
      case 503:
        return "Service unavailable. Please try again later.";
      default:
        return error.message || "An unexpected error occurred.";
    }
  }

  private static getErrorCode(statusCode?: number): string {
    switch (statusCode) {
      case 400:
        return "BAD_REQUEST";
      case 401:
        return "UNAUTHORIZED";
      case 403:
        return "FORBIDDEN";
      case 404:
        return "NOT_FOUND";
      case 408:
        return "TIMEOUT";
      case 429:
        return "RATE_LIMIT_EXCEEDED";
      case 500:
        return "INTERNAL_SERVER_ERROR";
      case 502:
        return "BAD_GATEWAY";
      case 503:
        return "SERVICE_UNAVAILABLE";
      default:
        return "UNKNOWN_ERROR";
    }
  }
}

export class RetryHandler {
  static async retryWithBackoff<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000,
  ): Promise<T> {
    let lastError: unknown;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        // Don't retry on client errors (4xx) except 429 (rate limit)
        if (error instanceof AxiosError) {
          const statusCode = error.response?.status;
          if (statusCode && statusCode >= 400 && statusCode < 500 && statusCode !== 429) {
            throw error;
          }
        }

        // If this is the last attempt, throw the error
        if (attempt === maxRetries) {
          throw error;
        }

        // Calculate exponential backoff delay
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }
}
