import type { ZodSchema } from "zod";
import { HttpResponseError, toServiceError, type ServiceError } from "./error";

const TMDB_BASE_URL = process.env.TMDB_API_URL ?? "https://api.themoviedb.org/3";
const TMDB_API_KEY = process.env.TMDB_API_KEY;

export type TmdbRequestConfig = {
  path: string;
  params?: Record<string, string | number | boolean | undefined>;
  /** Next.js fetch cache TTL in seconds. Defaults to 300 (5m). */
  revalidate?: number;
};

export async function request<T>(config: TmdbRequestConfig, schema: ZodSchema<T>): Promise<T> {
  if (!TMDB_API_KEY) {
    const missing: ServiceError = {
      code: "MISSING_API_KEY",
      message: "TMDB_API_KEY is not configured.",
    };
    throw missing;
  }

  try {
    const base = TMDB_BASE_URL.replace(/\/$/, "");
    const url = new URL(base + config.path);
    url.searchParams.set("api_key", TMDB_API_KEY);
    if (config.params) {
      for (const [key, value] of Object.entries(config.params)) {
        if (value !== undefined) url.searchParams.set(key, String(value));
      }
    }

    const response = await fetch(url, {
      next: { revalidate: config.revalidate ?? 300 },
    });

    if (!response.ok) {
      let statusMessage: string | undefined;
      try {
        statusMessage = (await response.json())?.status_message as string | undefined;
      } catch {
        /* non-JSON error body */
      }
      throw new HttpResponseError(response.status, statusMessage);
    }

    const data = (await response.json()) as unknown;
    return schema.parse(data);
  } catch (error) {
    throw toServiceError(error);
  }
}
