import { useMemo } from "react";

import { useCountdown } from "@/hooks/useCountdown";
import { useClubData } from "@/hooks/useClubData";
import { Address } from "viem";

export const useRaffleCooldown = (clubAddress: Address) => {
  const { data: creditClub } = useClubData(clubAddress);
  const { cooldown, checkpoint } = creditClub;
  const deadline = useMemo(() => new Date((Number(checkpoint) * 1000) + cooldown * 1000), [checkpoint, cooldown]);
  const complete = deadline.getTime() <= Date.now();

  return {
    complete,
    ...useCountdown(!complete, deadline),
  }
}