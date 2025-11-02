// Export the main service class
import { DiscoveryService } from './DiscoveryService';

export { DiscoveryService };

// Export types and validation schemas
export * from './types';
export * from './validation';

// Create and export a singleton instance
export const discoveryService = new DiscoveryService();

// Export service factory for creating instances with different configurations
export const createDiscoveryService = () => new DiscoveryService();

// Default export
export default DiscoveryService;