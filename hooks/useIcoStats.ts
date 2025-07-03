import { Address } from "viem";
import { useClubData } from "@/hooks/useClubData";
import { formatDecimals } from "@/lib/format";
import { useErc20Token } from "@/hooks/useErc20Token";
import { useClubAuction } from "@/hooks/useClubAuction";

export const useIcoStats = (clubAddress: Address) => {
  const result = useClubData(clubAddress);
  const { data } = result;

  const { data: auctionData } = useClubAuction(clubAddress);
  const { data: assetToken } = useErc20Token(data?.assetAddress);

  const totalAssets: bigint = data?.totalAssets ?? 0n;
  const decimals: number = assetToken?.decimals ?? 18;
  const minTarget: bigint = auctionData?.minTarget ?? 0n;

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
    isRefetching: result.isRefetching,
    refetch: result.refetch,
  }
}