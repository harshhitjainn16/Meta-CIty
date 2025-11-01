/**
 * Proposal service - Business logic for proposals
 */

import { Proposal } from '@/types';
import { BUILDING_TYPES } from '@/constants';
import { formatTimeRemaining } from '@/utils/format';

export class ProposalService {
  /**
   * Calculate proposal status based on current time and votes
   */
  static getProposalStatus(proposal: Proposal, currentTime: number = Math.floor(Date.now() / 1000)): Proposal['status'] {
    if (proposal.executed) {
      return proposal.passed ? 'passed' : 'failed';
    }

    const endTime = Number(proposal.endTime);
    if (currentTime >= endTime) {
      return proposal.votesFor > proposal.votesAgainst ? 'passed' : 'failed';
    }

    return 'active';
  }

  /**
   * Calculate voting percentage
   */
  static getVotingPercentage(proposal: Proposal): { for: number; against: number } {
    const total = proposal.votesFor + proposal.votesAgainst;
    if (total === 0n) {
      return { for: 0, against: 0 };
    }

    const forPct = (Number(proposal.votesFor) / Number(total)) * 100;
    const againstPct = (Number(proposal.votesAgainst) / Number(total)) * 100;

    return {
      for: Math.round(forPct * 10) / 10,
      against: Math.round(againstPct * 10) / 10,
    };
  }

  /**
   * Get time remaining until proposal ends
   */
  static getTimeRemaining(proposal: Proposal): string {
    const endTime = Number(proposal.endTime);
    return formatTimeRemaining(endTime);
  }

  /**
   * Check if proposal can be executed
   */
  static canExecute(proposal: Proposal, totalSupply: bigint, quorumPercentage: number = 10): boolean {
    if (proposal.executed) return false;

    const endTime = Number(proposal.endTime);
    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime < endTime) return false;

    const quorum = (totalSupply * BigInt(quorumPercentage)) / 100n;
    const totalVotes = proposal.votesFor + proposal.votesAgainst;

    return totalVotes >= quorum && proposal.votesFor > proposal.votesAgainst;
  }

  /**
   * Get building type info for proposal
   */
  static getBuildingTypeInfo(buildingType: number) {
    return BUILDING_TYPES.find(bt => bt.id === buildingType);
  }
}

