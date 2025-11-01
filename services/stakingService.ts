/**
 * Staking service - Business logic for staking and rewards
 */

import { StakeInfo } from '@/types';
import { STAKING_APY } from '@/constants';
import { formatTokenAmount } from '@/utils/format';

export class StakingService {
  /**
   * Calculate annual rewards for a staked amount
   */
  static calculateAnnualRewards(amount: bigint): bigint {
    return (amount * BigInt(STAKING_APY)) / 100n;
  }

  /**
   * Calculate daily rewards for a staked amount
   */
  static calculateDailyRewards(amount: bigint): bigint {
    const annual = this.calculateAnnualRewards(amount);
    return annual / 365n;
  }

  /**
   * Calculate hourly rewards for a staked amount
   */
  static calculateHourlyRewards(amount: bigint): bigint {
    const daily = this.calculateDailyRewards(amount);
    return daily / 24n;
  }

  /**
   * Calculate estimated rewards for time period
   */
  static calculateRewardsForPeriod(amount: bigint, days: number): bigint {
    const daily = this.calculateDailyRewards(amount);
    return daily * BigInt(days);
  }

  /**
   * Format stake info for display
   */
  static formatStakeInfo(stakeInfo: StakeInfo) {
    return {
      amount: formatTokenAmount(stakeInfo.amount),
      pendingRewards: formatTokenAmount(stakeInfo.pendingRewards),
      totalRewards: formatTokenAmount(stakeInfo.totalRewards),
      annualRewards: formatTokenAmount(this.calculateAnnualRewards(stakeInfo.amount)),
    };
  }

  /**
   * Check if user can unstake (no lock period, so always true)
   */
  static canUnstake(stakeInfo: StakeInfo | null): boolean {
    return stakeInfo !== null && stakeInfo.amount > 0n;
  }
}

