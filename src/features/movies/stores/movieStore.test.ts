import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useMovieStore } from './movieStore';
import type { Movie } from '@/types/api.types';

// Mock movie data
const mockMovies: Movie[] = [
  {
    id: 1,
    title: 'Test Movie 1',
    original_title: 'Test Movie 1',
    poster_path: '/poster1.jpg',
    backdrop_path: '/backdrop1.jpg',
    release_date: '2023-01-01',
    vote_average: 8.5,
    vote_count: 1000,
    original_language: 'en',
    overview: 'Test overview 1',
    popularity: 100.5,
    adult: false,
    video: false,
    genre_ids: [28, 12],
  },
  {
    id: 2,
    title: 'Test Movie 2',
    original_title: 'Test Movie 2',
    poster_path: '/poster2.jpg',
    backdrop_path: '/backdrop2.jpg',
    release_date: '2023-02-01',
    vote_average: 7.8,
    vote_count: 800,
    original_language: 'en',
    overview: 'Test overview 2',
    popularity: 85.2,
    adult: false,
    video: false,
    genre_ids: [35, 18],
  },
];

const mockMovieDetails = {
  id: 1,
  title: 'Test Movie 1',
  original_title: 'Test Movie 1',
  poster_path: '/poster1.jpg',
  backdrop_path: '/backdrop1.jpg',
  release_date: '2023-01-01',
  vote_average: 8.5,
  vote_count: 1000,
  original_language: 'en',
  overview: 'Test overview 1',
  popularity: 100.5,
  adult: false,
  video: false,
  genre_ids: [28, 12],
  genres: [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
  ],
  runtime: 120,
  budget: 100000000,
  revenue: 500000000,
  status: 'Released',
  tagline: 'An amazing test movie',
  imdb_id: 'tt1234567',
};

