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

let ipv4Only = false;
let ipv4AgentPromise: Promise<import("undici").Agent> | null = null;

async function fetchIpv4(url: URL): Promise<Response> {
  const { Agent, fetch: undiciFetch } = await import("undici");
  ipv4AgentPromise ??= Promise.resolve(new Agent({ connect: { family: 4, timeout: 10_000 } }));
  return (await undiciFetch(url, {
    dispatcher: await ipv4AgentPromise,
  })) as unknown as Response;
}

async function tmdbFetch(url: URL, revalidate: number): Promise<Response> {
  if (!ipv4Only) {
    try {
      return await fetch(url, { next: { revalidate } });
    } catch (error) {
      if (!(error instanceof TypeError)) throw error;
      ipv4Only = true;
    }
  }

  return fetchIpv4(url);
}

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

    const response = await tmdbFetch(url, config.revalidate ?? 300);

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
