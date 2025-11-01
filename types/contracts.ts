/**
 * Contract-specific type definitions
 */

import { Address } from 'viem';

export interface ProposalStruct {
  id: bigint;
  proposer: Address;
  title: string;
  description: string;
  buildingType: number;
  x: bigint;
  y: bigint;
  fundingRequired: bigint;
  votesFor: bigint;
  votesAgainst: bigint;
  startTime: bigint;
  endTime: bigint;
  executed: boolean;
  passed: boolean;
}

export interface BuildingStruct {
  buildingType: number;
  level: bigint;
  sustainabilityScore: bigint;
  economicValue: bigint;
  createdAt: bigint;
  builder: Address;
  x: bigint;
  y: bigint;
}

export interface StakeInfoStruct {
  amount: bigint;
  startTime: bigint;
  lastClaimTime: bigint;
  totalRewards: bigint;
}

export interface TreasuryStruct {
  balance: bigint;
  totalDeposits: bigint;
  totalWithdrawals: bigint;
}

