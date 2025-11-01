/**
 * Building service - Business logic for buildings
 */

import { BuildingData, BuildingType } from '@/types';
import { BUILDING_TYPES } from '@/constants';
import { formatTokenAmount } from '@/utils/format';

export class BuildingService {
  /**
   * Get building type info
   */
  static getBuildingTypeInfo(type: BuildingType) {
    return BUILDING_TYPES.find(bt => bt.id === type);
  }

  /**
   * Calculate building value score (0-100)
   */
  static calculateValueScore(building: BuildingData): number {
    const sustainabilityWeight = 0.4;
    const levelWeight = 0.3;
    const economicWeight = 0.3;

    const sustainabilityScore = building.sustainability / 100;
    const levelScore = Math.min(building.level / 10, 1);
    const economicScore = Math.min(building.economicValue / 1000, 1);

    return Math.round(
      (sustainabilityScore * sustainabilityWeight +
        levelScore * levelWeight +
        economicScore * economicWeight) *
        100
    );
  }

  /**
   * Calculate upgrade cost (example: level * 100 tokens)
   */
  static calculateUpgradeCost(currentLevel: number): bigint {
    return BigInt(currentLevel * 100 * 10 ** 18);
  }

  /**
   * Format building data for display
   */
  static formatBuilding(building: BuildingData) {
    const typeInfo = this.getBuildingTypeInfo(building.type);

    return {
      ...building,
      typeInfo,
      valueScore: this.calculateValueScore(building),
      rewardsFormatted: formatTokenAmount(BigInt(building.rewards)),
      upgradeCost: this.calculateUpgradeCost(building.level),
    };
  }

  /**
   * Filter buildings by type
   */
  static filterByType(buildings: BuildingData[], type: BuildingType | null): BuildingData[] {
    if (type === null) return buildings;
    return buildings.filter(b => b.type === type);
  }

  /**
   * Sort buildings by various criteria
   */
  static sortBuildings(buildings: BuildingData[], sortBy: 'level' | 'sustainability' | 'rewards' | 'created'): BuildingData[] {
    const sorted = [...buildings];

    switch (sortBy) {
      case 'level':
        return sorted.sort((a, b) => b.level - a.level);
      case 'sustainability':
        return sorted.sort((a, b) => b.sustainability - a.sustainability);
      case 'rewards':
        return sorted.sort((a, b) => b.rewards - a.rewards);
      case 'created':
        return sorted.sort((a, b) => b.createdAt - a.createdAt);
      default:
        return sorted;
    }
  }
}

