import { Address, erc20Abi } from "viem";
import { useReadContracts } from "wagmi";

import { DEFAULT_CHAIN_ID } from "@/constants";

export const useErc20Token = (tokenAddress: Address) => {
  const contracts = [
    {
      abi: erc20Abi,
      address: tokenAddress,
      functionName: "name",
    },
    {
      abi: erc20Abi,
      address: tokenAddress,
      functionName: "symbol",
    },
    {
      abi: erc20Abi,
      address: tokenAddress,
      functionName: "decimals",
    },
  ];

  const result = useReadContracts({
    contracts: contracts.map(c => ({
      ...c,
      chainId: DEFAULT_CHAIN_ID,
    })),
    query: {
      enabled: !!tokenAddress,
    }
  });

  // Extract token data with proper destructuring
  const [
    nameResult,
    symbolResult,
    decimalsResult,
  ] = result.data || [];

  const name: string = (nameResult?.result as string) ?? "";
  const symbol: string = (symbolResult?.result as string) ?? "";
  const decimals: number = (decimalsResult?.result as number) ?? 0;

  const data = {
    address: tokenAddress,
    name,
    symbol,
    decimals,
  };

  return { 
    data,
    isLoading: result.isLoading,
    isRefetching: result.isRefetching,
    refetch: result.refetch,
  };
};