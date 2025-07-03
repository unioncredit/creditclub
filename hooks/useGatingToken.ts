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

  // Extract gating token data with proper destructuring
  const [
    balanceResult,
    nameResult,
    symbolResult,
  ] = result.data || [];

  const balance: bigint = (balanceResult?.result as bigint) ?? 0n;
  const name: string = (nameResult?.result as string) ?? "Unknown";
  const symbol: string = (symbolResult?.result as string) ?? "UNKNOWN";

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