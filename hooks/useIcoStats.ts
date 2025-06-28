import { Address } from "viem";
import { useClubData } from "@/hooks/useClubData";
import { formatDecimals } from "@/lib/format";
import { useErc20Token } from "@/hooks/useErc20Token";
import { useClubAuction } from "@/hooks/useClubAuction";

export const useIcoStats = (clubAddress: Address) => {
  const result = useClubData(clubAddress);
  const { data } = result;

  const { data: auctionData } = useClubAuction(clubAddress);
  const { data: assetToken } = useErc20Token(data.assetAddress);

  const { totalAssets } = data;
  const { decimals } = assetToken;
  const { minTarget } = auctionData;

  const percentage = minTarget > 0n ?
    Math.min(Math.max(Number((totalAssets * BigInt(100)) / minTarget), 0), 100)
    : 0;

  return {
    data: {
      current: formatDecimals(totalAssets, decimals),
      goal: formatDecimals(minTarget, decimals),
      percentage,
    },
    isLoading: result.isLoading,
    isError: result.isError,
    isFetching: result.isFetching,
    isSuccess: result.isSuccess,
    refetch: result.refetch,
  }
}