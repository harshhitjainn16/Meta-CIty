/**
 * Formatting utility functions
 */

import { formatEther, formatUnits } from 'viem';

export const formatAddress = (address: string, startChars = 6, endChars = 4): string => {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

export const formatTokenAmount = (amount: bigint | string, decimals = 18, precision = 2): string => {
  try {
    const value = typeof amount === 'string' ? BigInt(amount) : amount;
    const formatted = formatUnits(value, decimals);
    const num = parseFloat(formatted);
    return num.toFixed(precision);
  } catch {
    return '0.00';
  }
};

export const formatEtherAmount = (amount: bigint | string, precision = 4): string => {
  try {
    const value = typeof amount === 'string' ? BigInt(amount) : amount;
    const formatted = formatEther(value);
    const num = parseFloat(formatted);
    return num.toFixed(precision);
  } catch {
    return '0.0000';
  }
};

export const formatPercentage = (value: number, decimals = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

export const formatTimeRemaining = (endTime: number | bigint): string => {
  const end = typeof endTime === 'bigint' ? Number(endTime) : endTime;
  const now = Math.floor(Date.now() / 1000);
  const remaining = end - now;

  if (remaining <= 0) return 'Ended';

  const days = Math.floor(remaining / (24 * 60 * 60));
  const hours = Math.floor((remaining % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((remaining % (60 * 60)) / 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

export const parseTokenAmount = (amount: string, decimals = 18): bigint => {
  try {
    const num = parseFloat(amount);
    if (isNaN(num)) return 0n;
    return BigInt(Math.floor(num * 10 ** decimals));
  } catch {
    return 0n;
  }
};

