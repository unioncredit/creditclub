import { useAccount } from "wagmi";
import { base, optimism } from "viem/chains";

import { DEFAULT_CHAIN, IToken, TOKENS, UNIT, WAD } from "@/constants.ts";

export const useToken = (chainId?: number) => {
  const { chain: connectedChain = DEFAULT_CHAIN } = useAccount();

  const tokens: Record<number, IToken> = {
    [optimism.id]: TOKENS.DAI,
    [base.id]: TOKENS.USDC,
  };

  const id = chainId || connectedChain?.id || base.id;
  const token = tokens[id] || tokens[DEFAULT_CHAIN.id];

  return {
    token,
    unit: UNIT[token],
    wad: WAD[token],
  };
};