import { z } from "zod";

// Re-use movie schemas from movie service
import { MovieSchema } from "../movie/validation";

// Extended movie schema for discovery endpoints (includes additional fields)
const DiscoveryMovieSchema = MovieSchema.extend({
  genre_ids: z.array(z.number()),
  original_language: z.string(),
  original_title: z.string(),
  popularity: z.number(),
  release_date: z.string(),
  title: z.string(),
  video: z.boolean(),
  vote_average: z.number(),
  vote_count: z.number(),
});

// Discovery paginated response schema
const DiscoveryPaginatedResponseSchema = z.object({
  results: z.array(DiscoveryMovieSchema),
  page: z.number(),
  total_pages: z.number(),
  total_results: z.number(),
});

// Main movie schema (for main-movie.get.ts equivalent)
const MainMovieResponseSchema = z.object({
  popular: DiscoveryPaginatedResponseSchema,
  images: z.object({
    backdrops: z.array(
      z.object({
        aspect_ratio: z.number(),
        file_path: z.string(),
        height: z.number(),
        iso_639_1: z.string().nullable().optional(),
        vote_average: z.number(),
        vote_count: z.number(),
        width: z.number(),
      }),
    ),
    posters: z.array(
      z.object({
        aspect_ratio: z.number(),
        file_path: z.string(),
        height: z.number(),
        iso_639_1: z.string().nullable().optional(),
        vote_average: z.number(),
        vote_count: z.number(),
        width: z.number(),
      }),
    ),
  }),
});

// Export discovery schemas
export const DiscoveryValidationSchemas = {
  DiscoveryMovie: DiscoveryMovieSchema,
  DiscoveryPaginatedResponse: DiscoveryPaginatedResponseSchema,
  MainMovieResponse: MainMovieResponseSchema,
} as const;

// Export individual schemas for convenience
export { DiscoveryMovieSchema, DiscoveryPaginatedResponseSchema, MainMovieResponseSchema };

// Type exports (inferred from schemas)
export type DiscoveryMovie = z.infer<typeof DiscoveryMovieSchema>;
export type DiscoveryPaginatedResponse = z.infer<typeof DiscoveryPaginatedResponseSchema>;
export type MainMovieResponse = z.infer<typeof MainMovieResponseSchema>;
