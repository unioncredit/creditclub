import { base, baseSepolia, mainnet, optimism } from "viem/chains";

import { DEFAULT_CHAIN_ID, IToken, TOKENS, UNIT, WAD } from "@/constants";

export const useToken = (chainId?: number) => {
  const tokens: Record<number, IToken> = {
    [base.id]: TOKENS.USDC,
    [baseSepolia.id]: TOKENS.USDC,
    [mainnet.id]: TOKENS.USDC,
    [optimism.id]: TOKENS.USDC,
  };

  const id = chainId || DEFAULT_CHAIN_ID;
  const token = tokens[id] || tokens[DEFAULT_CHAIN_ID];

  if (!token) {
    throw new Error(`Token not found in useToken hook for chainId: ${id}`);
  }

  return {
    token,
    unit: UNIT[token],
    wad: WAD[token],
  };
};