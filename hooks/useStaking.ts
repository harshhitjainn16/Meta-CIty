/**
 * Hook for managing staking
 */

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useAccount } from 'wagmi';
import { CONTRACT_ADDRESSES, CONTRACT_ABIS } from '@/constants/contracts';
import { StakeInfo } from '@/types';

export function useStakeInfo() {
  const { address } = useAccount();

  const { data: stakeInfo, refetch, isLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.rewardsManager as `0x${string}`,
    abi: CONTRACT_ABIS.RewardsManager,
    functionName: 'getStakeInfo',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const { data: totalStaked } = useReadContract({
    address: CONTRACT_ADDRESSES.rewardsManager as `0x${string}`,
    abi: CONTRACT_ABIS.RewardsManager,
    functionName: 'totalStaked',
  });

  const { data: pendingRewards } = useReadContract({
    address: CONTRACT_ADDRESSES.rewardsManager as `0x${string}`,
    abi: CONTRACT_ABIS.RewardsManager,
    functionName: 'calculateStakeRewards',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  if (!stakeInfo) {
    return {
      stakeInfo: null,
      totalStaked: totalStaked || 0n,
      pendingRewards: pendingRewards || 0n,
      refetch,
      isLoading,
    };
  }

  const [amount, startTime, , totalRewards] = stakeInfo as [bigint, bigint, bigint, bigint];

  return {
    stakeInfo: {
      amount,
      startTime,
      pendingRewards: pendingRewards || 0n,
      totalRewards,
    } as StakeInfo,
    totalStaked: totalStaked || 0n,
    pendingRewards: pendingRewards || 0n,
    refetch,
    isLoading,
  };
}

export function useStake() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { address } = useAccount();

  const stake = async (amount: bigint) => {
    if (!CONTRACT_ADDRESSES.rewardsManager) {
      throw new Error('RewardsManager contract not configured');
    }

    // First approve if needed
    // Then stake

    return writeContract({
      address: CONTRACT_ADDRESSES.rewardsManager as `0x${string}`,
      abi: CONTRACT_ABIS.RewardsManager,
      functionName: 'stake',
      args: [amount],
    });
  };

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  return {
    stake,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

export function useUnstake() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const unstake = async (amount: bigint) => {
    if (!CONTRACT_ADDRESSES.rewardsManager) {
      throw new Error('RewardsManager contract not configured');
    }

    return writeContract({
      address: CONTRACT_ADDRESSES.rewardsManager as `0x${string}`,
      abi: CONTRACT_ABIS.RewardsManager,
      functionName: 'unstake',
      args: [amount],
    });
  };

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  return {
    unstake,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

export function useClaimStakeRewards() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const claimRewards = async () => {
    if (!CONTRACT_ADDRESSES.rewardsManager) {
      throw new Error('RewardsManager contract not configured');
    }

    return writeContract({
      address: CONTRACT_ADDRESSES.rewardsManager as `0x${string}`,
      abi: CONTRACT_ABIS.RewardsManager,
      functionName: 'claimStakeRewards',
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

