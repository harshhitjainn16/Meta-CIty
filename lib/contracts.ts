/**
 * @deprecated This file is kept for backward compatibility.
 * Please use the new structure:
 * - constants/contracts.ts for contract addresses and ABIs
 * - constants/index.ts for building types
 * - types/index.ts for TypeScript types
 */

// Re-export from new structure for backward compatibility
export { CONTRACT_ADDRESSES as CONTRACT_ADDRESSES_LEGACY } from '@/constants/contracts';
export { BUILDING_TYPES } from '@/constants/index';
export { CONTRACT_ABIS } from '@/constants/contracts';

// Legacy exports (deprecated but kept for compatibility)
export const METACITY_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_METACITY_TOKEN_ADDRESS || '';
export const BUILDING_NFT_ADDRESS = process.env.NEXT_PUBLIC_BUILDING_NFT_ADDRESS || '';
export const CITY_DAO_ADDRESS = process.env.NEXT_PUBLIC_CITY_DAO_ADDRESS || '';
export const REWARDS_ADDRESS = process.env.NEXT_PUBLIC_REWARDS_ADDRESS || '';
