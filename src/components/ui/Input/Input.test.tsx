import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '@tests/test-utils';
import { useState } from 'react';
import Input from './Input';

describe('Input', () => {
  it('renders with basic props', () => {
    render(<Input placeholder="Enter text" />);

    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('flex', 'h-10', 'w-full', 'rounded-md', 'border', 'border-gray-300');
  });

  it('renders with label', () => {
    render(<Input label="Email" id="email" />);

    const label = screen.getByText('Email');
    const input = screen.getByRole('textbox');

    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'email');
    expect(input).toHaveAttribute('id', 'email');
  });

  it('generates unique id when not provided', () => {
    render(<Input label="Test Label" />);

    const label = screen.getByText('Test Label');
    const input = screen.getByRole('textbox');

    const inputId = input.getAttribute('id');
    expect(label).toHaveAttribute('for', inputId);
    expect(inputId).toMatch(/^input-[\w-]+$/);
  });

  it('displays error state correctly', () => {
    render(<Input error="This field is required" />);

    const input = screen.getByRole('textbox');
    const errorMessage = screen.getByText('This field is required');

    expect(input).toHaveClass('border-red-500');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('text-red-600');
  });

  it('displays helper text when no error', () => {
    render(<Input helperText="Please enter your email" />);

    const helperText = screen.getByText('Please enter your email');
    expect(helperText).toBeInTheDocument();
    expect(helperText).toHaveClass('text-gray-500');
  });

  it('does not display helper text when error is present', () => {
    render(
      <Input
        error="This field is required"
        helperText="Please enter your email"
      />
    );

    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.queryByText('Please enter your email')).not.toBeInTheDocument();
  });

  it('renders with start icon', () => {
    const StartIcon = () => <div data-testid="start-icon">Icon</div>;
    render(<Input startIcon={<StartIcon />} />);

    const startIcon = screen.getByTestId('start-icon');
    const input = screen.getByRole('textbox');

    expect(startIcon).toBeInTheDocument();
    expect(input).toHaveClass('pl-10');
  });

  it('renders with end icon', () => {
    const EndIcon = () => <div data-testid="end-icon">Icon</div>;
    render(<Input endIcon={<EndIcon />} />);

    const endIcon = screen.getByTestId('end-icon');
    const input = screen.getByRole('textbox');

    expect(endIcon).toBeInTheDocument();
    expect(input).toHaveClass('pr-10');
  });

  it('renders with both start and end icons', () => {
    const StartIcon = () => <div data-testid="start-icon">Start</div>;
    const EndIcon = () => <div data-testid="end-icon">End</div>;
    render(
      <Input
        startIcon={<StartIcon />}
        endIcon={<EndIcon />}
      />
    );

    const startIcon = screen.getByTestId('start-icon');
    const endIcon = screen.getByTestId('end-icon');
    const input = screen.getByRole('textbox');

    expect(startIcon).toBeInTheDocument();
    expect(endIcon).toBeInTheDocument();
    expect(input).toHaveClass('pl-10', 'pr-10');
  });

  it('handles user input correctly', () => {
    render(<Input placeholder="Type here" />);

    const input = screen.getByPlaceholderText('Type here');

    fireEvent.change(input, { target: { value: 'Hello World' } });

    expect(input).toHaveValue('Hello World');
  });

  it('handles focus events', () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();

    render(<Input onFocus={handleFocus} onBlur={handleBlur} />);

    const input = screen.getByRole('textbox');

    fireEvent.focus(input);
    expect(handleFocus).toHaveBeenCalledTimes(1);

    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    render(<Input className="custom-input-class" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-input-class');
  });

  it('applies custom container className', () => {
    render(<Input containerClassName="custom-container-class" />);

    const container = screen.getByRole('textbox').closest('div')?.parentElement;
    expect(container).toHaveClass('custom-container-class', 'space-y-2');
  });

  it('handles disabled state', () => {
    render(<Input disabled />);

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50');
  });

  it('handles different input types', () => {
    const { rerender } = render(<Input type="email" />);
    let input = screen.getByDisplayValue('');
    expect(input).toHaveAttribute('type', 'email');

    rerender(<Input type="password" />);
    input = screen.getByDisplayValue('');
    expect(input).toHaveAttribute('type', 'password');

    rerender(<Input type="number" />);
    input = screen.getByDisplayValue('');
    expect(input).toHaveAttribute('type', 'number');
  });

  it('passes through HTML input attributes', () => {
    render(
      <Input
        maxLength={10}
        autoComplete="email"
        required
        aria-describedby="helper-text"
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('maxLength', '10');
    expect(input).toHaveAttribute('autoComplete', 'email');
    expect(input).toHaveAttribute('required');
    expect(input).toHaveAttribute('aria-describedby', 'helper-text');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<Input ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current).toBe(screen.getByRole('textbox'));
  });

  it('handles controlled component pattern', () => {
    const TestComponent = () => {
      const [value, setValue] = useState('');
      return (
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Controlled input"
        />
      );
    };

    render(<TestComponent />);

    const input = screen.getByPlaceholderText('Controlled input');
    expect(input).toHaveValue('');

    fireEvent.change(input, { target: { value: 'test' } });
    expect(input).toHaveValue('test');
  });
});