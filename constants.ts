export type IToken = "DAI" | "USDC" | "UNION";

export const TOKENS: Record<IToken, IToken> = {
  DAI: "DAI",
  USDC: "USDC",
  UNION: "UNION",
};

export const WAD: Record<IToken, bigint> = {
  DAI: 1000000000000000000n,
  UNION: 1000000000000000000n,
  USDC: 1000000n,
};

export const UNIT: Record<IToken, number> = {
  DAI: 18,
  UNION: 18,
  USDC: 6,
};

export const DUST_THRESHOLD = {
  DAI: 10000000000000000n,
  USDC: 10000n,
  UNION: 10000000000000000n,
};