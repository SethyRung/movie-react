import { useQuery } from '@tanstack/react-query';
import getPopular from '@/api/popular.get';
import getNowPlaying from '@/api/now-playing.get';
import getUpcoming from '@/api/upcoming.get';
import { useMovieStore } from '../stores/movieStore';
import { Movie } from '@/types/api.types';

export function useMovies(category: 'popular' | 'now-playing' | 'upcoming', page: number = 1) {
  const { setMovies, setLoading, setError, setTotalPages, setCurrentPage } = useMovieStore();

  const getApiFunction = () => {
    switch (category) {
      case 'now-playing':
        return getNowPlaying;
      case 'upcoming':
        return getUpcoming;
      case 'popular':
      default:
        return getPopular;
    }
  };

  return useQuery({
    queryKey: ['movies', category, page],
    queryFn: async () => {
      setLoading(true);
      try {
        const apiFunction = getApiFunction();
        const response = await apiFunction(page);

        if (!response) {
          throw new Error('Failed to fetch movies');
        }

        const moviesData = response.results;

        if (page === 1) {
          setMovies(moviesData as Movie[]);
        } else {
          setMovies((prev) => [...prev, ...moviesData]);
        }

        setTotalPages(response.total_pages || 1);
        setCurrentPage(page);

        return response;
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch movies');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: true,
  });
}

export function usePopularMovies(page: number = 1) {
  return useMovies('popular', page);
}

export function useNowPlayingMovies(page: number = 1) {
  return useMovies('now-playing', page);
}

export function useUpcomingMovies(page: number = 1) {
  return useMovies('upcoming', page);
}