import { useQuery, useQueryClient } from '@tanstack/react-query';
import getMovieDetail from '@/api/movie-detail.get';
import getMovieCredits from '@/api/movie-credits.get';
import getMovieImages from '@/api/movie-images.get';
import getMovieVideos from '@/api/movie-videos.get';
import { useMovieStore } from '../stores/movieStore';
import { ExtendedMovie } from '../types/movie.types';

export function useMovieDetails(movieId: number) {
  const { setCurrentMovie, setLoading, setError } = useMovieStore();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['movie', movieId],
    queryFn: async () => {
      setLoading(true);
      try {
        const movieData = await getMovieDetail(movieId);
        if (!movieData) {
          throw new Error('Movie not found');
        }

        setCurrentMovie({
  ...movieData as unknown as ExtendedMovie,
  genres: movieData.genres || []
});

        // Prefetch related data with proper error handling
        queryClient.prefetchQuery({
          queryKey: ['movie', movieId, 'credits'],
          queryFn: async () => {
            const data = await getMovieCredits(movieId);
            return data || { cast: [], crew: [] };
          },
        });

        queryClient.prefetchQuery({
          queryKey: ['movie', movieId, 'images'],
          queryFn: async () => {
            const data = await getMovieImages(movieId);
            return data || { backdrops: [], posters: [] };
          },
        });

        queryClient.prefetchQuery({
          queryKey: ['movie', movieId, 'videos'],
          queryFn: async () => {
            const data = await getMovieVideos(movieId);
            return data || { results: [] };
          },
        });

        return movieData;
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch movie details');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    enabled: !!movieId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useMovieCredits(movieId: number) {
  return useQuery({
    queryKey: ['movie', movieId, 'credits'],
    queryFn: async () => {
      const data = await getMovieCredits(movieId);
      return data || { cast: [], crew: [] }; // Return default structure if undefined
    },
    enabled: !!movieId,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

export function useMovieImages(movieId: number) {
  return useQuery({
    queryKey: ['movie', movieId, 'images'],
    queryFn: async () => {
      const data = await getMovieImages(movieId);
      return data || { backdrops: [], posters: [] }; // Return default structure if undefined
    },
    enabled: !!movieId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useMovieVideos(movieId: number) {
  return useQuery({
    queryKey: ['movie', movieId, 'videos'],
    queryFn: async () => {
      const data = await getMovieVideos(movieId);
      return data || { results: [] }; // Return default structure if undefined
    },
    enabled: !!movieId,
    staleTime: 20 * 60 * 1000, // 20 minutes
  });
}