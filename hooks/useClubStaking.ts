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

  const [
    name = "",
    decimals = 0,
    symbol = "",
    totalAssets = 0n,
    withdrawBucketAddress = zeroAddress,
  ] = result.data?.map(d => d.result as never) || [];

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