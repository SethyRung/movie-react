// Email validation
export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// URL validation
export const isValidUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// TMDB specific validation
export const isValidTmdbId = (id: number | string | unknown): boolean => {
  if (typeof id !== 'number' && typeof id !== 'string') return false;
  const numId = typeof id === 'string' ? parseInt(id, 10) : id;
  return !isNaN(numId) && numId > 0 && Number.isInteger(numId);
};

export const isValidTmdbImagePath = (path: string): boolean => {
  if (!path || typeof path !== 'string') return false;

  // TMDB image paths typically start with / and don't contain spaces
  return path.startsWith('/') && !path.includes(' ') && path.length > 1;
};

// Date validation
export const isValidDateString = (dateString: string): boolean => {
  if (!dateString || typeof dateString !== 'string') return false;

  // Check for YYYY-MM-DD format
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoDateRegex.test(dateString)) return false;

  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

export const isValidYear = (year: number | string): boolean => {
  const numYear = typeof year === 'string' ? parseInt(year as string, 10) : year;

  if (isNaN(numYear)) return false;

  // Valid years for movies: 1888 (first motion picture) to current year + 10
  const currentYear = new Date().getFullYear();
  return numYear >= 1888 && numYear <= currentYear + 10;
};

// Rating validation
export const isValidRating = (rating: number, maxRating = 10): boolean => {
  return (
    typeof rating === 'number' &&
    !isNaN(rating) &&
    rating >= 0 &&
    rating <= maxRating
  );
};

// Runtime validation
export const isValidRuntime = (minutes: number): boolean => {
  return (
    typeof minutes === 'number' &&
    !isNaN(minutes) &&
    minutes >= 0 &&
    minutes <= 1000 // Sanity check: no movie should be longer than 1000 minutes
  );
};

// String validation utilities
export const isValidString = (value: unknown, minLength = 0, maxLength = 1000): boolean => {
  return (
    typeof value === 'string' &&
    value.trim().length >= minLength &&
    value.trim().length <= maxLength
  );
};

export const isEmptyOrWhitespace = (value: string): boolean => {
  return !value || typeof value !== 'string' || value.trim().length === 0;
};

// Array validation
export const isValidArray = <T>(
  value: unknown,
  itemValidator?: (item: T) => boolean,
  minLength = 0,
  maxLength = Infinity
): boolean => {
  if (!Array.isArray(value)) return false;

  if (value.length < minLength || value.length > maxLength) return false;

  if (itemValidator) {
    return value.every(itemValidator);
  }

  return true;
};

// Movie object validation
export const isValidMovie = (movie: unknown): boolean => {
  if (!movie || typeof movie !== 'object') return false;

  const requiredFields = ['id', 'title'];
  const movieObj = movie as Record<string, unknown>;

  return requiredFields.every(field => {
    const value = movieObj[field];
    return field === 'id' ? isValidTmdbId(value) : isValidString(value, 1);
  });
};

// Search query validation
export const isValidSearchQuery = (query: string): boolean => {
  if (!query || typeof query !== 'string') return false;

  const trimmed = query.trim();

  // Must be between 1 and 100 characters after trimming
  if (trimmed.length < 1 || trimmed.length > 100) return false;

  // Allow letters, numbers, spaces, and common punctuation
  const validCharsRegex = /^[a-zA-Z0-9\s\-._'"!?:,]+$/;
  return validCharsRegex.test(trimmed);
};

// Pagination validation
export const isValidPage = (page: number | string): boolean => {
  const pageNum = typeof page === 'string' ? parseInt(page, 10) : page;

  return (
    typeof pageNum === 'number' &&
    !isNaN(pageNum) &&
    pageNum >= 1 &&
    pageNum <= 1000 // Reasonable upper limit for TMDB pages
  );
};

// Form validation helpers
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => boolean;
  message?: string;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateField = (value: unknown, rules: ValidationRule): string | null => {
  // Required validation
  if (rules.required && (value === undefined || value === null || value === '')) {
    return rules.message || 'This field is required';
  }

  // Skip other validations if field is empty and not required
  if (!rules.required && (value === undefined || value === null || value === '')) {
    return null;
  }

  // String validations
  if (typeof value === 'string') {
    if (rules.minLength && value.length < rules.minLength) {
      return rules.message || `Minimum ${rules.minLength} characters required`;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return rules.message || `Maximum ${rules.maxLength} characters allowed`;
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return rules.message || 'Invalid format';
    }
  }

  // Custom validation
  if (rules.custom && !rules.custom(value)) {
    return rules.message || 'Invalid value';
  }

  return null;
};

export const validateForm = (data: Record<string, unknown>, rules: ValidationRules): ValidationResult => {
  const errors: Record<string, string> = {};

  Object.keys(rules).forEach(field => {
    const error = validateField(data[field], rules[field]);
    if (error) {
      errors[field] = error;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};