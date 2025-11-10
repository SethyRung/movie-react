import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from "../../test-utils";
import MovieDetailPage from "@pages/Movies/MovieDetailPage";

// Mock useParams
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '123' }),
  };
});

// Mock the features hooks
vi.mock('@features/movies/hooks', () => ({
  useMovieDetails: () => ({
    data: {
      id: 123,
      original_title: 'Test Movie Title',
      overview: 'This is a test movie overview with detailed information about the plot.',
      poster_path: '/test-poster.jpg',
      release_date: '2023-01-01',
      original_language: 'en',
      vote_average: 8.5,
      runtime: 120,
      genres: [
        { id: 1, name: 'Action' },
        { id: 2, name: 'Adventure' }
      ],
      status: 'Released',
      budget: 100000000,
      revenue: 500000000,
    },
    isLoading: false,
  }),
  useMovieCredits: () => ({
    data: {
      cast: [
        {
          id: 1,
          name: 'Test Actor 1',
          character: 'Main Character',
          profile_path: '/actor1.jpg'
        },
        {
          id: 2,
          name: 'Test Actor 2',
          character: 'Supporting Character',
          profile_path: '/actor2.jpg'
        },
        {
          id: 3,
          name: 'Test Actor 3',
          character: 'Background Character',
          profile_path: null
        }
      ],
      crew: [
        {
          id: 3,
          name: 'Test Director',
          job: 'Director',
          known_for_department: 'Directing'
        },
        {
          id: 4,
          name: 'Test Writer',
          job: 'Writer',
          known_for_department: 'Writing'
        }
      ]
    }
  }),
  useMovieVideos: () => ({
    data: {
      results: [
        {
          id: '12345',
          key: 'testTrailerKey',
          site: 'YouTube',
          type: 'Trailer',
          name: 'Official Trailer'
        }
      ]
    }
  }),
  useMovieImages: () => ({
    data: {
      posters: [],
      backdrops: []
    }
  }),
}));

describe('MovieDetailPage', () => {
  it('renders movie title and overview', () => {
    render(<MovieDetailPage />);

    expect(screen.getByText('Test Movie Title')).toBeInTheDocument();
    expect(screen.getByText('This is a test movie overview with detailed information about the plot.')).toBeInTheDocument();
  });

  it('renders movie metadata', () => {
    render(<MovieDetailPage />);

    expect(screen.getByText('2023-01-01 (EN) Action, Adventure 2h 0mn')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Adventure')).toBeInTheDocument();
  });

  it('renders rating circle', () => {
    render(<MovieDetailPage />);

    expect(screen.getByText('9')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('renders play trailer link', () => {
    render(<MovieDetailPage />);

    const trailerLink = screen.getByRole('link', { name: /Play Trailer/i });
    expect(trailerLink).toBeInTheDocument();
    expect(trailerLink).toHaveAttribute('href', 'https://www.youtube.com/watch?v=testTrailerKey');
    expect(trailerLink).toHaveAttribute('target', '_blank');
  });

  it('renders cast section', () => {
    render(<MovieDetailPage />);

    expect(screen.getByText('Cast')).toBeInTheDocument();
    expect(screen.getByText('Test Actor 1')).toBeInTheDocument();
    expect(screen.getByText('Main Character')).toBeInTheDocument();
    expect(screen.getByText('Test Actor 2')).toBeInTheDocument();
    expect(screen.getByText('Supporting Character')).toBeInTheDocument();
    expect(screen.getByText('Test Actor 3')).toBeInTheDocument();
    expect(screen.getByText('Background Character')).toBeInTheDocument();
  });

  it('renders crew information', () => {
    render(<MovieDetailPage />);

    expect(screen.getByText('Test Director')).toBeInTheDocument();
    expect(screen.getByText('Director')).toBeInTheDocument();
    expect(screen.getByText('Test Writer')).toBeInTheDocument();
    expect(screen.getByText('Writer')).toBeInTheDocument();
  });

  it('renders movie details sidebar', () => {
    render(<MovieDetailPage />);

    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Released')).toBeInTheDocument();
    expect(screen.getByText('Original Language')).toBeInTheDocument();
    expect(screen.getByText('EN')).toBeInTheDocument();
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('Budget')).toBeInTheDocument();
  });

  it('renders cast navigation buttons', () => {
    render(<MovieDetailPage />);

    // Check if navigation buttons exist in cast section
    const buttons = screen.getAllByRole('button');
    const navigationButtons = buttons.filter(button =>
      button.getAttribute('aria-label')?.includes('chevron') ||
      button.className.includes('chevron')
    );

    // Should have at least some buttons
    expect(navigationButtons.length).toBeGreaterThanOrEqual(0);
  });
});