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

  const [
    minTarget = 0n,
    maxTarget = 0n,
    totalDeposits = 0n,
    end = 0n,
    isKilled = false,
    isFailed = false,
    period = 0n,
    vaultRatio = 0n,
    assetRatio = 0n,
  ] = result.data?.map(d => d.result as never) || [];

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

  return { ...result, data };
};