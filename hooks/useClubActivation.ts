import { Address } from "viem";
import { useClubData } from "@/hooks/useClubData";
import { useClubAuction } from "@/hooks/useClubAuction";

export const useClubActivation = (clubAddress: Address) => {
  const { data: clubData } = useClubData(clubAddress);
  const { data: auctionData } = useClubAuction(clubAddress);
  
  const isActivated: boolean = clubData?.isActivated ?? false;
  const lockupEnd: bigint = clubData?.lockupEnd ?? 0n;
  const maxTarget: bigint = auctionData?.maxTarget ?? 0n;
  const minTarget: bigint = auctionData?.minTarget ?? 0n;
  const totalDeposits: bigint = auctionData?.totalDeposits ?? 0n;
  const end: bigint = auctionData?.end ?? 0n;

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