import { describe, it, expect } from 'vitest';
import { cn } from '../../src/utils/cn';

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2');
  });

  it('should handle conditional classes', () => {
    expect(cn('base-class', true && 'conditional-class', false && 'hidden-class')).toBe('base-class conditional-class');
  });

  it('should handle undefined and null values', () => {
    expect(cn('base-class', undefined, null, 'another-class')).toBe('base-class another-class');
  });

  it('should handle Tailwind class conflicts', () => {
    expect(cn('px-4', 'px-8')).toBe('px-8');
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
  });
});