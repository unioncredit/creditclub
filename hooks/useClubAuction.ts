import { Address, maxUint256 } from "viem";
import { useReadContracts } from "wagmi";

import { DEFAULT_CHAIN_ID } from "@/constants";
import { useClubData } from "@/hooks/useClubData";
import { useAuctionContract } from "@/hooks/useAuctionContract";

export const useClubAuction = (clubAddress: Address) => {
  const { data: clubData } = useClubData(clubAddress);
  const { auctionAddress } = clubData;

  const auctionContract = useAuctionContract(auctionAddress);

  const contracts = [
    {
      ...auctionContract,
      functionName: "minTarget",
    },
    {
      ...auctionContract,
      functionName: "maxTarget",
    },
    {
      ...auctionContract,
      functionName: "totalDeposits",
    },
    {
      ...auctionContract,
      functionName: "end",
    },
    {
      ...auctionContract,
      functionName: "isKilled",
    },
    {
      ...auctionContract,
      functionName: "isFailed",
    },
    {
      ...auctionContract,
      functionName: "period",
    },
    {
      ...auctionContract,
      functionName: "vaultRatio",
    },
    {
      ...auctionContract,
      functionName: "assetRatio",
    },
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

  // Properly extract wagmi contract results
  const [
    minTargetResult,
    maxTargetResult,
    totalDepositsResult,
    endResult,
    isKilledResult,
    isFailedResult,
    periodResult,
    vaultRatioResult,
    assetRatioResult,
  ] = result.data || [];

  // Extract actual values with proper typing and safe conversion
  const minTarget: bigint = (minTargetResult?.result as bigint) ?? 0n;
  const maxTarget: bigint = (maxTargetResult?.result as bigint) ?? 0n;
  const totalDeposits: bigint = (totalDepositsResult?.result as bigint) ?? 0n;
  const end: bigint = (endResult?.result as bigint) ?? 0n;
  const isKilled: boolean = (isKilledResult?.result as boolean) ?? false;
  const isFailed: boolean = (isFailedResult?.result as boolean) ?? false;
  const period: bigint = (periodResult?.result as bigint) ?? 0n;
  const vaultRatio: bigint = (vaultRatioResult?.result as bigint) ?? 0n;
  const assetRatio: bigint = (assetRatioResult?.result as bigint) ?? 0n;

  const data = {
    minTarget,
    maxTarget,
    totalDeposits,
    end,
    isKilled,
    isFailed,
    hasMaxTarget: maxTarget !== maxUint256,
    readyToSettle: totalDeposits >= minTarget,
    period,
    vaultRatio,
    assetRatio,
  };

  return { 
    data,
    isLoading: result.isLoading,
    isRefetching: result.isRefetching,
    refetch: result.refetch,
  };
};