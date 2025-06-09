import { Address } from "viem";
import { useClubData } from "@/hooks/useClubData";
import { useClubAuction } from "@/hooks/useClubAuction";

export const useClubActivation = (clubAddress: Address) => {
  const { data: clubData } = useClubData(clubAddress);
  const { data: auctionData } = useClubAuction(clubAddress);
  
  const { isActivated, lockupEnd } = clubData;
  const { maxTarget, minTarget, totalDeposits, end } = auctionData;

  // Current time in seconds
  const currentTime = Math.floor(Date.now() / 1000);

  const remaining = Math.max(Number(lockupEnd) - currentTime, 0);



  return {
    activated: isActivated,
    locked: !isActivated || currentTime < lockupEnd,
    readyToSettle: totalDeposits >= maxTarget || (totalDeposits >= minTarget && end < currentTime),
    remaining,
  }
};