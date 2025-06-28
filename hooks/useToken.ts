import { base, baseSepolia } from "viem/chains";

import { DEFAULT_CHAIN_ID, IToken, TOKENS, UNIT, WAD } from "@/constants";

export const useToken = (chainId?: number) => {
  const tokens: Record<number, IToken> = {
    [base.id]: TOKENS.USDC,
    [baseSepolia.id]: TOKENS.USDC,
  };

  const id = chainId || DEFAULT_CHAIN_ID;
  const token = tokens[id] || tokens[DEFAULT_CHAIN_ID];

  // Always return a valid token, defaulting to USDC
  const safeToken = token || TOKENS.USDC;

  return {
    token: safeToken,
    unit: UNIT[safeToken],
    wad: WAD[safeToken],
  };
};