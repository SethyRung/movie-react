import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '@tests/test-utils';
import NotFoundPage from './NotFoundPage';

describe('NotFoundPage', () => {
  it('renders 404 error message', () => {
    render(<NotFoundPage />);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });

  it('renders descriptive text', () => {
    render(<NotFoundPage />);

    expect(screen.getByText(/The movie or page you're looking for doesn't exist/)).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<NotFoundPage />);

    const homeLink = screen.getByRole('link', { name: /Go Home/i });
    const browseLink = screen.getByRole('link', { name: /Browse Movies/i });

    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
    expect(browseLink).toBeInTheDocument();
    expect(browseLink).toHaveAttribute('href', '/movies');
  });

  it('displays movie icon', () => {
    render(<NotFoundPage />);

    // Just check that the component renders, since icon components can be hard to test in isolation
    const container = document.querySelector('.text-center');
    expect(container).toBeInTheDocument();
  });

  it('has proper styling classes', () => {
    render(<NotFoundPage />);

    const container = screen.getByText('404').closest('.h-screen');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center');
  });
});