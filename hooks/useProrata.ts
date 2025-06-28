import { Address, zeroAddress } from "viem";
import { useClubData } from "@/hooks/useClubData";
import { useClubMemberNft } from "@/hooks/useClubMemberNft";
import { useClubContacts } from "@/hooks/useClubContacts";
import { useErc20Token } from "@/hooks/useErc20Token";
import { formatDecimals } from "@/lib/format";

export interface ProrataData {
  // Core calculation: club stake / max(minMembers, currentMembers)
  prorataAmount: bigint;
  
  // Supporting data
  clubStake: bigint;
  minMembers: bigint;
  currentMembers: number;
  divisor: number; // max(minMembers, currentMembers)
  
  // Formatted values for display
  formatted: {
    prorataAmount: string;
    clubStake: string;
    minMembers: string;
    currentMembers: string;
    divisor: string;
  };
}

export const useProrata = (clubAddress: Address) => {
  const { data: clubData, isLoading: clubDataLoading } = useClubData(clubAddress);
  const { data: memberNftData, isLoading: memberNftLoading } = useClubMemberNft(clubAddress);
  const { data: clubContacts, isLoading: clubContactsLoading } = useClubContacts(clubAddress);
  
  // Only call useErc20Token if we have an asset address
  const { data: assetToken, isLoading: assetTokenLoading } = useErc20Token(
    clubData?.assetAddress || zeroAddress
  );

  // Check if any data is still loading
  const isLoading = clubDataLoading || memberNftLoading || clubContactsLoading || assetTokenLoading;
  
  // If data is not ready, return loading state
  // Note: we need to check if the data properties exist and have valid values
  if (isLoading || !clubData || !memberNftData || !clubContacts || !assetToken?.decimals) {
    return {
      data: null,
      isLoading,
      error: null,
    };
  }

  const {
    stakedBalance: clubStake,
  } = clubData;

  const {
    minMembers,
  } = memberNftData;

  const currentMembers = clubContacts.length;
  const { decimals: assetDecimals } = assetToken;

  // Calculate prorata: club stake / max(minMembers, currentMembers)
  const divisor = Math.max(Number(minMembers), currentMembers);
  const prorataAmount = divisor > 0 ? clubStake / BigInt(divisor) : BigInt(0);

  const data: ProrataData = {
    // Core values
    prorataAmount,
    clubStake,
    minMembers,
    currentMembers,
    divisor,
    
    // Formatted values
    formatted: {
      prorataAmount: `$${formatDecimals(prorataAmount, assetDecimals, 2)}`,
      clubStake: `$${formatDecimals(clubStake, assetDecimals, 2)}`,
      minMembers: Number(minMembers).toString(),
      currentMembers: currentMembers.toString(),
      divisor: divisor.toString(),
    },
  };

  return {
    data,
    isLoading: false,
    error: null,
  };
};

// Utility function for getting prorata calculations summary
export const getProrataInfo = (clubAddress: Address) => {
  const { data, isLoading, error } = useProrata(clubAddress);
  
  if (isLoading || !data) {
    return {
      amount: BigInt(0),
      formatted: "$0.00",
      calculation: "Loading...",
      isLoading,
      error,
    };
  }
  
  return {
    amount: data.prorataAmount,
    formatted: data.formatted.prorataAmount,
    calculation: `${data.formatted.clubStake} ÷ max(${data.formatted.minMembers}, ${data.formatted.currentMembers}) = ${data.formatted.prorataAmount}`,
    isLoading: false,
    error: null,
  };
}; 