import { z } from 'zod';

// Basic movie schema
const MovieSchema = z.object({
  id: z.number(),
  title: z.string(),
  overview: z.string().optional(),
  poster_path: z.string().nullable().optional(),
  backdrop_path: z.string().nullable().optional(),
  release_date: z.string().nullable().optional(),
  genre_ids: z.array(z.number()).optional(),
  popularity: z.number().optional(),
  vote_average: z.number().optional(),
  vote_count: z.number().optional(),
  adult: z.boolean().optional(),
  original_language: z.string().optional(),
  original_title: z.string().optional(),
});

// Movie details schema
const MovieDetailsSchema = MovieSchema.extend({
  budget: z.number().optional(),
  genres: z.array(z.object({
    id: z.number(),
    name: z.string(),
  })).optional(),
  homepage: z.string().nullable().optional(),
  imdb_id: z.string().nullable().optional(),
  production_companies: z.array(z.object({
    id: z.number(),
    logo_path: z.string().nullable().optional(),
    name: z.string(),
    origin_country: z.string(),
  })).optional(),
  production_countries: z.array(z.object({
    iso_3166_1: z.string(),
    name: z.string(),
  })).optional(),
  revenue: z.number().optional(),
  runtime: z.number().nullable().optional(),
  spoken_languages: z.array(z.object({
    english_name: z.string(),
    iso_639_1: z.string(),
    name: z.string(),
  })).optional(),
  status: z.string().optional(),
  tagline: z.string().nullable().optional(),
  video: z.boolean().optional(),
  vote_average: z.number(),
  vote_count: z.number(),
});

// Cast member schema
const CastMemberSchema = z.object({
  id: z.number(),
  cast_id: z.number().optional(),
  character: z.string().optional(),
  credit_id: z.string(),
  order: z.number().optional(),
  name: z.string(),
  adult: z.boolean().optional(),
  gender: z.number().optional(),
  known_for_department: z.string().optional(),
  original_name: z.string(),
  popularity: z.number().optional(),
  profile_path: z.string().nullable().optional(),
});

// Crew member schema
const CrewMemberSchema = z.object({
  id: z.number(),
  credit_id: z.string(),
  department: z.string(),
  job: z.string(),
  name: z.string(),
  adult: z.boolean().optional(),
  gender: z.number().optional(),
  known_for_department: z.string().optional(),
  original_name: z.string(),
  popularity: z.number().optional(),
  profile_path: z.string().nullable().optional(),
});

// Movie credits schema
const MovieCreditsSchema = z.object({
  id: z.number().optional(), // TMDB API doesn't include id in credits object
  cast: z.array(CastMemberSchema),
  crew: z.array(CrewMemberSchema),
});

// Movie images schema
const MovieImageSchema = z.object({
  aspect_ratio: z.number(),
  file_path: z.string(),
  height: z.number(),
  iso_639_1: z.string().nullable().optional(),
  vote_average: z.number(),
  vote_count: z.number(),
  width: z.number(),
});

const MovieImagesSchema = z.object({
  id: z.number().optional(), // TMDB API doesn't include id in images object
  backdrops: z.array(MovieImageSchema),
  posters: z.array(MovieImageSchema),
  logos: z.array(MovieImageSchema),
});

// Movie videos schema
const MovieVideoSchema = z.object({
  id: z.string(),
  iso_639_1: z.string().nullable().optional(),
  iso_3166_1: z.string().nullable().optional(),
  key: z.string(),
  name: z.string(),
  official: z.boolean(),
  published_at: z.string(),
  site: z.string(),
  size: z.number(),
  type: z.string(), // "Trailer", "Teaser", "Clip", "Featurette", etc.
});

const MovieVideosSchema = z.object({
  id: z.number().optional(), // TMDB API doesn't include id in videos object
  results: z.array(MovieVideoSchema),
});

// Movie keywords schema
const MovieKeywordSchema = z.object({
  id: z.number(),
  name: z.string(),
});

const MovieKeywordsSchema = z.object({
  id: z.number().optional(), // TMDB API doesn't include id in keywords object
  keywords: z.array(MovieKeywordSchema),
});

// Paginated response schema
const PaginatedMovieResponseSchema = z.object({
  results: z.array(MovieSchema),
  page: z.number(),
  total_pages: z.number(),
  total_results: z.number(),
});

// Complete movie data schema (aggregated)
const CompleteMovieDataSchema = MovieDetailsSchema.extend({
  credits: MovieCreditsSchema.optional(),
  images: MovieImagesSchema.optional(),
  videos: MovieVideosSchema.optional(),
  keywords: MovieKeywordsSchema.optional(),
});

// Export all schemas
export const MovieValidationSchemas = {
  Movie: MovieSchema,
  MovieDetails: MovieDetailsSchema,
  CastMember: CastMemberSchema,
  CrewMember: CrewMemberSchema,
  MovieCredits: MovieCreditsSchema,
  MovieImage: MovieImageSchema,
  MovieImages: MovieImagesSchema,
  MovieVideo: MovieVideoSchema,
  MovieVideos: MovieVideosSchema,
  MovieKeyword: MovieKeywordSchema,
  MovieKeywords: MovieKeywordsSchema,
  PaginatedMovieResponse: PaginatedMovieResponseSchema,
  CompleteMovieData: CompleteMovieDataSchema,
} as const;

// Export individual schemas for convenience
export {
  MovieSchema,
  MovieDetailsSchema,
  CastMemberSchema,
  CrewMemberSchema,
  MovieCreditsSchema,
  MovieImageSchema,
  MovieImagesSchema,
  MovieVideoSchema,
  MovieVideosSchema,
  MovieKeywordSchema,
  MovieKeywordsSchema,
  PaginatedMovieResponseSchema,
  CompleteMovieDataSchema,
};

// Type exports (inferred from schemas)
export type Movie = z.infer<typeof MovieSchema>;
export type MovieDetails = z.infer<typeof MovieDetailsSchema>;
export type CastMember = z.infer<typeof CastMemberSchema>;
export type CrewMember = z.infer<typeof CrewMemberSchema>;
export type MovieCredits = z.infer<typeof MovieCreditsSchema>;
export type MovieImage = z.infer<typeof MovieImageSchema>;
export type MovieImages = z.infer<typeof MovieImagesSchema>;
export type MovieVideo = z.infer<typeof MovieVideoSchema>;
export type MovieVideos = z.infer<typeof MovieVideosSchema>;
export type MovieKeyword = z.infer<typeof MovieKeywordSchema>;
export type MovieKeywords = z.infer<typeof MovieKeywordsSchema>;
export type PaginatedMovieResponse = z.infer<typeof PaginatedMovieResponseSchema>;
export type CompleteMovieData = z.infer<typeof CompleteMovieDataSchema>;