import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from "../../test-utils";
import MovieListPage from "@pages/Movies/MovieListPage";

// Mock MovieCard component and useMovieStore
vi.mock('@features/movies', () => ({
  MovieCard: ({ title, release, rating }: { title: string; release: string; rating: string }) => (
    <div data-testid="movie-card">
      <h3>{title}</h3>
      <p>{release}</p>
      <p>{rating}</p>
    </div>
  ),
  useMovieStore: () => ({
    movies: [
      {
        id: 1,
        original_title: 'Test Movie 1',
        poster_path: '/poster1.jpg',
        release_date: '2023-01-01',
        vote_average: 8.5,
        original_language: 'en'
      },
      {
        id: 2,
        original_title: 'Test Movie 2',
        poster_path: '/poster2.jpg',
        release_date: '2023-02-01',
        vote_average: 7.5,
        original_language: 'en'
      }
    ]
  }),
}));

// Mock the features hooks
vi.mock('@features/movies/hooks', () => ({
  usePopularMovies: () => ({
    data: {
      results: [
        {
          id: 1,
          original_title: 'Test Movie 1',
          poster_path: '/poster1.jpg',
          release_date: '2023-01-01',
          vote_average: 8.5,
          original_language: 'en'
        },
        {
          id: 2,
          original_title: 'Test Movie 2',
          poster_path: '/poster2.jpg',
          release_date: '2023-02-01',
          vote_average: 7.5,
          original_language: 'en'
        }
      ]
    },
    isLoading: false,
  }),
}));

describe('MovieListPage', () => {
  it('renders movie grid', () => {
    render(<MovieListPage />);

    expect(screen.getByText('Test Movie 1')).toBeInTheDocument();
    expect(screen.getByText('Test Movie 2')).toBeInTheDocument();
  });

  it('renders load more button', () => {
    render(<MovieListPage />);

    const loadMoreButton = screen.getByRole('button', { name: /Load More/i });
    expect(loadMoreButton).toBeInTheDocument();
  });

  it('handles load more click', () => {
    render(<MovieListPage />);

    const loadMoreButton = screen.getByRole('button', { name: /Load More/i });
    fireEvent.click(loadMoreButton);

    // Should remain on the page and button should still be visible
    expect(loadMoreButton).toBeInTheDocument();
  });

  it('displays movies in grid layout', () => {
    render(<MovieListPage />);

    const movieContainer = screen.getByRole('button', { name: /Load More/i }).closest('.grid');
    expect(movieContainer).toHaveClass('grid-cols-[repeat(auto-fit,minmax(208px,1fr))]');
  });
});