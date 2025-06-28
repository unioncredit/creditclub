import { base, baseSepolia } from "viem/chains";

import { DEFAULT_CHAIN_ID, IToken, TOKENS, UNIT, WAD } from "@/constants";

export const useToken = (chainId?: number) => {
  console.log('🔍 useToken called with:', {
    chainId,
    DEFAULT_CHAIN_ID,
    baseId: base.id,
    baseSepoliaId: baseSepolia.id,
  });
  
  const tokens: Record<number, IToken> = {
    [base.id]: TOKENS.USDC,
    [baseSepolia.id]: TOKENS.USDC,
  };

  const id = chainId || DEFAULT_CHAIN_ID;
  const token = tokens[id] || tokens[DEFAULT_CHAIN_ID];

  console.log('🔍 useToken resolution:', {
    resolvedId: id,
    token,
    tokensMap: tokens,
  });

  if (!token) {
    console.error('❌ Token not found!', {
      chainId: id,
      availableChains: Object.keys(tokens),
    });
    throw new Error(`Token not found in useToken hook for chainId: ${id}`);
  }

  const result = {
    token,
    unit: UNIT[token],
    wad: WAD[token],
  };
  
  console.log('✅ useToken returning:', result);
  return result;
};