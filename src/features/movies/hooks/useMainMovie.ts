import { useQuery } from '@tanstack/react-query';
import getMainMovie from '@/api/main-movie.get';
import { useMovieStore } from '../stores/movieStore';

export function useMainMovie() {
  const { setLoading, setError } = useMovieStore();

  return useQuery({
    queryKey: ['main-movie'],
    queryFn: async () => {
      setLoading(true);
      try {
        const mainMovie = await getMainMovie();
        if (!mainMovie) {
          throw new Error('No movies found');
        }
        return mainMovie;
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch main movie');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}