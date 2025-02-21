import { formattedNumber } from "@/lib/format";
import { TOKENS } from "@/constants";
import { useClubData } from "@/hooks/useClubData";
import { Address } from "viem";

export const useRewards = (clubAddress: Address) => {
  const { data: creditClub } = useClubData(clubAddress);

  const {
    bidBucketPercent,
    callerPercent,
    winnerPercent,
    unclaimedRewards,
  } = creditClub;

  const totalPercent = bidBucketPercent + callerPercent + winnerPercent;

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