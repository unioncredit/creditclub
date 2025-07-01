import { Address, erc20Abi, zeroAddress } from "viem";
import { useAccount, useReadContracts } from "wagmi";

import { DEFAULT_CHAIN_ID } from "@/constants";
import { useClubMemberNft } from "@/hooks/useClubMemberNft";

export const useGatingToken = (clubAddress: Address) => {
  const { address } = useAccount();
  const { data: memberNftData } = useClubMemberNft(clubAddress);

  const {
    gatingTokenAddress,
  } = memberNftData;

  const contracts = [
    {
      abi: erc20Abi,
      address: gatingTokenAddress,
      functionName: "balanceOf",
      args: [address],
    },
    {
      abi: erc20Abi,
      address: gatingTokenAddress,
      functionName: "name",
    },
    {
      abi: erc20Abi,
      address: gatingTokenAddress,
      functionName: "symbol",
    }
  ];

  const result = useReadContracts({
    // @ts-ignore
    contracts: contracts.map(c => ({
      ...c,
      chainId: DEFAULT_CHAIN_ID,
    })),
    query: {
      enabled: !!clubAddress && gatingTokenAddress !== zeroAddress,
    }
  });

  const extractResult = (contractResult: any): any => {
    if (contractResult?.status === 'success' && contractResult?.result !== undefined) {
      return contractResult.result;
    }
    if (contractResult?.result !== undefined) {
      return contractResult.result;
    }
    return null;
  };

  const safeBigInt = (value: any): bigint => {
    const extracted = extractResult(value);
    if (typeof extracted === 'bigint') return extracted;
    if (typeof extracted === 'number') return BigInt(extracted);
    if (typeof extracted === 'string') return BigInt(extracted || 0);
    return 0n;
  };

  const safeString = (value: any): string => {
    const extracted = extractResult(value);
    if (typeof extracted === 'string') return extracted;
    if (extracted === null || extracted === undefined) return "";
    return String(extracted);
  };

  const resultData = result.data || [];
  const balance = safeBigInt(resultData[0]);
  const name = safeString(resultData[1]) || "Unknown";
  const symbol = safeString(resultData[2]) || "UNKNOWN";

  const data = {
    balance,
    name,
    symbol,
    address: gatingTokenAddress,
    enabled: gatingTokenAddress !== zeroAddress,
    qualified: balance > 0n,
  };

  return { 
    data,
    isLoading: result.isLoading,
    isRefetching: result.isRefetching,
    refetch: result.refetch,
  };
};