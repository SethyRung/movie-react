// Export base service classes and utilities
export { BaseService } from './base/BaseService';
export * from './base/ServiceResponse';
export * from './base/errorHandling';
export * from './base/cache';

// Export individual services
import { MovieService, movieService, createMovieService } from './movie';
import { DiscoveryService, discoveryService, createDiscoveryService } from './discovery';

export { MovieService, movieService, createMovieService };
export { DiscoveryService, discoveryService, createDiscoveryService };

// Export all types from services
export * from './movie/types';
export * from './discovery/types';

// Create and export a combined service API
export class MovieAPI {
  public readonly movie: MovieService;
  public readonly discovery: DiscoveryService;

  constructor() {
    this.movie = new MovieService();
    this.discovery = new DiscoveryService();
  }

  /**
   * Clear all caches
   */
  clearAllCaches(): void {
    this.movie.clearMovieCache();
    this.discovery.clearDiscoveryCache();
  }

  /**
   * Get comprehensive cache statistics
   */
  getCacheStats() {
    return {
      movie: this.movie.getCacheStats(),
      discovery: this.discovery.getCacheStats(),
    };
  }

  /**
   * Health check for all services
   * Uses reliable endpoints that should always work
   */
  async healthCheck(): Promise<{
    movie: boolean;
    discovery: boolean;
    overall: boolean;
    details?: {
      movie: string;
      discovery: string;
    };
  }> {
    try {
      // Test discovery service first - more reliable than specific movie details
      const discoveryTest = await this.discovery.getNowPlayingMovies({ page: 1 });
      const discoveryHealthy = discoveryTest.success;

      let movieHealthy = false;
      let movieDetails = 'No movie tested';

      if (discoveryHealthy && discoveryTest.data?.results && discoveryTest.data.results.length > 0) {
        // Use the first movie from now playing results for movie service test
        const firstMovie = discoveryTest.data.results[0];
        const movieTest = await this.movie.getMovieDetails(firstMovie.id);
        movieHealthy = movieTest.success;
        movieDetails = movieTest.success ? `Movie ID ${firstMovie.id} found` : `Movie ID ${firstMovie.id} failed`;
      } else {
        // Fallback: test with a popular movie that's more likely to exist
        const popularTest = await this.discovery.getPopularMovies({ page: 1 });
        if (popularTest.success && popularTest.data?.results && popularTest.data.results.length > 0) {
          const firstPopular = popularTest.data.results[0];
          const movieTest = await this.movie.getMovieDetails(firstPopular.id);
          movieHealthy = movieTest.success;
          movieDetails = movieTest.success ? `Popular movie ID ${firstPopular.id} found` : `Popular movie ID ${firstPopular.id} failed`;
        } else {
          movieDetails = 'No movies available for testing';
        }
      }

      const discoveryDetails = discoveryTest.success
        ? `Found ${discoveryTest.data?.results?.length || 0} movies`
        : 'Discovery service failed';

      return {
        movie: movieHealthy,
        discovery: discoveryHealthy,
        overall: movieHealthy && discoveryHealthy,
        details: {
          movie: movieDetails,
          discovery: discoveryDetails,
        },
      };
    } catch (error) {
      console.error('Health check failed:', error);
      return {
        movie: false,
        discovery: false,
        overall: false,
        details: {
          movie: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          discovery: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        },
      };
    }
  }
}

// Export singleton instance
export const movieAPI = new MovieAPI();

// Export factory function
export const createMovieAPI = () => new MovieAPI();

// Default export
export default MovieAPI;