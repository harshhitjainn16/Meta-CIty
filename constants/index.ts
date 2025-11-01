/**
 * Application Constants
 */

import { BuildingType } from '@/types';

export const BUILDING_TYPES = [
  { id: BuildingType.Residential, name: 'Residential', icon: '🏠', color: '#4CAF50', sustainability: 50, economic: 500 },
  { id: BuildingType.Commercial, name: 'Commercial', icon: '🏢', color: '#2196F3', sustainability: 40, economic: 1000 },
  { id: BuildingType.Industrial, name: 'Industrial', icon: '🏭', color: '#FF9800', sustainability: 30, economic: 900 },
  { id: BuildingType.Park, name: 'Park', icon: '🌳', color: '#8BC34A', sustainability: 100, economic: 400 },
  { id: BuildingType.SolarFarm, name: 'Solar Farm', icon: '☀️', color: '#FFC107', sustainability: 95, economic: 700 },
  { id: BuildingType.Hospital, name: 'Hospital', icon: '🏥', color: '#F44336', sustainability: 60, economic: 800 },
  { id: BuildingType.School, name: 'School', icon: '🏫', color: '#9C27B0', sustainability: 65, economic: 600 },
  { id: BuildingType.RecyclingCenter, name: 'Recycling Center', icon: '♻️', color: '#00BCD4', sustainability: 90, economic: 550 },
] as const;

export const VOTING_PERIOD = 3 * 24 * 60 * 60; // 3 days in seconds
export const PROPOSAL_THRESHOLD = BigInt(100 * 10 ** 18); // 100 tokens
export const QUORUM_PERCENTAGE = 10; // 10% of total supply

export const STAKING_APY = 10; // 10% APY
export const BASE_BUILDING_REWARD = BigInt(10 * 10 ** 18); // 10 tokens per day
export const SUSTAINABILITY_MULTIPLIER = 2;

export const GRID_SIZE = 6;
export const CELL_SIZE = 100;

export const APP_CONFIG = {
  name: 'MetaCity',
  description: 'DAO-Powered City Builder',
  version: '1.0.0',
} as const;

