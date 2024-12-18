import { parseUnits } from "viem";

import { BLOCKS_PER_YEAR, IToken, TOKENS, UNIT, WAD } from "@/constants.ts";

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