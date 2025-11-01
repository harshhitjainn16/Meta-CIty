/**
 * Validation utility functions
 */

import { Address, isAddress } from 'viem';

export const isValidAddress = (address: string): boolean => {
  try {
    return isAddress(address);
  } catch {
    return false;
  }
};

export const isValidAmount = (amount: string | number): boolean => {
  try {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return !isNaN(num) && num > 0;
  } catch {
    return false;
  }
};

export const isValidProposal = (data: {
  title: string;
  description: string;
  fundingRequired: string;
  x: number;
  y: number;
}): { valid: boolean; error?: string } => {
  if (!data.title || data.title.trim().length < 3) {
    return { valid: false, error: 'Title must be at least 3 characters' };
  }

  if (!data.description || data.description.trim().length < 10) {
    return { valid: false, error: 'Description must be at least 10 characters' };
  }

  if (!isValidAmount(data.fundingRequired)) {
    return { valid: false, error: 'Invalid funding amount' };
  }

  if (data.x < 0 || data.y < 0) {
    return { valid: false, error: 'Coordinates must be positive' };
  }

  return { valid: true };
};

