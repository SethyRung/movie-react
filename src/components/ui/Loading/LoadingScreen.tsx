import React from 'react';
import { cn } from '../../../lib/utils';
import { LoadingSpinner } from './LoadingSpinner';

export interface LoadingScreenProps {
  className?: string;
  message?: string;
  progress?: number;
  showProgress?: boolean;
  variant?: 'default' | 'minimal' | 'full-screen';
  backdrop?: boolean;
  cancelable?: boolean;
  onCancel?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  className,
  message = 'Loading...',
  progress,
  showProgress = false,
  variant = 'default',
  backdrop = true,
  cancelable = false,
  onCancel,
}) => {
  const handleBackdropClick = () => {
    if (cancelable && onCancel) {
      onCancel();
    }
  };

  if (variant === 'minimal') {
    return (
      <div className={cn('flex items-center justify-center p-4', className)}>
        <LoadingSpinner size="md" variant="dots" label={message} />
      </div>
    );
  }

  if (variant === 'full-screen') {
    return (
      <div
        className={cn(
          'fixed inset-0 z-50 flex items-center justify-center',
          backdrop && 'bg-black/50 backdrop-blur-sm',
          className
        )}
        onClick={handleBackdropClick}
      >
        <div
          className="bg-background border border-border rounded-lg p-8 max-w-sm w-full mx-4 shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col items-center space-y-4">
            <LoadingSpinner size="lg" variant="ripple" />

            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {message}
              </h3>

              {showProgress && typeof progress === 'number' && (
                <div className="space-y-2">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {Math.round(progress)}% complete
                  </p>
                </div>
              )}

              {cancelable && onCancel && (
                <button
                  onClick={onCancel}
                  className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 space-y-4',
        backdrop && 'bg-background/80 backdrop-blur-sm rounded-lg border border-border',
        className
      )}
    >
      <LoadingSpinner size="lg" variant="bars" />

      <div className="text-center space-y-2">
        <p className="text-foreground font-medium">{message}</p>

        {showProgress && typeof progress === 'number' && (
          <div className="w-full bg-muted rounded-full h-1.5 max-w-xs">
            <div
              className="bg-primary h-1.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        )}

        {cancelable && onCancel && (
          <button
            onClick={onCancel}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;