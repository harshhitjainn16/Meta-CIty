/**
 * Hook for managing proposals
 */

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useWatchContractEvent } from 'wagmi';
import { useAccount } from 'wagmi';
import { CONTRACT_ADDRESSES, CONTRACT_ABIS } from '@/constants/contracts';
import { Proposal } from '@/types';
import { formatEtherAmount, formatTimeRemaining } from '@/utils/format';

export function useProposals() {
  const { address } = useAccount();

  const { data: proposalCount, refetch: refetchCount } = useReadContract({
    address: CONTRACT_ADDRESSES.cityDAO as `0x${string}`,
    abi: CONTRACT_ABIS.CityDAO,
    functionName: 'proposalCount',
  });

  const proposals = useReadContract({
    address: CONTRACT_ADDRESSES.cityDAO as `0x${string}`,
    abi: CONTRACT_ABIS.CityDAO,
    functionName: 'proposals',
    args: [0n], // This would need to be adjusted for multiple proposals
  });

  return {
    proposalCount: proposalCount || 0n,
    proposals,
    refetchCount,
  };
}

export function useCreateProposal() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const createProposal = async (data: {
    title: string;
    description: string;
    buildingType: number;
    x: bigint;
    y: bigint;
    fundingRequired: bigint;
  }) => {
    if (!CONTRACT_ADDRESSES.cityDAO) {
      throw new Error('CityDAO contract not configured');
    }

    return writeContract({
      address: CONTRACT_ADDRESSES.cityDAO as `0x${string}`,
      abi: CONTRACT_ABIS.CityDAO,
      functionName: 'createProposal',
      args: [
        data.title,
        data.description,
        data.buildingType,
        data.x,
        data.y,
        data.fundingRequired,
      ],
    });
  };

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  return {
    createProposal,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

export function useVote() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const vote = async (proposalId: bigint, support: boolean, amount: bigint) => {
    if (!CONTRACT_ADDRESSES.cityDAO) {
      throw new Error('CityDAO contract not configured');
    }

    return writeContract({
      address: CONTRACT_ADDRESSES.cityDAO as `0x${string}`,
      abi: CONTRACT_ABIS.CityDAO,
      functionName: 'vote',
      args: [proposalId, support, amount],
    });
  };

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  return {
    vote,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

export function useExecuteProposal() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const executeProposal = async (proposalId: bigint) => {
    if (!CONTRACT_ADDRESSES.cityDAO) {
      throw new Error('CityDAO contract not configured');
    }

    return writeContract({
      address: CONTRACT_ADDRESSES.cityDAO as `0x${string}`,
      abi: CONTRACT_ABIS.CityDAO,
      functionName: 'executeProposal',
      args: [proposalId],
    });
  };

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  return {
    executeProposal,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