describe('useMovieStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    const { result } = renderHook(() => useMovieStore());
    act(() => {
      result.current.setMovies([]);
      result.current.setCurrentMovie(null);
      result.current.setError(null);
      result.current.setLoading(false);
      result.current.setCurrentPage(1);
      result.current.setTotalPages(1);
      result.current.setCurrentCategory('popular');
      // Directly clear favorites and watchlist by accessing store state
      const store = result.current;
      // Since there's no explicit clear method, we need to manually remove items
      const currentFavorites = [...store.favorites];
      const currentWatchlist = [...store.watchlist];
      currentFavorites.forEach(id => store.removeFromFavorites(id));
      currentWatchlist.forEach(id => store.removeFromWatchlist(id));
    });
  });

  afterEach(() => {
    // Clean up after each test
    const { result } = renderHook(() => useMovieStore());
    act(() => {
      result.current.setMovies([]);
      result.current.setCurrentMovie(null);
      result.current.setError(null);
      result.current.setLoading(false);
      // Clear favorites and watchlist
      const store = result.current;
      const currentFavorites = [...store.favorites];
      const currentWatchlist = [...store.watchlist];
      currentFavorites.forEach(id => store.removeFromFavorites(id));
      currentWatchlist.forEach(id => store.removeFromWatchlist(id));
    });
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useMovieStore());

      expect(result.current.movies).toEqual([]);
      expect(result.current.currentMovie).toBeNull();
      expect(result.current.favorites).toEqual([]);
      expect(result.current.watchlist).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.currentPage).toBe(1);
      expect(result.current.totalPages).toBe(1);
      expect(result.current.currentCategory).toBe('popular');
    });
  });

  describe('Movies Management', () => {
    it('should set movies with array', () => {
      const { result } = renderHook(() => useMovieStore());

      act(() => {
        result.current.setMovies(mockMovies);
      });

      expect(result.current.movies).toEqual(mockMovies);
      expect(result.current.movies).toHaveLength(2);
    });

    it('should set movies with function', () => {
      const { result } = renderHook(() => useMovieStore());

      act(() => {
        result.current.setMovies((prev) => [...prev, mockMovies[0]]);
      });

      expect(result.current.movies).toEqual([mockMovies[0]]);
      expect(result.current.movies).toHaveLength(1);
    });

    it('should append movies using function updater', () => {
      const { result } = renderHook(() => useMovieStore());

      act(() => {
        result.current.setMovies(mockMovies);
      });

      act(() => {
        result.current.setMovies((prev) => [...prev, mockMovies[0]]);
      });

      expect(result.current.movies).toHaveLength(3);
      expect(result.current.movies[2]).toEqual(mockMovies[0]);
    });
  });

  describe('Current Movie Management', () => {
    it('should set current movie', () => {
      const { result } = renderHook(() => useMovieStore());

      act(() => {
        result.current.setCurrentMovie(mockMovieDetails);
      });

      expect(result.current.currentMovie).toEqual(mockMovieDetails);
    });

    it('should clear current movie', () => {
      const { result } = renderHook(() => useMovieStore());

      act(() => {
        result.current.setCurrentMovie(mockMovieDetails);
      });

      act(() => {
        result.current.clearCurrentMovie();
      });

      expect(result.current.currentMovie).toBeNull();
    });
  });

  describe('Favorites Management', () => {
    it('should add movie to favorites', () => {
      const { result } = renderHook(() => useMovieStore());

      act(() => {
        result.current.addToFavorites(1);
      });

      expect(result.current.favorites).toContain(1);
      expect(result.current.favorites).toHaveLength(1);
    });

    it('should not add duplicate favorites', () => {
      const { result } = renderHook(() => useMovieStore());

      act(() => {
        result.current.addToFavorites(1);
        result.current.addToFavorites(1);
      });

      expect(result.current.favorites).toEqual([1]);
      expect(result.current.favorites).toHaveLength(1);
    });

    it('should remove movie from favorites', () => {
      const { result } = renderHook(() => useMovieStore());

      act(() => {
        result.current.addToFavorites(1);
        result.current.addToFavorites(2);
      });

      act(() => {
        result.current.removeFromFavorites(1);
      });

      expect(result.current.favorites).toEqual([2]);
      expect(result.current.favorites).not.toContain(1);
    });

    it('should check if movie is favorite', () => {
      const { result } = renderHook(() => useMovieStore());

      act(() => {
        result.current.addToFavorites(1);
      });

      expect(result.current.isFavorite(1)).toBe(true);
      expect(result.current.isFavorite(2)).toBe(false);
    });
  });

  describe('Watchlist Management', () => {
    it('should add movie to watchlist', () => {
      const { result } = renderHook(() => useMovieStore());

      act(() => {
        result.current.addToWatchlist(1);
      });

      expect(result.current.watchlist).toContain(1);
      expect(result.current.watchlist).toHaveLength(1);
    });

    it('should not add duplicate watchlist items', () => {
      const { result } = renderHook(() => useMovieStore());

      act(() => {
        result.current.addToWatchlist(1);
        result.current.addToWatchlist(1);
      });

      expect(result.current.watchlist).toEqual([1]);
      expect(result.current.watchlist).toHaveLength(1);
    });

    it('should remove movie from watchlist', () => {
      const { result } = renderHook(() => useMovieStore());

      act(() => {
        result.current.addToWatchlist(1);
        result.current.addToWatchlist(2);
      });

      act(() => {
        result.current.removeFromWatchlist(1);
      });

      expect(result.current.watchlist).toEqual([2]);
      expect(result.current.watchlist).not.toContain(1);
    });

    it('should check if movie is in watchlist', () => {
      const { result } = renderHook(() => useMovieStore());

      act(() => {
        result.current.addToWatchlist(1);
      });

      expect(result.current.isInWatchlist(1)).toBe(true);
      expect(result.current.isInWatchlist(2)).toBe(false);
    });
  });

  describe('Loading and Error Management', () => {
    it('should set loading state', () => {
      const { result } = renderHook(() => useMovieStore());

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.isLoading).toBe(true);

      act(() => {
        result.current.setLoading(false);
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('should set error message', () => {
      const { result } = renderHook(() => useMovieStore());

      act(() => {
        result.current.setError('Something went wrong');
      });

      expect(result.current.error).toBe('Something went wrong');
    });

    it('should clear error', () => {
      const { result } = renderHook(() => useMovieStore());

      act(() => {
        result.current.setError('Something went wrong');
      });

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('Pagination Management', () => {
    it('should set current page', () => {
      const { result } = renderHook(() => useMovieStore());

      act(() => {
        result.current.setCurrentPage(3);
      });

      expect(result.current.currentPage).toBe(3);
    });

    it('should set total pages', () => {
      const { result } = renderHook(() => useMovieStore());

      act(() => {
        result.current.setTotalPages(10);
      });

      expect(result.current.totalPages).toBe(10);
    });

    it('should set current category and reset page', () => {
      const { result } = renderHook(() => useMovieStore());

      act(() => {
        result.current.setCurrentPage(5);
        result.current.setCurrentCategory('upcoming');
      });

      expect(result.current.currentCategory).toBe('upcoming');
      expect(result.current.currentPage).toBe(1); // Should reset to 1
    });

    it('should support all category types', () => {
      const { result } = renderHook(() => useMovieStore());

      const categories: Array<'popular' | 'now-playing' | 'upcoming' | 'top-rated'> = [
        'popular',
        'now-playing',
        'upcoming',
        'top-rated',
      ];

      categories.forEach((category) => {
        act(() => {
          result.current.setCurrentCategory(category);
        });

        expect(result.current.currentCategory).toBe(category);
      });
    });
  });

  describe('Complex Interactions', () => {
    it('should manage favorites and watchlist independently', () => {
      const { result } = renderHook(() => useMovieStore());

      act(() => {
        result.current.addToFavorites(1);
        result.current.addToWatchlist(1);
        result.current.addToFavorites(2);
      });

      expect(result.current.favorites).toEqual([1, 2]);
      expect(result.current.watchlist).toEqual([1]);

      act(() => {
        result.current.removeFromFavorites(1);
      });

      expect(result.current.favorites).toEqual([2]);
      expect(result.current.watchlist).toEqual([1]); // Should remain unchanged
    });

    it('should handle category change with pagination reset', () => {
      const { result } = renderHook(() => useMovieStore());

      act(() => {
        result.current.setCurrentPage(5);
        result.current.setTotalPages(10);
        result.current.setCurrentCategory('now-playing');
      });

      expect(result.current.currentPage).toBe(1);
      expect(result.current.totalPages).toBe(10); // Should remain
      expect(result.current.currentCategory).toBe('now-playing');
    });

    it('should manage loading state during operations', () => {
      const { result } = renderHook(() => useMovieStore());

      act(() => {
        result.current.setLoading(true);
        result.current.setMovies(mockMovies);
        result.current.setLoading(false);
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.movies).toEqual(mockMovies);
    });

    it('should handle error clearing with other operations', () => {
      const { result } = renderHook(() => useMovieStore());

      act(() => {
        result.current.setError('Initial error');
        result.current.setLoading(true);
        result.current.clearError();
        result.current.setCurrentMovie(mockMovieDetails);
      });

      expect(result.current.error).toBeNull();
      expect(result.current.isLoading).toBe(true);
      expect(result.current.currentMovie).toEqual(mockMovieDetails);
    });
  });

  describe('Store Persistence', () => {
    it('should persist specific fields', () => {
      const { result } = renderHook(() => useMovieStore());

      act(() => {
        result.current.addToFavorites(1);
        result.current.addToWatchlist(2);
        result.current.setCurrentCategory('upcoming');
        result.current.setMovies(mockMovies);
        result.current.setCurrentMovie(mockMovieDetails);
        result.current.setLoading(true);
        result.current.setError('Test error');
      });

      // Note: In a real test, you might want to test actual persistence
      // by creating a new store instance or checking localStorage
      // For now, we just verify the state is set correctly
      expect(result.current.favorites).toEqual([1]);
      expect(result.current.watchlist).toEqual([2]);
      expect(result.current.currentCategory).toBe('upcoming');
      expect(result.current.movies).toEqual(mockMovies);
      expect(result.current.currentMovie).toEqual(mockMovieDetails);
      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBe('Test error');
    });
  });
});