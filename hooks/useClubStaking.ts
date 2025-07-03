import { Address, zeroAddress } from "viem";
import { useReadContracts } from "wagmi";

import { DEFAULT_CHAIN_ID } from "@/constants";
import { useClubData } from "@/hooks/useClubData";
import { useStakingContract } from "@/hooks/useStakingContract";

export const useClubStaking = (clubAddress: Address) => {
  const { data: clubData } = useClubData(clubAddress);
  const { stakingAddress } = clubData;

  const stakingContract = useStakingContract(stakingAddress);

  const contracts = [
    {
      ...stakingContract,
      functionName: "name",
    },
    {
      ...stakingContract,
      functionName: "decimals",
    },
    {
      ...stakingContract,
      functionName: "symbol",
    },
    {
      ...stakingContract,
      functionName: "totalAssets",
    },
    {
      ...stakingContract,
      functionName: "withdrawBucket",
    }
  ];

  const result = useReadContracts({
    // @ts-ignore
    contracts: contracts.map(c => ({
      ...c,
      chainId: DEFAULT_CHAIN_ID,
    })),
    query: {
      enabled: !!clubAddress,
      staleTime: Infinity,
    }
  });

  // Extract staking data with proper wagmi result destructuring
  const [
    nameResult,
    decimalsResult,
    symbolResult,
    totalAssetsResult,
    withdrawBucketAddressResult,
  ] = result.data || [];

  const name: string = (nameResult?.result as string) ?? "";
  const decimals: number = (decimalsResult?.result as number) ?? 0;
  const symbol: string = (symbolResult?.result as string) ?? "";
  const totalAssets: bigint = (totalAssetsResult?.result as bigint) ?? 0n;
  const withdrawBucketAddress: Address = (withdrawBucketAddressResult?.result as Address) ?? zeroAddress;

  const data = {
    name,
    decimals,
    symbol,
    totalAssets,
    withdrawBucketAddress,
  };

  return { 
    data,
    isLoading: result.isLoading,
    isRefetching: result.isRefetching,
    refetch: result.refetch,
  };
};