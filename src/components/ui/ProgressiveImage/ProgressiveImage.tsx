import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '../../../lib/utils';
import { useIntersectionObserver } from '@/hooks/usePerformance';

export interface ProgressiveImageProps {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  onLoad?: () => void;
  onError?: () => void;
  lazy?: boolean;
  threshold?: number;
  rootMargin?: string;
  fadeInDuration?: number;
  quality?: number;
  sizes?: string;
  priority?: boolean;
  decoding?: 'async' | 'sync' | 'auto';
  loading?: 'lazy' | 'eager';
  style?: React.CSSProperties;
}

export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  alt,
  placeholder,
  className,
  width,
  height,
  onLoad,
  onError,
  lazy = true,
  threshold = 0.1,
  rootMargin = '50px',
  fadeInDuration = 300,
  quality = 75,
  sizes,
  priority = false,
  decoding = 'async',
  loading = 'lazy',
  style,
}) => {
  const [imageState, setImageState] = useState<
    'loading' | 'loaded' | 'error' | 'placeholder'
  >(lazy ? 'placeholder' : 'loading');
  const imgRef = useRef<HTMLImageElement>(null);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { observe, unobserve } = useIntersectionObserver(
    {
      threshold,
      rootMargin,
    },
    [src]
  );

  // Generate responsive image sources
  const generateSrcSet = useCallback((baseSrc: string, baseQuality: number = quality) => {
    const widths = [320, 640, 768, 1024, 1280, 1536];
    return widths
      .map((w) => {
        const qualityAdjustment = w <= 640 ? baseQuality + 10 : baseQuality;
        return `${baseSrc}?w=${w}&q=${qualityAdjustment} ${w}w`;
      })
      .join(', ');
  }, [quality]);

  // Handle image loading
  const loadImage = useCallback(
    (imageSrc: string) => {
      if (imgRef.current?.complete && imgRef.current?.src === imageSrc) {
        setImageState('loaded');
        onLoad?.();
        return;
      }

      setImageState('loading');

      // Set a timeout for slow-loading images
      loadTimeoutRef.current = setTimeout(() => {
        if (imageState === 'loading') {
          console.warn(`Image loading is taking longer than expected: ${imageSrc}`);
        }
      }, 5000);

      const img = new Image();
      img.src = imageSrc;
      img.srcset = generateSrcSet(imageSrc);
      img.sizes = sizes || '';
      img.decoding = decoding;

      img.onload = () => {
        if (loadTimeoutRef.current) {
          clearTimeout(loadTimeoutRef.current);
        }
        setImageState('loaded');
        onLoad?.();
      };

      img.onerror = () => {
        if (loadTimeoutRef.current) {
          clearTimeout(loadTimeoutRef.current);
        }
        setImageState('error');
        onError?.();
      };
    },
    [generateSrcSet, sizes, decoding, onLoad, onError, imageState]
  );

  // Lazy loading logic
  useEffect(() => {
    if (priority || !lazy) {
      setTimeout(() => loadImage(src), 0);
      return;
    }

    const element = imgRef.current;
    if (!element) return;

    observe(element);

    return () => {
      unobserve(element);
    };
  }, [src, lazy, priority, loadImage, observe, unobserve]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, []);

  // Generate image style
  const imageStyle: React.CSSProperties = {
    ...style,
    width,
    height,
    transition: imageState === 'loaded' ? `opacity ${fadeInDuration}ms ease-in-out` : 'none',
    opacity: imageState === 'loaded' ? 1 : 0,
    objectFit: 'cover',
  };

  const placeholderStyle: React.CSSProperties = {
    ...style,
    width,
    height,
    backgroundColor: '#f3f4f6',
    backgroundImage: placeholder
      ? `url(${placeholder})`
      : `linear-gradient(to right, #f3f4f6 0%, #e5e7eb 20%, #f3f4f6 40%, #e5e7eb 100%)`,
    backgroundSize: placeholder ? 'cover' : '200% 100%',
    backgroundPosition: 'center',
    animation: !placeholder ? 'shimmer 2s infinite' : 'none',
    objectFit: 'cover',
  };

  const shimmerKeyframes = `
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `;

  const isLoading = imageState === 'loading' || (lazy && imageState === 'placeholder');

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Add shimmer animation styles */}
      {!placeholder && (
        <style>{shimmerKeyframes}</style>
      )}

      {/* Placeholder or low-quality image */}
      {(placeholder || isLoading) && (
        <div
          className={cn(
            'absolute inset-0 transition-opacity duration-300',
            imageState === 'loaded' ? 'opacity-0' : 'opacity-100'
          )}
          style={placeholderStyle}
        />
      )}

      {/* Main image */}
      <img
        ref={imgRef}
        src={priority || !lazy ? src : undefined}
        srcSet={priority || !lazy ? generateSrcSet(src) : undefined}
        sizes={sizes}
        alt={alt}
        className={cn(
          'w-full h-full',
          imageState === 'error' ? 'invisible' : 'visible'
        )}
        style={imageStyle}
        loading={priority ? 'eager' : loading}
        decoding={decoding}
        crossOrigin="anonymous"
      />

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/5">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-primary-600 rounded-full animate-spin" />
        </div>
      )}

      {/* Error state */}
      {imageState === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-500">
          <svg
            className="w-8 h-8 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-sm">Failed to load image</span>
        </div>
      )}
    </div>
  );
};

export default ProgressiveImage;