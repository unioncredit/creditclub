import { useCountdown } from "@/hooks/useCountdown.ts";
import { useClubData } from "@/providers/CreditClubDataProvider.tsx";
import { useMemo } from "react";

export const useFeelingLuckyCountdown = () => {
  const { data: creditClub } = useClubData();
  const { cooldown, checkpoint } = creditClub;
  const deadline = useMemo(() => new Date((Number(checkpoint) * 1000) + cooldown * 1000), [checkpoint, cooldown]);
  const complete = deadline.getTime() <= Date.now();

  return {
    complete,
    ...useCountdown(!complete, deadline),
  }
}