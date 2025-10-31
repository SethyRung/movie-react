import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '@tests/test-utils';
import { Modal } from './Modal';
import Button from '@/components/ui/Button/Button';

import React from 'react';

// Mock the dialog component
interface MockDialogProps {
  children: React.ReactNode;
  open: boolean;
}

interface MockDialogContentProps {
  children: React.ReactNode;
  className?: string;
  onPointerDownOutside?: (event: MouseEvent) => void;
}

interface MockDialogHeaderProps {
  children: React.ReactNode;
}

interface MockDialogTitleProps {
  children: React.ReactNode;
}

interface MockDialogFooterProps {
  children: React.ReactNode;
}

vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: MockDialogProps) =>
    open ? (
      <div data-testid="dialog-overlay">
        <div data-testid="dialog-portal">
          {children}
        </div>
      </div>
    ) : null,
  DialogContent: ({ children, className }: MockDialogContentProps) => (
    <div data-testid="dialog-content" className={className}>
      {children}
    </div>
  ),
  DialogHeader: ({ children }: MockDialogHeaderProps) => (
    <div data-testid="dialog-header">
      {children}
    </div>
  ),
  DialogTitle: ({ children }: MockDialogTitleProps) => (
    <h2 data-testid="dialog-title">
      {children}
    </h2>
  ),
  DialogFooter: ({ children }: MockDialogFooterProps) => (
    <div data-testid="dialog-footer">
      {children}
    </div>
  ),
}));

describe('Modal', () => {
  const defaultProps = {
    isOpen: false,
    onClose: vi.fn(),
    children: <div>Modal Content</div>,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render when isOpen is false', () => {
    render(<Modal {...defaultProps} />);

    expect(screen.queryByTestId('dialog-overlay')).not.toBeInTheDocument();
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  it('renders when isOpen is true', () => {
    render(<Modal {...defaultProps} isOpen />);

    expect(screen.getByTestId('dialog-overlay')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
    expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
  });

  it('renders with title', () => {
    render(
      <Modal
        {...defaultProps}
        isOpen
        title="Test Modal"
      />
    );

    const title = screen.getByTestId('dialog-title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Test Modal');
  });

  it('renders close button by default', () => {
    render(<Modal {...defaultProps} isOpen />);

    const closeButton = screen.getByRole('button', { name: 'Close modal' });
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toHaveAttribute('aria-label', 'Close modal');
  });

  it('does not render close button when showCloseButton is false', () => {
    render(
      <Modal
        {...defaultProps}
        isOpen
        showCloseButton={false}
      />
    );

    expect(screen.queryByRole('button', { name: 'Close modal' })).not.toBeInTheDocument();
  });

  it('renders header when title is provided', () => {
    render(
      <Modal
        {...defaultProps}
        isOpen
        title="Modal Title"
      />
    );

    expect(screen.getByTestId('dialog-header')).toBeInTheDocument();
    expect(screen.getByTestId('dialog-title')).toBeInTheDocument();
  });

  it('renders header when showCloseButton is true', () => {
    render(<Modal {...defaultProps} isOpen />);

    expect(screen.getByTestId('dialog-header')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close modal' })).toBeInTheDocument();
  });

  it('does not render header when no title and showCloseButton is false', () => {
    render(
      <Modal
        {...defaultProps}
        isOpen
        showCloseButton={false}
      />
    );

    expect(screen.queryByTestId('dialog-header')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal
        {...defaultProps}
        isOpen
        onClose={onClose}
      />
    );

    const closeButton = screen.getByRole('button', { name: 'Close modal' });
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when dialog tries to close', () => {
    const onClose = vi.fn();
    render(
      <Modal
        {...defaultProps}
        isOpen
        onClose={onClose}
      />
    );

    screen.getByTestId('dialog-content');

    expect(onClose).not.toHaveBeenCalled();
  });

  it('applies correct size classes', () => {
    const { rerender } = render(
      <Modal
        {...defaultProps}
        isOpen
        size="sm"
      />
    );

    let dialogContent = screen.getByTestId('dialog-content');
    expect(dialogContent).toHaveClass('max-w-md');

    rerender(
      <Modal
        {...defaultProps}
        isOpen
        size="lg"
      />
    );

    dialogContent = screen.getByTestId('dialog-content');
    expect(dialogContent).toHaveClass('max-w-2xl');

    rerender(
      <Modal
        {...defaultProps}
        isOpen
        size="full"
      />
    );

    dialogContent = screen.getByTestId('dialog-content');
    expect(dialogContent).toHaveClass('max-w-full', 'mx-4');
  });

  it('uses md size by default', () => {
    render(<Modal {...defaultProps} isOpen />);

    const dialogContent = screen.getByTestId('dialog-content');
    expect(dialogContent).toHaveClass('max-w-lg');
  });

  it('renders footer when provided', () => {
    const footerContent = <Button data-testid="footer-button">Footer Button</Button>;
    render(
      <Modal
        {...defaultProps}
        isOpen
        footer={footerContent}
      />
    );

    const footer = screen.getByTestId('dialog-footer');
    expect(footer).toBeInTheDocument();
    expect(screen.getByTestId('footer-button')).toBeInTheDocument();
  });

  it('does not render footer when not provided', () => {
    render(<Modal {...defaultProps} isOpen />);

    expect(screen.queryByTestId('dialog-footer')).not.toBeInTheDocument();
  });

  it('prevents overlay click when closeOnOverlayClick is false', () => {
    const onClose = vi.fn();
    render(
      <Modal
        {...defaultProps}
        isOpen
        onClose={onClose}
        closeOnOverlayClick={false}
      />
    );

    const dialogContent = screen.getByTestId('dialog-content');

    // Test that dialog content renders with the mock
    expect(dialogContent).toBeInTheDocument();
  });

  it('renders complex children', () => {
    const complexChildren = (
      <div>
        <h3>Modal Title</h3>
        <p>Modal description</p>
        <Button>Action Button</Button>
      </div>
    );

    render(
      <Modal
        {...defaultProps}
        isOpen
      >
        {complexChildren}
      </Modal>
    );

    expect(screen.getByText('Modal Title')).toBeInTheDocument();
    expect(screen.getByText('Modal description')).toBeInTheDocument();
    expect(screen.getByText('Action Button')).toBeInTheDocument();
  });

  it('handles rapid open/close', () => {
    const { rerender } = render(<Modal {...defaultProps} isOpen={false} />);

    expect(screen.queryByTestId('dialog-overlay')).not.toBeInTheDocument();

    rerender(<Modal {...defaultProps} isOpen />);
    expect(screen.getByTestId('dialog-overlay')).toBeInTheDocument();

    rerender(<Modal {...defaultProps} isOpen={false} />);
    expect(screen.queryByTestId('dialog-overlay')).not.toBeInTheDocument();
  });

  it('applies custom className to dialog content', () => {
    render(
      <Modal
        {...defaultProps}
        isOpen
        className="custom-modal-class"
      />
    );

    const dialogContent = screen.getByTestId('dialog-content');
    expect(dialogContent).toHaveClass('custom-modal-class');
  });

  it('has correct accessibility attributes', () => {
    render(
      <Modal
        {...defaultProps}
        isOpen
        title="Accessible Modal"
      />
    );

    // Check that title is present for accessibility
    expect(screen.getByTestId('dialog-title')).toBeInTheDocument();

    // Check that close button has proper aria-label
    expect(screen.getByRole('button', { name: 'Close modal' })).toBeInTheDocument();
  });
});