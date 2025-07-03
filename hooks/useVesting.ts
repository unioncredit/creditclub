import { SECONDS_PER_DAY, WAD_1E18 } from "@/constants";
import { useClubData } from "@/hooks/useClubData";
import { useClubMember } from "@/hooks/useClubMember";
import { Address } from "viem";
import { useAccount } from "wagmi";

export const useVesting = (clubAddress: Address) => {
  const { address } = useAccount();

  const { data: clubData, isLoading: clubDataLoading } = useClubData(clubAddress);
  const { data: member, isLoading: memberLoading } = useClubMember(address, clubAddress);

  // Safe extraction functions to ensure primitive values
  const safeBigInt = (value: any): bigint => {
    if (typeof value === 'bigint') return value;
    if (typeof value === 'string' || typeof value === 'number') {
      try {
        return BigInt(value);
      } catch {
        return 0n;
      }
    }
    return 0n;
  };

  const vestingDurationInSeconds: bigint = safeBigInt(clubData?.vestingDurationInSeconds);
  const startingPercentTrust: bigint = safeBigInt(clubData?.startingPercentTrust);
  const percentVested: bigint = safeBigInt(member?.percentVested);

  // Number of days to fully vest - ensure we get a number
  const durationNumber = Number(vestingDurationInSeconds) / SECONDS_PER_DAY;
  const duration = isNaN(durationNumber) ? 0 : Math.round(durationNumber);

  // Calculate vested percentage safely
  const percentVestedNumber = Number(percentVested);
  const wadNumber = Number(WAD_1E18);
  const vestedPercentage = (percentVestedNumber && wadNumber) ? percentVestedNumber / wadNumber : 0;

  // Calculate starting percentage safely
  const startingPercentNumber = Number(startingPercentTrust);
  const startingPercentage = (startingPercentNumber && wadNumber) ? startingPercentNumber / wadNumber : 0;

  // Calculate vested days safely
  const vestedDaysCalc = duration * vestedPercentage;
  const vestedDays = isNaN(vestedDaysCalc) ? 0 : Math.round(vestedDaysCalc);

  const data = {
    enabled: vestingDurationInSeconds > 0n,
    duration: Number(duration), // Ensure it's a number
    startingPercentage: Number(startingPercentage), // Ensure it's a number
    vestedPercentage: Number(vestedPercentage), // Ensure it's a number
    vestedDays: Number(vestedDays) // Ensure it's a number
  }

  const isLoading = clubDataLoading || memberLoading;

  return { data, isLoading };
}