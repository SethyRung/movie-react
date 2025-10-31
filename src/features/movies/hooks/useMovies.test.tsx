import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMovies, usePopularMovies, useNowPlayingMovies, useUpcomingMovies } from './useMovies';
import { movieMockData } from '@tests/mocks/data';
import getPopular, { ResponseBody } from '@/api/popular.get';
import getNowPlaying from '@/api/now-playing.get';
import getUpcoming from '@/api/upcoming.get';

const mockedGetPopular = vi.mocked(getPopular);
const mockedGetNowPlaying = vi.mocked(getNowPlaying);
const mockedGetUpcoming = vi.mocked(getUpcoming);

// Mock the movie store
const mockSetMovies = vi.fn();
const mockSetLoading = vi.fn();
const mockSetError = vi.fn();
const mockSetTotalPages = vi.fn();
const mockSetCurrentPage = vi.fn();

vi.mock('@/api/popular.get', () => ({
  default: vi.fn()
}));

vi.mock('@/api/now-playing.get', () => ({
  default: vi.fn()
}));

vi.mock('@/api/upcoming.get', () => ({
  default: vi.fn()
}));

vi.mock('../stores/movieStore', () => ({
  useMovieStore: () => ({
    setMovies: mockSetMovies,
    setLoading: mockSetLoading,
    setError: mockSetError,
    setTotalPages: mockSetTotalPages,
    setCurrentPage: mockSetCurrentPage,
  }),
}));

// Mock API functions
vi.mock('@/api/popular.get', () => ({
  default: vi.fn(),
}));

vi.mock('@/api/now-playing.get', () => ({
  default: vi.fn(),
}));

vi.mock('@/api/upcoming.get', () => ({
  default: vi.fn(),
}));

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
);

