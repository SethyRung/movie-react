import { request } from "@/services/tmdb";
import { DiscoveryValidationSchemas } from "./validation";
import type { DiscoveryPaginatedResponse } from "./validation";

const DEFAULT_LANG = "en-US";

export type ListKind = "popular" | "nowPlaying" | "upcoming" | "topRated";

const LIST_URLS: Record<ListKind, string> = {
  popular: "/movie/popular",
  nowPlaying: "/movie/now_playing",
  upcoming: "/movie/upcoming",
  topRated: "/movie/top_rated",
};

export async function discoverList(
  kind: ListKind,
  page = 1,
  language = DEFAULT_LANG,
): Promise<DiscoveryPaginatedResponse> {
  return request(
    { path: LIST_URLS[kind], params: { page, language } },
    DiscoveryValidationSchemas.DiscoveryPaginatedResponse,
  );
}

export async function getMoviesByGenre(
  genreId: number,
  page = 1,
  language = DEFAULT_LANG,
): Promise<DiscoveryPaginatedResponse> {
  return request(
    {
      path: "/discover/movie",
      params: { with_genres: String(genreId), page, language },
    },
    DiscoveryValidationSchemas.DiscoveryPaginatedResponse,
  );
}

export type DiscoveryLists = Partial<Record<ListKind, DiscoveryPaginatedResponse>>;

export async function getDiscoveryLists(language = DEFAULT_LANG): Promise<DiscoveryLists> {
  const kinds: ListKind[] = ["popular", "nowPlaying", "upcoming", "topRated"];
  const settled = await Promise.allSettled(kinds.map((k) => discoverList(k, 1, language)));

  const result: DiscoveryLists = {};
  const errors: unknown[] = [];

  settled.forEach((outcome, i) => {
    if (outcome.status === "fulfilled") {
      result[kinds[i]] = outcome.value;
    } else {
      errors.push(outcome.reason);
    }
  });

  if (Object.keys(result).length === 0) {
    throw {
      code: "ALL_DISCOVERY_REQUESTS_FAILED",
      message: "All discovery list requests failed",
      originalError: errors,
    };
  }

  return result;
}
