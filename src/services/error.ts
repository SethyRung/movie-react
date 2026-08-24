import { ZodError } from "zod";

export interface ServiceError {
  code: string;
  message: string;
  statusCode?: number;
  originalError?: unknown;
}

export function isServiceError(error: unknown): error is ServiceError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error &&
    typeof (error as { code: unknown }).code === "string" &&
    typeof (error as { message: unknown }).message === "string"
  );
}

export class HttpResponseError extends Error {
  statusCode: number;
  statusMessage?: string;

  constructor(statusCode: number, statusMessage?: string) {
    super(statusMessage ?? `Request failed with status ${statusCode}`);
    this.name = "HttpResponseError";
    this.statusCode = statusCode;
    this.statusMessage = statusMessage;
  }
}

function errorCode(statusCode?: number): string {
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

function errorMessage(statusCode?: number, statusMessage?: string): string {
  if (statusMessage) return statusMessage;

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
      return "An unexpected error occurred.";
  }
}

export function toServiceError(error: unknown): ServiceError {
  if (isServiceError(error)) return error;

  if (error instanceof ZodError) {
    return {
      code: "VALIDATION_ERROR",
      message: "Invalid data received from server.",
      originalError: error,
    };
  }

  if (error instanceof HttpResponseError) {
    return {
      code: errorCode(error.statusCode),
      message: errorMessage(error.statusCode, error.statusMessage),
      statusCode: error.statusCode,
      originalError: error,
    };
  }

  if (error instanceof DOMException && error.name === "TimeoutError") {
    return {
      code: "TIMEOUT_ERROR",
      message: "Request timed out. Please try again.",
      statusCode: 408,
      originalError: error,
    };
  }

  if (error instanceof TypeError) {
    return {
      code: "NETWORK_ERROR",
      message: "Network connection failed. Please check your internet connection.",
      originalError: error,
    };
  }

  return {
    code: "UNKNOWN_ERROR",
    message: "An unexpected error occurred.",
    originalError: error,
  };
}
