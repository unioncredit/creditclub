import { Address } from "viem";
import { useClubData } from "@/hooks/useClubData";

export const useClubActivation = (clubAddress: Address) => {
  const { data: clubData } = useClubData(clubAddress);
  
  const { isActivated, lockupEnd } = clubData;

  // Current time in seconds
  const currentTime = Math.floor(Date.now() / 1000);

  const remaining = Math.max(Number(lockupEnd) - currentTime, 0);

  return {
    activated: isActivated,
    locked: !isActivated || currentTime < lockupEnd,
    remaining,
  }
};