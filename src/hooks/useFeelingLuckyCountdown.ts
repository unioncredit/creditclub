import { useCountdown } from "@/hooks/useCountdown.ts";
import { useCreditClub } from "@/providers/CreditClubDataProvider.tsx";
import { useMemo } from "react";

export const useFeelingLuckyCountdown = () => {
  const { data: creditClub } = useCreditClub();
  const { cooldown, checkpoint } = creditClub;
  const deadline = useMemo(() => new Date((Number(checkpoint) * 1000) + cooldown * 1000), [checkpoint, cooldown]);

  return {
    complete: deadline.getTime() <= Date.now(),
    ...useCountdown(deadline),
  }
}