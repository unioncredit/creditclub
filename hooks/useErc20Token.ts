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

  // Helper function to safely extract contract result values
  const extractResult = (contractResult: any): any => {
    if (contractResult?.status === 'success' && contractResult?.result !== undefined) {
      return contractResult.result;
    }
    if (contractResult?.result !== undefined) {
      return contractResult.result;
    }
    return null;
  };

  const safeString = (value: any): string => {
    const extracted = extractResult(value);
    if (typeof extracted === 'string') return extracted;
    if (extracted === null || extracted === undefined) return "";
    return String(extracted);
  };

  const safeNumber = (value: any): number => {
    const extracted = extractResult(value);
    if (typeof extracted === 'number') return extracted;
    if (typeof extracted === 'bigint') return Number(extracted);
    if (typeof extracted === 'string') return parseInt(extracted) || 0;
    return 0;
  };

  const resultData = result.data || [];
  const name = safeString(resultData[0]);
  const symbol = safeString(resultData[1]);
  const decimals = safeNumber(resultData[2]);

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