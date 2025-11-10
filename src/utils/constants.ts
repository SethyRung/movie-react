export const API_ENDPOINTS = {
  MOVIE: {
    POPULAR: "/movie/popular",
    NOW_PLAYING: "/movie/now_playing",
    UPCOMING: "/movie/upcoming",
    TOP_RATED: "/movie/top_rated",
    DETAILS: (id: number) => `/movie/${id}`,
    CREDITS: (id: number) => `/movie/${id}/credits`,
    VIDEOS: (id: number) => `/movie/${id}/videos`,
    IMAGES: (id: number) => `/movie/${id}/images`,
    KEYWORDS: (id: number) => `/movie/${id}/keywords`,
    SEARCH: "/search/movie",
  },
  TV: {
    POPULAR: "/tv/popular",
    TOP_RATED: "/tv/top_rated",
    ON_THE_AIR: "/tv/on_the_air",
    AIRING_TODAY: "/tv/airing_today",
  },
  GENRE: {
    MOVIE_LIST: "/genre/movie/list",
    TV_LIST: "/genre/tv/list",
  },
} as const;

export const IMAGE_BASE_URL = {
  ORIGINAL: "https://image.tmdb.org/t/p/original",
  W500: "https://image.tmdb.org/t/p/w500",
  W300: "https://image.tmdb.org/t/p/w300",
  W200: "https://image.tmdb.org/t/p/w200",
  W154: "https://image.tmdb.org/t/p/w154",
  W92: "https://image.tmdb.org/t/p/w92",
} as const;

export const DATE_FORMATS = {
  SHORT: "MMM yyyy",
  LONG: "MMM dd, yyyy",
  ISO: "yyyy-MM-dd",
} as const;

export const ROUTES = {
  HOME: "/",
  MOVIES: "/movies",
  MOVIE_DETAILS: (id: number) => `/movies/${id}`,
  SEARCH: "/search",
  FAVORITES: "/favorites",
  NOT_FOUND: "*",
} as const;
