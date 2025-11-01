/**
 * Hook for managing token balance and operations
 */

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useAccount } from 'wagmi';
import { CONTRACT_ADDRESSES, CONTRACT_ABIS } from '@/constants/contracts';
import { parseEther } from 'viem';

export function useTokenBalance() {
  const { address } = useAccount();

  const { data: balance, refetch, isLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.token as `0x${string}`,
    abi: CONTRACT_ABIS.MetaCityToken,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const { data: totalSupply } = useReadContract({
    address: CONTRACT_ADDRESSES.token as `0x${string}`,
    abi: CONTRACT_ABIS.MetaCityToken,
    functionName: 'totalSupply',
  });

  return {
    balance: balance || 0n,
    totalSupply: totalSupply || 0n,
    refetch,
    isLoading,
  };
}

export function useApproveToken() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const approve = async (spender: string, amount: bigint) => {
    if (!CONTRACT_ADDRESSES.token) {
      throw new Error('Token contract not configured');
    }

    return writeContract({
      address: CONTRACT_ADDRESSES.token as `0x${string}`,
      abi: CONTRACT_ABIS.MetaCityToken,
      functionName: 'approve',
      args: [spender as `0x${string}`, amount],
    });
  };

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  return {
    approve,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

