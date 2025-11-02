import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '@tests/test-utils';
import HomePage from './HomePage';

// Mock Icon component
vi.mock('@iconify/react/dist/iconify.js', () => ({
  Icon: ({ icon }: { icon: string }) => <div data-testid={`icon-${icon}`}>{icon}</div>,
}));

// Mock the features hooks
vi.mock('@features/movies/hooks', () => ({
  useMainMovie: () => ({
    data: {
      popular: {
        results: [
          {
            id: 1,
            original_title: 'Test Movie',
            overview: 'Test overview',
            genres: [{ id: 1, name: 'Action' }],
          }
        ]
      },
      images: {
        posters: [
          { file_path: '/poster1.jpg', width: 500, height: 750 },
          { file_path: '/poster2.jpg', width: 500, height: 750 }
        ]
      }
    },
    isLoading: false,
  }),
  useNowPlayingMovies: () => ({
    data: {
      results: [
        {
          id: 2,
          original_title: 'Now Playing Movie',
          poster_path: '/nowplaying.jpg',
          release_date: '2023-01-01',
          vote_average: 8.5,
          original_language: 'en'
        }
      ]
    }
  }),
  useUpcomingMovies: () => ({
    data: {
      results: [
        {
          id: 3,
          original_title: 'Upcoming Movie',
          poster_path: '/upcoming.jpg',
          release_date: '2023-12-01',
          vote_average: 7.5,
          original_language: 'en'
        }
      ]
    }
  }),
  usePopularMovies: () => ({
    data: {
      results: [
        {
          id: 4,
          original_title: 'Popular Movie',
          poster_path: '/popular.jpg',
          release_date: '2023-06-01',
          vote_average: 9.0,
          original_language: 'en'
        }
      ]
    }
  }),
}));

// Mock Tabs component
vi.mock('@/components/tabs', () => ({
  default: ({ items, currentTab, onCurrentTabChange, ui }: {
    items: Array<{ key: string; title: string }>;
    currentTab: string;
    onCurrentTabChange: (key: string) => void;
    ui?: { wrapper?: string };
  }) => (
    <div data-testid="tabs" data-ui={ui?.wrapper}>
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => onCurrentTabChange(item.key)}
          className={currentTab === item.key ? 'active' : ''}
        >
          {item.title}
        </button>
      ))}
    </div>
  ),
  __esModule: true,
}));

// Mock MovieCard component
vi.mock('@features/movies', () => ({
  MainCard: ({ title, overview }: { title: string; overview: string }) => (
    <div data-testid="main-card">
      <h1>{title}</h1>
      <p>{overview}</p>
    </div>
  ),
  MovieCard: ({ title, release, rating }: { title: string; release: string; rating: string }) => (
    <div data-testid="movie-card">
      <h3>{title}</h3>
      <p>{release}</p>
      <p>{rating}</p>
    </div>
  ),
}));

describe('HomePage', () => {
  it('renders main movie card', () => {
    render(<HomePage />);

    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    expect(screen.getByText('Test overview')).toBeInTheDocument();
  });

  it('renders tabs', () => {
    render(<HomePage />);

    expect(screen.getByTestId('tabs')).toBeInTheDocument();
    expect(screen.getByText('Now Playing')).toBeInTheDocument();
    expect(screen.getByText('Coming Soon')).toBeInTheDocument();
    expect(screen.getByText('Popular')).toBeInTheDocument();
  });

  it('displays now playing movies by default', () => {
    render(<HomePage />);

    expect(screen.getByText('Now Playing Movie')).toBeInTheDocument();
  });

  it('switches tabs correctly', () => {
    render(<HomePage />);

    const upcomingTab = screen.getByText('Coming Soon');
    fireEvent.click(upcomingTab);

    // After switching to upcoming tab, should show upcoming movie
    expect(screen.getByText('Upcoming Movie')).toBeInTheDocument();
  });

  it('renders navigation buttons', () => {
    render(<HomePage />);

    // Check if any buttons exist that could be navigation buttons
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});