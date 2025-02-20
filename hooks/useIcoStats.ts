import { Address } from "viem";
import { useClubData } from "@/hooks/useClubData";
import { formatDecimals } from "@/lib/format";

export const useIcoStats = (clubAddress: Address) => {
  const result = useClubData(clubAddress);
  const { data } = result;

  const {
    initialRaise,
    decimals,
    totalAssets
  } = data;

  const percentage = initialRaise > 0n ?
    Math.min(Math.max(Number((totalAssets * BigInt(100)) / initialRaise), 0), 100)
    : 0;

  return {
    ...result,
    data: {
      current: formatDecimals(totalAssets, decimals),
      goal: formatDecimals(initialRaise, decimals),
      percentage,
    },
  }
}