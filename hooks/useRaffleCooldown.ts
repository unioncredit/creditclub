import { useMemo } from "react";

import { useCountdown } from "@/hooks/useCountdown";
import { useClubData } from "@/hooks/useClubData";
import { Address } from "viem";

export const useRaffleCooldown = (clubAddress: Address) => {
  const { data: creditClub } = useClubData(clubAddress);
  const rewardCooldown: number = creditClub?.rewardCooldown ?? 0;
  const lastReward: bigint = creditClub?.lastReward ?? 0n;
  
  const deadline = useMemo(() => {
    try {
      // Add validation for invalid timestamps and handle BigInt conversion
      const lastRewardTime = Number(lastReward); // Convert BigInt to number safely
      const cooldownMs = Number(rewardCooldown) * 1000; // Ensure rewardCooldown is number
      
      if (isNaN(lastRewardTime) || isNaN(cooldownMs) || lastRewardTime < 0 || cooldownMs < 0) {
        return new Date(); // Return current time as fallback
      }
      
      return new Date((lastRewardTime * 1000) + cooldownMs);
    } catch (error) {
      console.error("Error calculating raffle deadline:", error);
      return new Date(); // Return current time as fallback
    }
  }, [lastReward, rewardCooldown]);
  
  const complete = deadline.getTime() <= Date.now();

  return {
    complete,
    ...useCountdown(!complete, deadline),
  }
}