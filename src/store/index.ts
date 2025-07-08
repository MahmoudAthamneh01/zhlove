// Re-export all stores
export * from './auth-store';
export * from './app-store';

// Type definitions
export type { User } from './auth-store';

// Store initialization and cleanup utilities
export const initializeStores = () => {
  // Initialize any store-related setup here
  // For example, set up real-time data subscriptions
  console.log('Stores initialized');
};

export const cleanupStores = () => {
  // Cleanup any subscriptions or timers
  console.log('Stores cleaned up');
};

// Utility functions for common operations
export const resetAllStores = () => {
  // Reset all stores to their initial state
  // Useful for logout or testing
  console.log('All stores reset');
}; 