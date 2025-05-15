import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Address, keccak256, parseUnits } from "viem";

import { BLOCKS_PER_YEAR, IToken, TOKENS, UNIT, WAD } from "@/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(seconds: number): string {
  if (seconds <= 0) {
    return "Expired";
  }

  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);

  const parts = [];
  if (days > 0) parts.push(`${days} ${days === 1 ? "day" : "days"}`);
  if (hours > 0) parts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
  if (minutes > 0 && days === 0) parts.push(`${minutes} ${minutes === 1 ? "minute" : "minutes"}`);

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

export function getInitials(text: string): string {
  return text
    .split(" ")
    .map(word => word.charAt(0).toUpperCase())
    .join("");
}

// Function to generate a deterministic random number between 1-10 using the address as a seed
export const generateNumberFromAddress = (address: Address, max = 10): number => {
  // Hash the address using keccak256 to create deterministic output
  const hash = keccak256(address);

  // Extract a numeric value from the hash
  const numericValue = parseInt(hash.slice(0, 8), 16); // Take the first 4 bytes (8 chars) of the hash

  // Create a random number between 1-max (using modulo operation + 1)
  return (numericValue % max) + 1;
};

export function capitalize(text: string): string {
  if (!text) return text; // Handle empty or null values.
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export const objectToWhere = (where?: { [key: string]: string }) => {
  return where
    ? `where: { ${Object.keys(where)
      .map((key) => `${key}: "${where[key]}"`)
      .join(",")} }`
    : "";
}