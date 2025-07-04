import { Address } from "viem";
import { useClubData } from "@/hooks/useClubData";

export const useClubActivation = (clubAddress: Address) => {
  const { data: clubData } = useClubData(clubAddress);
  
  const { activationDate, lockupEnd } = clubData;

  // Current time in seconds
  const currentTime = Math.floor(Date.now() / 1000);

  const activated = activationDate > 0n;
  const lockEndTime = Number(lockupEnd);
  const remaining = Math.max(lockEndTime - currentTime, 0);

  return {
    activated,
    locked: !activated || currentTime < lockEndTime,
    remaining,
  }
};