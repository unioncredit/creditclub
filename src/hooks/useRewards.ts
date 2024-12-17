import { useClubData } from "@/providers/CreditClubDataProvider.tsx";
import { formattedNumber } from "@/utils/format.ts";
import { TOKENS } from "@/constants.ts";

export const useRewards = () => {
  const { data: creditClub } = useClubData();

  const {
    bidBucketPercent,
    callerPercent,
    winnerPercent,
    totalPercent,
    unclaimedRewards,
  } = creditClub;

  const rewardsToDistribute = formattedNumber(unclaimedRewards, TOKENS.UNION, 8);
  const bidBucketBalance = totalPercent > 0 ? (rewardsToDistribute * bidBucketPercent) / totalPercent : 0;
  const callerBalance = totalPercent > 0 ? (rewardsToDistribute * callerPercent) / totalPercent : 0;
  const winnerBalance = totalPercent > 0 ? (rewardsToDistribute * winnerPercent) / totalPercent : 0;

  return {
    bidBucketBalance,
    bidBucketPercentage: (bidBucketPercent / totalPercent) * 100,
    callerBalance,
    callerPercentage: (callerPercent / totalPercent) * 100,
    winnerBalance,
    winnerPercentage: (winnerPercent / totalPercent) * 100,
    rewardsToDistribute,
  }
}