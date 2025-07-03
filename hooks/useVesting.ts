import { SECONDS_PER_DAY, WAD_1E18 } from "@/constants";
import { useClubData } from "@/hooks/useClubData";
import { useClubMember } from "@/hooks/useClubMember";
import { Address } from "viem";
import { useAccount } from "wagmi";

export const useVesting = (clubAddress: Address) => {
  const { address } = useAccount();

  const { data: clubData } = useClubData(clubAddress);
  const vestingDurationInSeconds: bigint = clubData?.vestingDurationInSeconds ?? 0n;
  const startingPercentTrust: bigint = clubData?.startingPercentTrust ?? 0n;

  const { data: member } = useClubMember(address, clubAddress);
  const percentVested: bigint = member?.percentVested ?? 0n;

  // Number of days to fully vest
  const duration = Math.round(Number(vestingDurationInSeconds) / SECONDS_PER_DAY);

  const vestedPercentage = percentVested ? Number(percentVested) / Number(WAD_1E18) : 0;

  const data = {
    enabled: vestingDurationInSeconds > 0n,
    duration,
    startingPercentage: Number(startingPercentTrust) / Number(WAD_1E18),
    vestedPercentage,
    vestedDays: Math.round(duration * vestedPercentage)
  }

  return { data };
}