import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className,
  variant = 'text',
  width,
  height,
  lines = 1
}) => {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-md',
  };

  const style = {
    width: width || undefined,
    height: height || undefined,
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={className}>
        <div className="space-y-2">
          {Array.from({ length: lines }, (_, i) => (
            <Skeleton
              key={i}
              className={variantClasses[variant]}
              style={{
                width: i === lines - 1 ? '75%' : '100%',
                height: height || '1rem',
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <Skeleton
      className={`${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
};

export default LoadingSkeleton;