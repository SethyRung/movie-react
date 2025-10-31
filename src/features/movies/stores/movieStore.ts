import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Import types from the existing types
import { Movie } from '@/types/api.types';

// Define MovieDetails interface (can be expanded based on API response)
interface MovieDetails extends Omit<Movie, 'overview'> {
  overview: string;
  genres: Array<{ id: number; name: string }>;
  runtime?: number;
  release_date: string;
  vote_average: number;
  vote_count: number;
  backdrop_path?: string;
  poster_path?: string;
  imdb_id?: string;
  budget?: number;
  revenue?: number;
  status?: string;
  tagline?: string;
}

interface MovieStore {
  // State
  movies: Movie[];
  currentMovie: MovieDetails | null;
  favorites: number[];
  watchlist: number[];
  isLoading: boolean;
  error: string | null;

  // Pagination and filtering
  currentPage: number;
  totalPages: number;
  currentCategory: 'popular' | 'now-playing' | 'upcoming' | 'top-rated';

  // Actions
  setMovies: (movies: Movie[] | ((prev: Movie[]) => Movie[])) => void;
  setCurrentMovie: (movie: MovieDetails | null) => void;
  addToFavorites: (movieId: number) => void;
  removeFromFavorites: (movieId: number) => void;
  addToWatchlist: (movieId: number) => void;
  removeFromWatchlist: (movieId: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Pagination actions
  setCurrentPage: (page: number) => void;
  setTotalPages: (pages: number) => void;
  setCurrentCategory: (category: 'popular' | 'now-playing' | 'upcoming' | 'top-rated') => void;

  // Utility actions
  isFavorite: (movieId: number) => boolean;
  isInWatchlist: (movieId: number) => boolean;
  clearCurrentMovie: () => void;
}

export { type MovieStore };
export const useMovieStore = create<MovieStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        movies: [],
        currentMovie: null,
        favorites: [],
        watchlist: [],
        isLoading: false,
        error: null,
        currentPage: 1,
        totalPages: 1,
        currentCategory: 'popular',

        // Actions
        setMovies: (movies) => set((state) => ({
          movies: typeof movies === 'function' ? movies(state.movies) : movies
        })),

        setCurrentMovie: (movie) => set({ currentMovie: movie }),

        addToFavorites: (movieId) =>
          set((state) => ({
            favorites: [...new Set([...state.favorites, movieId])]
          })),

        removeFromFavorites: (movieId) =>
          set((state) => ({
            favorites: state.favorites.filter(id => id !== movieId)
          })),

        addToWatchlist: (movieId) =>
          set((state) => ({
            watchlist: [...new Set([...state.watchlist, movieId])]
          })),

        removeFromWatchlist: (movieId) =>
          set((state) => ({
            watchlist: state.watchlist.filter(id => id !== movieId)
          })),

        setLoading: (isLoading) => set({ isLoading }),

        setError: (error) => set({ error }),

        clearError: () => set({ error: null }),

        setCurrentPage: (currentPage) => set({ currentPage }),

        setTotalPages: (totalPages) => set({ totalPages }),

        setCurrentCategory: (currentCategory) => set({ currentCategory, currentPage: 1 }),

        // Utility actions
        isFavorite: (movieId) => {
          const state = get();
          return state.favorites.includes(movieId);
        },

        isInWatchlist: (movieId) => {
          const state = get();
          return state.watchlist.includes(movieId);
        },

        clearCurrentMovie: () => set({ currentMovie: null }),
      }),
      {
        name: 'movie-store',
        partialize: (state) => ({
          favorites: state.favorites,
          watchlist: state.watchlist,
          currentCategory: state.currentCategory,
        }),
      }
    )
  )
);