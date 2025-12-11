// MMO Module Entry Point
// Future: This can be used for module-level exports and initialization

// New unified world store (recommended)
export { useWorldStore } from './state/worldStore';

// Legacy export for backward compatibility
// Note: The old useMmoStore structure has been replaced with useWorldStore
// Other routes may need updates to use the new Company-based model
export { useWorldStore as useMmoStore } from './state/worldStore';

export * from './types';
export { industries } from './data/industries';
export { territories } from './data/territories';

