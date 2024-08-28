import { useCreditClub } from "@/providers/CreditClubDataProvider.tsx";
import { SECONDS_PER_DAY, WAD } from "@/constants.ts";

export const useVesting = () => {
  const { data: creditClub } = useCreditClub();
  const { vestingDuration, startingPercentTrust } = creditClub;

  const data = {
    percentage: Number(startingPercentTrust) / Number(WAD),
    duration: Math.round(Number(vestingDuration) / SECONDS_PER_DAY),
  }

  return { data };
}