import { Address } from "viem";
import { useClubData } from "@/hooks/useClubData";

export const useClubActivation = (clubAddress: Address) => {
  const { data: clubData } = useClubData(clubAddress);
  
  const { activationDate, lockupPeriod } = clubData;

  // Current time in seconds
  const currentTime = Math.floor(Date.now() / 1000);

  const activated = activationDate > 0n;
  const remaining = Math.max(Number(activationDate + lockupPeriod) - currentTime, 0);

  return {
    activated,
    locked: !activated || currentTime < (activationDate + lockupPeriod),
    remaining,
  }
};