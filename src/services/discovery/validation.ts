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

const DiscoveryPaginatedResponseSchema = z.object({
  results: z.array(DiscoveryMovieSchema),
  page: z.number(),
  total_pages: z.number(),
  total_results: z.number(),
});

export const DiscoveryValidationSchemas = {
  DiscoveryMovie: DiscoveryMovieSchema,
  DiscoveryPaginatedResponse: DiscoveryPaginatedResponseSchema,
} as const;

export { DiscoveryMovieSchema, DiscoveryPaginatedResponseSchema };

export type DiscoveryMovie = z.infer<typeof DiscoveryMovieSchema>;
export type DiscoveryPaginatedResponse = z.infer<typeof DiscoveryPaginatedResponseSchema>;
