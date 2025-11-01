/**
 * Hook for managing buildings
 */

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useAccount } from 'wagmi';
import { CONTRACT_ADDRESSES, CONTRACT_ABIS } from '@/constants/contracts';
import { BuildingData, BuildingType } from '@/types';

export function useUserBuildings() {
  const { address } = useAccount();

  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.buildingNFT as `0x${string}`,
    abi: CONTRACT_ABIS.BuildingNFT,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Note: This is a simplified version. In production, you'd need to fetch all token IDs
  // and then fetch each building's data, or use an indexer/backend

  return {
    balance: balance || 0n,
    buildings: [] as BuildingData[], // Would be populated from contract calls
    refetchBalance,
  };
}

export function useBuilding(tokenId: bigint) {
  const { data: building, refetch, isLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.buildingNFT as `0x${string}`,
    abi: CONTRACT_ABIS.BuildingNFT,
    functionName: 'buildings',
    args: [tokenId],
  });

  const { data: owner } = useReadContract({
    address: CONTRACT_ADDRESSES.buildingNFT as `0x${string}`,
    abi: CONTRACT_ABIS.BuildingNFT,
    functionName: 'ownerOf',
    args: [tokenId],
  });

  return {
    building,
    owner,
    refetch,
    isLoading,
  };
}

export function useUpgradeBuilding() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const upgradeBuilding = async (tokenId: bigint) => {
    if (!CONTRACT_ADDRESSES.buildingNFT) {
      throw new Error('BuildingNFT contract not configured');
    }

    return writeContract({
      address: CONTRACT_ADDRESSES.buildingNFT as `0x${string}`,
      abi: CONTRACT_ABIS.BuildingNFT,
      functionName: 'upgradeBuilding',
      args: [tokenId],
    });
  };

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  return {
    upgradeBuilding,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

export function useClaimBuildingRewards() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const claimRewards = async (tokenId: bigint) => {
    if (!CONTRACT_ADDRESSES.rewardsManager) {
      throw new Error('RewardsManager contract not configured');
    }

    return writeContract({
      address: CONTRACT_ADDRESSES.rewardsManager as `0x${string}`,
      abi: CONTRACT_ABIS.RewardsManager,
      functionName: 'claimBuildingRewards',
      args: [tokenId],
    });
  };

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  return {
    claimRewards,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

