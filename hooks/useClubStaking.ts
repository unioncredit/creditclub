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

  // Helper functions for safe data extraction
  const safeString = (value: any): string => {
    if (typeof value === 'string') return value;
    if (value === null || value === undefined) return "";
    return String(value);
  };

  const safeNumber = (value: any): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'bigint') return Number(value);
    if (typeof value === 'string') return parseInt(value) || 0;
    return 0;
  };

  const safeBigInt = (value: any): bigint => {
    if (typeof value === 'bigint') return value;
    if (typeof value === 'number') return BigInt(value);
    if (typeof value === 'string') return BigInt(value || 0);
    return 0n;
  };

  const safeAddress = (value: any): Address => {
    if (typeof value === 'string' && value.startsWith('0x')) return value as Address;
    return zeroAddress;
  };

  const stakingData = result.data || [];
  const name = safeString(stakingData[0]);
  const decimals = safeNumber(stakingData[1]);
  const symbol = safeString(stakingData[2]);
  const totalAssets = safeBigInt(stakingData[3]);
  const withdrawBucketAddress = safeAddress(stakingData[4]);

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