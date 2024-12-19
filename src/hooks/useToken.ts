import { base, optimism } from "viem/chains";

import { DEFAULT_CHAIN_ID, IToken, TOKENS, UNIT, WAD } from "@/constants.ts";

export const useToken = (chainId?: number) => {
  const tokens: Record<number, IToken> = {
    [optimism.id]: TOKENS.DAI,
    [base.id]: TOKENS.USDC,
  };

  const id = chainId || DEFAULT_CHAIN_ID;
  const token = tokens[id] || tokens[DEFAULT_CHAIN_ID];

  return {
    token,
    unit: UNIT[token],
    wad: WAD[token],
  };
};