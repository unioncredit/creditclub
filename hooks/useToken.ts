import { baseSepolia } from "viem/chains";

import { DEFAULT_CHAIN_ID, IToken, TOKENS, UNIT, WAD } from "@/constants";

export const useToken = (chainId?: number) => {
  const tokens: Record<number, IToken> = {
    [baseSepolia.id]: TOKENS.USDC,
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