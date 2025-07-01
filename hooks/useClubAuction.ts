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

  // Helper functions for safe data extraction
  const safeBigInt = (value: any): bigint => {
    if (typeof value === 'bigint') return value;
    if (typeof value === 'number') return BigInt(value);
    if (typeof value === 'string') return BigInt(value || 0);
    return 0n;
  };

  const safeBoolean = (value: any): boolean => {
    if (typeof value === 'boolean') return value;
    return Boolean(value);
  };

  const auctionData = result.data || [];
  const minTarget = safeBigInt(auctionData[0]);
  const maxTarget = safeBigInt(auctionData[1]);
  const totalDeposits = safeBigInt(auctionData[2]);
  const end = safeBigInt(auctionData[3]);
  const isKilled = safeBoolean(auctionData[4]);
  const isFailed = safeBoolean(auctionData[5]);
  const period = safeBigInt(auctionData[6]);
  const vaultRatio = safeBigInt(auctionData[7]);
  const assetRatio = safeBigInt(auctionData[8]);

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