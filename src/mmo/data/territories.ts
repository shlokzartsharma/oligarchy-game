import { Territory } from '../types';

export const territories: Territory[] = [
  {
    id: 't1',
    name: 'Downtown Core',
    baseYield: 2000,
    owner: null,
    resistanceScore: 3,
  },
  {
    id: 't2',
    name: 'Industrial District',
    baseYield: 1500,
    owner: null,
    resistanceScore: 2,
  },
  {
    id: 't3',
    name: 'Financial Quarter',
    baseYield: 3000,
    owner: null,
    resistanceScore: 4,
  },
  {
    id: 't4',
    name: 'Tech Hub',
    baseYield: 2500,
    owner: null,
    resistanceScore: 3,
  },
  {
    id: 't5',
    name: 'Residential Zone',
    baseYield: 1000,
    owner: null,
    resistanceScore: 1,
  },
  {
    id: 't6',
    name: 'Port District',
    baseYield: 2200,
    owner: null,
    resistanceScore: 3,
  },
  {
    id: 't7',
    name: 'University Area',
    baseYield: 1800,
    owner: null,
    resistanceScore: 2,
  },
  {
    id: 't8',
    name: 'Shopping District',
    baseYield: 2000,
    owner: null,
    resistanceScore: 2,
  },
  {
    id: 't9',
    name: 'Airport Zone',
    baseYield: 2800,
    owner: null,
    resistanceScore: 4,
  },
  {
    id: 't10',
    name: 'Suburban Outskirts',
    baseYield: 1200,
    owner: null,
    resistanceScore: 1,
  },
  {
    id: 't11',
    name: 'Entertainment District',
    baseYield: 2400,
    owner: null,
    resistanceScore: 3,
  },
  {
    id: 't12',
    name: 'Government Plaza',
    baseYield: 3500,
    owner: null,
    resistanceScore: 5,
  },
];

export const getTerritoryById = (id: string): Territory | undefined => {
  return territories.find(t => t.id === id);
};

export const getTerritoryCost = (territory: Territory): number => {
  return territory.baseYield * 10 + (territory.resistanceScore * 5000);
};

