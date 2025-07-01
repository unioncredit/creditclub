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

  const [
    balance = 0n,
    name = "Unknown",
    symbol = "UNKNOWN"
  ] = result.data?.map((d: any) => {
    if (d?.status === 'success' && d?.result !== undefined) return d.result;
    if (d?.result !== undefined) return d.result;
    return null;
  }) || [];

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