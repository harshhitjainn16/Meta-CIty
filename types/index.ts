/**
 * Core Type Definitions for MetaCity
 */

export enum BuildingType {
  Residential = 0,
  Commercial = 1,
  Industrial = 2,
  Park = 3,
  SolarFarm = 4,
  Hospital = 5,
  School = 6,
  RecyclingCenter = 7,
}

export interface BuildingData {
  id: number;
  tokenId?: number;
  type: BuildingType;
  level: number;
  sustainability: number;
  economicValue: number;
  owner: string;
  rewards: number;
  x: number;
  y: number;
  createdAt: number;
  uri?: string;
}

export interface Proposal {
  id: number;
  proposer: string;
  title: string;
  description: string;
  buildingType: BuildingType;
  x: number;
  y: number;
  fundingRequired: bigint;
  votesFor: bigint;
  votesAgainst: bigint;
  startTime: bigint;
  endTime: bigint;
  executed: boolean;
  passed: boolean;
  status: 'active' | 'passed' | 'failed' | 'executed';
}

export interface StakeInfo {
  amount: bigint;
  startTime: bigint;
  pendingRewards: bigint;
  totalRewards: bigint;
}

export interface Treasury {
  balance: bigint;
  totalDeposits: bigint;
  totalWithdrawals: bigint;
}

export interface CityStats {
  totalBuildings: number;
  activeMembers: number;
  treasuryValue: bigint;
  sustainabilityScore: number;
  totalStaked: bigint;
  activeProposals: number;
}

export interface ContractAddresses {
  token: string;
  buildingNFT: string;
  cityDAO: string;
  rewardsManager: string;
}

