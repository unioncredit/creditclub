import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { parseUnits } from "viem";

import { BLOCKS_PER_YEAR, IToken, TOKENS, UNIT, WAD } from "@/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatDuration(seconds: number): string {
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);

  const parts = [];
  if (days > 0) parts.push(`${days} ${days === 1 ? "day" : "days"}`);
  if (hours > 0) parts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
  if (minutes > 0) parts.push(`${minutes} ${minutes === 1 ? "minute" : "minutes"}`);

  return parts.join(", ");
}

export const calculateMaxBorrow = (creditLimit: bigint, originationFee: bigint): bigint => {
  const feeNum = Number(originationFee) / 1e18;
  const creditLimitNum = Number(
    creditLimit * BigInt("999999999999999") / BigInt("1000000000000000"),
  );

  return BigInt(Math.floor(creditLimitNum / (feeNum + 1)));
};

export const calculateMinPayment = (interest: bigint, token: IToken) => {
  const floor = parseUnits("0.01", UNIT[token]);
  const interestWithMargin = interest * 10010n / 10000n;
  return interestWithMargin < floor ? floor : interestWithMargin;
};

export const calculateExpectedMinimumPayment = (
  borrowAmount: bigint,
  borrowRatePerBlock: bigint,
  overdueTime: bigint,
  token: IToken,
): bigint => {
  const floor = parseUnits("0.01", UNIT[token]);
  const minimumPayment = borrowAmount * borrowRatePerBlock * overdueTime / WAD[TOKENS.DAI];
  return minimumPayment < floor ? floor : minimumPayment;
};

export const calculateInterestRate = (borrowRatePerSecond: bigint, token: IToken): bigint => {
  return borrowRatePerSecond * BLOCKS_PER_YEAR / BigInt(10 ** (18 - UNIT[token]));
};