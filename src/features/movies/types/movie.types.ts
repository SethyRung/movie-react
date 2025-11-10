import { Movie } from '@/types/api.types';

// Extended movie interface with additional properties
export interface ExtendedMovie extends Movie {
  genres?: Array<{ id: number; name: string }>;
  runtime?: number;
  imdb_id?: string;
  budget?: number;
  revenue?: number;
  status?: string;
  tagline?: string;
}

// Movie categories
export type MovieCategory = 'popular' | 'now-playing' | 'upcoming' | 'top-rated';

// Movie list response
export interface MovieListResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;
  page: number;
}

// Movie details response
export interface MovieDetailsResponse extends ExtendedMovie {
  videos?: {
    results: Array<{
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
    }>;
  };
  images?: {
    backdrops: Array<{
      file_path: string;
      width: number;
      height: number;
    }>;
    posters: Array<{
      file_path: string;
      width: number;
      height: number;
    }>;
  };
  credits?: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path?: string;
      order: number;
    }>;
    crew: Array<{
      id: number;
      name: string;
      job: string;
      department: string;
      profile_path?: string;
    }>;
  };
}

// Cast member interface
export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path?: string;
  order: number;
}

// Crew member interface
export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path?: string;
}

// Search filters
export interface MovieSearchFilters {
  query: string;
  year?: number;
  genre?: number;
  language?: string;
  page?: number;
}

// Component props interfaces
export interface MovieCardProps {
  id: number;
  images: string;
  title: string;
  release: string;
  language: string;
  rating: string;
}

export interface MainCardProps {
  id: number;
  title: string;
  overview: string;
  genre: string;
  images: string[];
}

export interface CastCardProps {
  profile: string;
  name: string;
  character: string;
}