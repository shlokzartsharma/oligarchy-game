// Resource definitions and management
// Resources are raw materials that can be produced, traded, and consumed

export type ResourceType = 
  | 'steel'
  | 'fuel'
  | 'chips'
  | 'grain'
  | 'media_impressions'
  | 'data'
  | 'labor'
  | 'energy';

export interface Resource {
  type: ResourceType;
  name: string;
  description: string;
  basePrice: number; // Base market price
  unit: string; // e.g., "tons", "barrels", "TB"
}

export const RESOURCES: Record<ResourceType, Resource> = {
  steel: {
    type: 'steel',
    name: 'Steel',
    description: 'Essential for construction and manufacturing',
    basePrice: 500,
    unit: 'tons',
  },
  fuel: {
    type: 'fuel',
    name: 'Fuel',
    description: 'Energy source for operations',
    basePrice: 800,
    unit: 'barrels',
  },
  chips: {
    type: 'chips',
    name: 'Semiconductor Chips',
    description: 'Critical for tech and electronics',
    basePrice: 1200,
    unit: 'units',
  },
  grain: {
    type: 'grain',
    name: 'Grain',
    description: 'Agricultural commodity',
    basePrice: 300,
    unit: 'bushels',
  },
  media_impressions: {
    type: 'media_impressions',
    name: 'Media Impressions',
    description: 'Advertising reach and influence',
    basePrice: 100,
    unit: 'impressions',
  },
  data: {
    type: 'data',
    name: 'Data',
    description: 'Information and analytics',
    basePrice: 2000,
    unit: 'TB',
  },
  labor: {
    type: 'labor',
    name: 'Labor',
    description: 'Workforce hours',
    basePrice: 50,
    unit: 'hours',
  },
  energy: {
    type: 'energy',
    name: 'Energy',
    description: 'Electricity and power',
    basePrice: 150,
    unit: 'MWh',
  },
};

export interface ResourceInventory {
  [resourceType: string]: number; // Amount owned
}

// Helper to get resource by type
export const getResource = (type: ResourceType): Resource => {
  return RESOURCES[type];
};

// Helper to get all resource types
export const getAllResourceTypes = (): ResourceType[] => {
  return Object.keys(RESOURCES) as ResourceType[];
};

