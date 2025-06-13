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
    unclaimedRewards, // This is BigInt from contract
  } = creditClub;

  // These are already regular numbers from useClubData conversion
  const totalPercent = bidBucketPercent + callerPercent + winnerPercent;

  // Add safety check for division by zero and invalid BigInt
  if (totalPercent === 0 || !unclaimedRewards || unclaimedRewards === 0n) {
    return {
      bidBucketBalance: 0,
      bidBucketPercentage: 0,
      callerBalance: 0,
      callerPercentage: 0,
      winnerBalance: 0,
      winnerPercentage: 0,
      rewardsToDistribute: 0,
    };
  }

  try {
    // Safely convert BigInt to number for calculations
    const rewardsToDistribute = formattedNumber(unclaimedRewards, TOKENS.UNION, 8);
    
    // Ensure no NaN values
    if (isNaN(rewardsToDistribute) || !isFinite(rewardsToDistribute)) {
      throw new Error("Invalid rewards calculation");
    }

    const bidBucketBalance = (rewardsToDistribute * bidBucketPercent) / totalPercent;
    const callerBalance = (rewardsToDistribute * callerPercent) / totalPercent;
    const winnerBalance = (rewardsToDistribute * winnerPercent) / totalPercent;

    return {
      bidBucketBalance,
      bidBucketPercentage: (bidBucketPercent / totalPercent) * 100,
      callerBalance,
      callerPercentage: (callerPercent / totalPercent) * 100,
      winnerBalance,
      winnerPercentage: (winnerPercent / totalPercent) * 100,
      rewardsToDistribute,
    };
  } catch (error) {
    console.error("Error calculating rewards:", error);
    return {
      bidBucketBalance: 0,
      bidBucketPercentage: 0,
      callerBalance: 0,
      callerPercentage: 0,
      winnerBalance: 0,
      winnerPercentage: 0,
      rewardsToDistribute: 0,
    };
  }
}