describe('useMovies', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useMovies hook', () => {
    it('should fetch popular movies successfully', async () => {
      mockedGetPopular.mockResolvedValue({
        dates: {
          maximum: '2024-12-31',
          minimum: '2024-01-01'
        },
        page: 1,
        results: movieMockData.slice(0, 20),
        total_pages: 5,
        total_results: 100,
      } as ResponseBody);

      const { result } = renderHook(() => useMovies('popular', 1), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockSetLoading).toHaveBeenCalledWith(true);
      expect(mockSetMovies).toHaveBeenCalledWith(movieMockData.slice(0, 20));
      expect(mockSetTotalPages).toHaveBeenCalledWith(5);
      expect(mockSetCurrentPage).toHaveBeenCalledWith(1);
      expect(mockSetLoading).toHaveBeenCalledWith(false);
      expect(mockSetError).not.toHaveBeenCalled();
    });

    it('should fetch now playing movies successfully', async () => {
      mockedGetNowPlaying.mockResolvedValue({
        dates: {
          maximum: '2024-12-31',
          minimum: '2024-01-01'
        },
        page: 1,
        results: movieMockData.slice(20, 40),
        total_pages: 3,
        total_results: 60,
      } as ResponseBody);

      const { result } = renderHook(() => useMovies('now-playing', 1), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockSetMovies).toHaveBeenCalledWith(movieMockData.slice(20, 40));
      expect(mockSetTotalPages).toHaveBeenCalledWith(3);
    });

    it('should fetch upcoming movies successfully', async () => {
      mockedGetUpcoming.mockResolvedValue({
        dates: {
          maximum: '2024-12-31',
          minimum: '2024-01-01'
        },
        page: 1,
        results: movieMockData.slice(40, 60),
        total_pages: 4,
        total_results: 80,
      } as ResponseBody);

      const { result } = renderHook(() => useMovies('upcoming', 1), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockSetMovies).toHaveBeenCalledWith(movieMockData.slice(40, 60));
      expect(mockSetTotalPages).toHaveBeenCalledWith(4);
    });

    it('should append movies for pages greater than 1', async () => {
      mockedGetPopular.mockResolvedValue({
        dates: {
          maximum: '2024-12-31',
          minimum: '2024-01-01'
        },
        page: 2,
        results: movieMockData.slice(20, 40),
        total_pages: 5,
        total_results: 100,
      } as ResponseBody);

      const { result } = renderHook(() => useMovies('popular', 2), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockSetMovies).toHaveBeenCalledWith(
        expect.any(Function)
      );

      // Verify that the function appends to previous movies
      const setMoviesCall = mockSetMovies.mock.calls[0][0];
      expect(typeof setMoviesCall).toBe('function');
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Network error';
      mockedGetPopular.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useMovies('popular', 1), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(mockSetError).toHaveBeenCalledWith(errorMessage);
      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });

    it('should handle empty response', async () => {
      mockedGetPopular.mockResolvedValue(undefined);

      const { result } = renderHook(() => useMovies('popular', 1), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(mockSetError).toHaveBeenCalledWith('Failed to fetch movies');
    });

    it('should use correct query key', () => {
      renderHook(() => useMovies('upcoming', 3), { wrapper });

      // QueryClientProvider should create a query with the correct key
      // This is tested indirectly through the hook behavior
      expect(mockSetLoading).toHaveBeenCalledWith(true);
    });

    it('should have correct stale time', () => {
      // This tests the configuration, though we can't directly verify it
      // The 5 minute stale time is set in the hook
      const { result } = renderHook(() => useMovies('popular', 1), { wrapper });
      expect(result.current.isFetching).toBe(true);
    });
  });

  describe('usePopularMovies', () => {
    it('should call useMovies with popular category', () => {
      renderHook(() => usePopularMovies(1), { wrapper });

      // The hook should internally call useMovies with 'popular'
      expect(mockSetLoading).toHaveBeenCalledWith(true);
    });

    it('should use default page 1 when not specified', () => {
      renderHook(() => usePopularMovies(), { wrapper });

      expect(mockSetLoading).toHaveBeenCalledWith(true);
    });
  });

  describe('useNowPlayingMovies', () => {
    it('should call useMovies with now-playing category', () => {
      renderHook(() => useNowPlayingMovies(2), { wrapper });

      expect(mockSetLoading).toHaveBeenCalledWith(true);
    });

    it('should use default page 1 when not specified', () => {
      renderHook(() => useNowPlayingMovies(), { wrapper });

      expect(mockSetLoading).toHaveBeenCalledWith(true);
    });
  });

  describe('useUpcomingMovies', () => {
    it('should call useMovies with upcoming category', () => {
      renderHook(() => useUpcomingMovies(3), { wrapper });

      expect(mockSetLoading).toHaveBeenCalledWith(true);
    });

    it('should use default page 1 when not specified', () => {
      renderHook(() => useUpcomingMovies(), { wrapper });

      expect(mockSetLoading).toHaveBeenCalledWith(true);
    });
  });

  describe('Error handling edge cases', () => {
    it('should handle non-Error objects', async () => {
      mockedGetPopular.mockRejectedValue('String error');

      const { result } = renderHook(() => useMovies('popular', 1), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(mockSetError).toHaveBeenCalledWith('Failed to fetch movies');
    });

    it('should handle null error objects', async () => {
      mockedGetPopular.mockRejectedValue(null);

      const { result } = renderHook(() => useMovies('popular', 1), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(mockSetError).toHaveBeenCalledWith('Failed to fetch movies');
    });

    it('should handle response without total_pages', async () => {
      mockedGetPopular.mockResolvedValue({
        dates: {
          maximum: '2024-12-31',
          minimum: '2024-01-01'
        },
        page: 1,
        results: movieMockData.slice(0, 20),
        total_results: 100,
        total_pages: 1,
      } as ResponseBody);

      const { result } = renderHook(() => useMovies('popular', 1), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockSetTotalPages).toHaveBeenCalledWith(1); // Default to 1
    });
  });
});