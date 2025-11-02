import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from "../../../test-utils";
import Button from "@components/ui/Button/Button";

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-secondary-500', 'text-white', 'hover:bg-secondary-600');
    expect(button).toHaveClass('h-10', 'px-4', 'py-2');
    expect(button).not.toBeDisabled();
  });

  it('renders with custom className', () => {
    render(<Button className="custom-class">Click me</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('renders different variants correctly', () => {
    const { rerender } = render(<Button variant="destructive">Destructive</Button>);
    let button = screen.getByRole('button');
    expect(button).toHaveClass('bg-red-500', 'text-white', 'hover:bg-red-600');

    rerender(<Button variant="outline">Outline</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('border', 'border-gray-300', 'bg-white');

    rerender(<Button variant="secondary">Secondary</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('bg-gray-200', 'text-gray-900');

    rerender(<Button variant="ghost">Ghost</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('hover:bg-gray-100');

    rerender(<Button variant="link">Link</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('text-secondary-600', 'underline-offset-4');

    rerender(<Button variant="tertiary">Tertiary</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('bg-tertiary-500', 'text-white');
  });

  it('renders different sizes correctly', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    let button = screen.getByRole('button');
    expect(button).toHaveClass('h-9', 'px-3');

    rerender(<Button size="lg">Large</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('h-11', 'px-8');

    rerender(<Button size="icon">Icon</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('h-10', 'w-10');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Disabled</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50');

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('shows loading spinner when loading prop is true', () => {
    render(<Button loading>Loading</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();

    // Check for spinner
    const spinner = button.querySelector('svg');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('animate-spin', 'h-4', 'w-4');
  });

  it('is disabled when loading', () => {
    const handleClick = vi.fn();
    render(<Button loading onClick={handleClick}>Loading</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('passes through other HTML button attributes', () => {
    render(
      <Button
        type="submit"
        aria-label="Submit form"
        data-testid="submit-button"
      >
        Submit
      </Button>
    );

    const button = screen.getByTestId('submit-button');
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('aria-label', 'Submit form');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<Button ref={ref}>Ref Button</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toBe(screen.getByRole('button'));
  });

  it('handles children correctly', () => {
    render(
      <Button>
        <span data-testid="custom-child">Custom Child</span>
      </Button>
    );

    expect(screen.getByTestId('custom-child')).toBeInTheDocument();
  });
});