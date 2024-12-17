import { parseEther } from "viem";

import { BLOCKS_PER_YEAR, WAD } from "@/constants.ts";

export const calculateMaxBorrow = (creditLimit: bigint, originationFee: bigint): bigint => {
  const feeNum = Number(originationFee) / 1e18;
  const creditLimitNum = Number(
    creditLimit * BigInt("999999999999999") / BigInt("1000000000000000"),
  );

  return BigInt(Math.floor(creditLimitNum / (feeNum + 1)));
};

export const calculateMinPayment = (interest: bigint) => {
  const floor = parseEther("0.01");
  const interestWithMargin = interest * 10010n / 10000n;
  return interestWithMargin < floor ? floor : interestWithMargin;
};

export const calculateExpectedMinimumPayment = (
  borrowAmount: bigint,
  borrowRatePerBlock: bigint,
  overdueTime: bigint,
): bigint => {
  const floor = parseEther("0.01");
  const minimumPayment = borrowAmount * borrowRatePerBlock * overdueTime / WAD;
  return minimumPayment < floor ? floor : minimumPayment;
};

export const calculateInterestRate = (borrowRatePerSecond: bigint): bigint => {
  return borrowRatePerSecond * BLOCKS_PER_YEAR;
};