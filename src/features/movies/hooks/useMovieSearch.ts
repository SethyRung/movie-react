import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { withApiKey } from '@utils/axios';
import { useMovieStore } from '../stores/movieStore';
import { Movie } from '@/types/api.types';

interface SearchResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;
  page: number;
}

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
        const response = await withApiKey.get<SearchResponse>('/search/movie', {
          params: {
            query: searchQuery.trim(),
            page: searchPage,
          },
        });

        const searchData = response.data.results;

        if (searchPage === 1) {
          setMovies(searchData);
        } else {
          setMovies((prev) => [...prev, ...searchData]);
        }

        setTotalPages(response.data.total_pages);

        return response.data;
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