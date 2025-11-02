import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '@tests/test-utils';
import CastCard from './CastCard';

// Mock the skeleton component
interface MockSkeletonProps {
  className?: string;
}

vi.mock('@/components/skeleton', () => ({
  default: ({ className }: MockSkeletonProps) => <div data-testid="skeleton" className={className} />,
  __esModule: true,
}));

const mockCast = {
  profile: '/cast-profile.jpg',
  name: 'John Doe',
  character: 'Main Character',
};

const mockCastWithoutProfile = {
  profile: null,
  name: 'Jane Smith',
  character: 'Supporting Character',
};

describe('CastCard', () => {
  it('renders cast information correctly', () => {
    render(<CastCard {...mockCast} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Main Character')).toBeInTheDocument();
  });

  it('shows profile image with correct src and alt', () => {
    render(<CastCard {...mockCast} />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', '/cast-profile.jpg');
    expect(image).toHaveAttribute('alt', 'John Doe_profile');
  });

  it('shows skeleton when image fails to load', () => {
    render(<CastCard {...mockCast} />);

    const image = screen.getByRole('img');
    fireEvent.error(image);

    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('has correct styling classes', () => {
    render(<CastCard {...mockCast} />);

    const container = document.querySelector('.bg-tertiary-500');
    expect(container).toBeInTheDocument();

    const nameElement = screen.getByText('John Doe');
    expect(nameElement).toHaveClass('text-white', 'font-redHatMono', 'font-bold');

    const characterElement = screen.getByText('Main Character');
    expect(characterElement).toHaveClass('text-grey-500', 'font-roboto', 'font-bold');
  });

  it('shows skeleton when no profile picture is provided', () => {
    render(<CastCard {...mockCastWithoutProfile} />);

    // Should show skeleton instead of image when profile is null
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Supporting Character')).toBeInTheDocument();
  });

  it('has correct aspect ratio and dimensions', () => {
    render(<CastCard {...mockCast} />);

    const container = screen.getByRole('img').closest('.w-36');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('aspect-[9_/_16]');
  });
});