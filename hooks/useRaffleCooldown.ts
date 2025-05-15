import { useMemo } from "react";

import { useCountdown } from "@/hooks/useCountdown";
import { useClubData } from "@/hooks/useClubData";
import { Address } from "viem";

export const useRaffleCooldown = (clubAddress: Address) => {
  const { data: creditClub } = useClubData(clubAddress);
  const { rewardCooldown, lastReward } = creditClub;
  const deadline = useMemo(() => new Date((Number(lastReward) * 1000) + rewardCooldown * 1000), [lastReward, rewardCooldown]);
  const complete = deadline.getTime() <= Date.now();

  return {
    complete,
    ...useCountdown(!complete, deadline),
  }
}