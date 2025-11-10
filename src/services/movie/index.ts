// Export the main service class
import { MovieService } from './MovieService';

export { MovieService };

// Export types and validation schemas
export * from './types';
export * from './validation';

// Create and export a singleton instance
export const movieService = new MovieService();

// Export service factory for creating instances with different configurations
export const createMovieService = () => new MovieService();

// Default export
export default MovieService;