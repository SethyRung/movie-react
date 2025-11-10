import { useCallback } from 'react';
import { useMovieStore } from '../stores/movieStore';

export function useFavorites() {
  const {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  } = useMovieStore();

  const toggleFavorite = useCallback(
    (movieId: number) => {
      if (isFavorite(movieId)) {
        removeFromFavorites(movieId);
      } else {
        addToFavorites(movieId);
      }
    },
    [isFavorite, addToFavorites, removeFromFavorites]
  );

  const addFavorite = useCallback(
    (movieId: number) => {
      if (!isFavorite(movieId)) {
        addToFavorites(movieId);
      }
    },
    [isFavorite, addToFavorites]
  );

  const removeFavorite = useCallback(
    (movieId: number) => {
      if (isFavorite(movieId)) {
        removeFromFavorites(movieId);
      }
    },
    [isFavorite, removeFromFavorites]
  );

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    favoritesCount: favorites.length,
  };
}