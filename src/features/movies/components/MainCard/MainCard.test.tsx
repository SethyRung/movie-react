import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '@tests/test-utils';
import MainCard from './MainCard';

// Mock the carousel component
interface MockCarouselProps {
  children: React.ReactNode;
  onPageChange?: (page: number) => void;
}

vi.mock('@/components/carousel', () => ({
  default: ({ children, onPageChange }: MockCarouselProps) => (
    <div data-testid="carousel">
      {children}
      <button onClick={() => onPageChange?.(1)}>Next Page</button>
    </div>
  ),
  __esModule: true,
}));

// Mock the pagination component
interface MockPaginationProps {
  currentValue: number;
  onCurrentValueChange: (value: number) => void;
  total: number;
}

vi.mock('@/components/pagination', () => ({
  default: ({ currentValue, onCurrentValueChange, total }: MockPaginationProps) => (
    <div data-testid="pagination">
      <span>Page {currentValue} of {total}</span>
      <button onClick={() => onCurrentValueChange(currentValue + 1)}>Next</button>
    </div>
  ),
  __esModule: true,
}));

// Mock the skeleton component
interface MockSkeletonProps {
  className?: string;
}

vi.mock('@/components/skeleton', () => ({
  default: ({ className }: MockSkeletonProps) => <div data-testid="skeleton" className={className} />,
  __esModule: true,
}));

// Mock useWindowSize
vi.mock('@react-hooks-library/core', () => ({
  useWindowSize: () => ({ width: 400 }), // Mobile width to show pagination
  __esModule: true,
}));

const mockMainCard = {
  id: 1,
  title: 'Test Movie Title',
  overview: 'This is a test movie overview that provides a brief description of the movie content.',
  genre: 'Action',
  images: ['/image1.jpg', '/image2.jpg', '/image3.jpg'],
};

describe('MainCard', () => {
  it('renders movie information correctly', () => {
    render(<MainCard {...mockMainCard} />);

    expect(screen.getByText('Test Movie Title')).toBeInTheDocument();
    expect(screen.getByText('This is a test movie overview that provides a brief description of the movie content.')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('renders carousel component', () => {
    render(<MainCard {...mockMainCard} />);

    expect(screen.getByTestId('carousel')).toBeInTheDocument();
  });

  it('renders pagination component', () => {
    render(<MainCard {...mockMainCard} />);

    expect(screen.getByTestId('pagination')).toBeInTheDocument();
    expect(screen.getByText(/Page 1 of 3/)).toBeInTheDocument();
  });

  it('renders see details link with correct href', () => {
    render(<MainCard {...mockMainCard} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/movie/1');
    expect(screen.getByText('See details')).toBeInTheDocument();
  });

  it('displays genre in the correct section', () => {
    render(<MainCard {...mockMainCard} />);

    const genreElement = screen.getByText('Action');
    expect(genreElement).toHaveClass('text-primary-500');
  });

  it('has details link with eye icon', () => {
    render(<MainCard {...mockMainCard} />);

    const link = screen.getByRole('link', { name: /See details/ });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/movie/1');
  });
});