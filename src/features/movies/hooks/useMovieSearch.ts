import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { movieService } from '@/services';
import { useMovieStore } from '../stores/movieStore';
import { Movie } from '@/types/api.types';

export function useMovieSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchPage, setSearchPage] = useState(1);
  const { setMovies, setLoading, setError, setTotalPages } = useMovieStore();

  const {
    data: searchResults,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['search-movies', searchQuery, searchPage],
    queryFn: async () => {
      if (!searchQuery.trim()) {
        return { results: [], total_pages: 0, total_results: 0, page: 1 };
      }

      setLoading(true);
      try {
        const response = await movieService.searchMovies(searchQuery.trim(), {
          page: searchPage,
          language: 'en-US',
          includeAdult: false,
        });

        if (!response.success || !response.data) {
          throw new Error(response.error?.message || 'Failed to search movies');
        }

        const searchData = response.data.results;

        if (searchPage === 1) {
          setMovies(searchData.map(movie => ({
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path || undefined,
            backdrop_path: movie.backdrop_path || undefined,
            overview: movie.overview || '',
            release_date: movie.release_date || '',
            vote_average: movie.vote_average,
            vote_count: movie.vote_count,
            popularity: movie.popularity || 0,
            original_language: movie.original_language || '',
            original_title: movie.original_title || '',
            genre_ids: movie.genre_ids || [],
            adult: movie.adult || false,
            video: movie.video || false,
          })));
        } else {
          setMovies((prev: Movie[]) => [...prev, ...searchData.map(movie => ({
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path || undefined,
            backdrop_path: movie.backdrop_path || undefined,
            overview: movie.overview || '',
            release_date: movie.release_date || '',
            vote_average: movie.vote_average,
            vote_count: movie.vote_count,
            popularity: movie.popularity || 0,
            original_language: movie.original_language || '',
            original_title: movie.original_title || '',
            genre_ids: movie.genre_ids || [],
            adult: movie.adult || false,
            video: movie.video || false,
          }))]);
        }

        setTotalPages(response.data.total_pages);

        // Transform to legacy format for compatibility
        return {
          results: response.data.results,
          page: response.data.page,
          total_pages: response.data.total_pages,
          total_results: response.data.total_results,
        };
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to search movies');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    enabled: searchQuery.trim().length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const performSearch = useCallback(
    (query: string, page: number = 1) => {
      setSearchQuery(query);
      setSearchPage(page);
      if (query.trim()) {
        refetch();
      }
    },
    [refetch]
  );

  const loadMoreResults = useCallback(() => {
    if (searchResults && searchPage < searchResults.total_pages) {
      const nextPage = searchPage + 1;
      setSearchPage(nextPage);
      refetch();
    }
  }, [searchPage, searchResults, refetch]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchPage(1);
    setMovies([]);
  }, [setMovies]);

  return {
    searchQuery,
    searchResults,
    isLoading,
    error,
    performSearch,
    loadMoreResults,
    clearSearch,
    hasMoreResults: searchResults ? searchPage < searchResults.total_pages : false,
    totalResults: searchResults?.total_results || 0,
  };
}