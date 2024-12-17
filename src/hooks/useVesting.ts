import { useClubData } from "@/providers/CreditClubDataProvider.tsx";
import { SECONDS_PER_DAY, TOKENS, WAD } from "@/constants.ts";
import { useClubMember } from "@/providers/CreditClubMemberProvider.tsx";

export const useVesting = () => {
  const { data: creditClub } = useClubData();
  const { vestingDuration, startingPercentTrust } = creditClub;

  const { data: member } = useClubMember();
  const { percentVested } = member;

  const data = {
    duration: Math.round(Number(vestingDuration) / SECONDS_PER_DAY),
    startingPercentage: Number(startingPercentTrust) / Number(WAD[TOKENS.DAI]),
    vestedPercentage: percentVested ? Number(percentVested) / Number(WAD[TOKENS.DAI]) : 0,
  }

  return { data };
}