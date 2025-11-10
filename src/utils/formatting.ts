import { format, parseISO, isValid } from 'date-fns';

// Date formatting utilities
export const formatDate = (dateString: string, formatStr = 'MMM dd, yyyy'): string => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return 'Invalid date';
    return format(date, formatStr);
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid date';
  }
};

export const formatYear = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return 'Invalid year';
    return format(date, 'yyyy');
  } catch (error) {
    console.error('Year formatting error:', error);
    return 'Invalid year';
  }
};

export const formatRuntime = (minutes: number): string => {
  if (!minutes || minutes < 0) return 'Unknown runtime';

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}m`;
  }

  return `${hours}h ${remainingMinutes}m`;
};

// Number formatting utilities
export const formatNumber = (num: number, locale = 'en-US'): string => {
  if (typeof num !== 'number' || isNaN(num)) return '0';
  return new Intl.NumberFormat(locale).format(num);
};

export const formatCurrency = (amount: number, currency = 'USD', locale = 'en-US'): string => {
  if (typeof amount !== 'number' || isNaN(amount)) return '$0';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};

// Rating formatting utilities
export const formatRating = (rating: number): string => {
  if (typeof rating !== 'number' || isNaN(rating)) return 'N/A';
  return rating.toFixed(1);
};

export const formatPercentage = (value: number, decimals = 1): string => {
  if (typeof value !== 'number' || isNaN(value)) return 'N/A';
  return `${value.toFixed(decimals)}%`;
};

// Text formatting utilities
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength).trim()}...`;
};

export const capitalizeWords = (text: string): string => {
  if (!text || typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const capitalizeFirst = (text: string): string => {
  if (!text || typeof text !== 'string') return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// URL/Path formatting utilities
export const formatImageUrl = (path: string, size = 'w500'): string => {
  if (!path) return '/placeholder-movie.jpg';

  // If it's already a full URL, return as is
  if (path.startsWith('http')) return path;

  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;

  return `https://image.tmdb.org/t/p/${size}/${cleanPath}`;
};

export const formatBackdropUrl = (path: string, size = 'w1280'): string => {
  return formatImageUrl(path, size);
};

export const formatPosterUrl = (path: string, size = 'w342'): string => {
  return formatImageUrl(path, size);
};

export const formatProfileUrl = (path: string, size = 'w185'): string => {
  return formatImageUrl(path, size);
};

// Language formatting utilities
export const formatLanguage = (languageCode: string): string => {
  const languageNames: Record<string, string> = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    it: 'Italian',
    pt: 'Portuguese',
    ru: 'Russian',
    ja: 'Japanese',
    ko: 'Korean',
    zh: 'Chinese',
    ar: 'Arabic',
    hi: 'Hindi',
    th: 'Thai',
    sv: 'Swedish',
    no: 'Norwegian',
    da: 'Danish',
    fi: 'Finnish',
    nl: 'Dutch',
    pl: 'Polish',
    tr: 'Turkish',
  };

  return languageNames[languageCode] || languageCode.toUpperCase();
};

// Genre formatting utilities
export const formatGenres = (genres: Array<{ id: number; name: string }>): string => {
  if (!Array.isArray(genres) || genres.length === 0) return 'No genres';
  return genres.map(genre => genre.name).join(', ');
};

// Utility to format movie metadata
export const formatMovieMetadata = (movie: {
  release_date?: string;
  runtime?: number;
  vote_average?: number;
  original_language?: string;
  genres?: Array<{ id: number; name: string }>;
}): string => {
  const parts: string[] = [];

  if (movie.release_date) {
    parts.push(formatYear(movie.release_date));
  }

  if (movie.runtime) {
    parts.push(formatRuntime(movie.runtime));
  }

  if (movie.genres && movie.genres.length > 0) {
    parts.push(movie.genres[0].name);
  }

  if (movie.original_language) {
    parts.push(formatLanguage(movie.original_language));
  }

  return parts.join(' • ');
};