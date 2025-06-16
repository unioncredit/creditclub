import { Address, zeroAddress } from "viem";
import { useReadContracts } from "wagmi";

import { DEFAULT_CHAIN_ID } from "@/constants";
import { useClubData } from "@/hooks/useClubData";
import { authAbi } from "@/abis/auth";

export const useClubAuth = (clubAddress: Address) => {
  const { data: clubData, isLoading: clubDataLoading } = useClubData(clubAddress);
  const { ownerAddress } = clubData || {};

  // For debugging: let's just return the owner address as the management roles
  // This is a temporary fix to test if the addresses are actually non-zero
  const data = {
    authAddress: ownerAddress,
    creditManagerAddress: ownerAddress, // temporarily use owner as credit manager
    managerAddress: ownerAddress, // temporarily use owner as manager  
    feeManagerAddress: ownerAddress, // temporarily use owner as fee manager
  };

  return { 
    isLoading: clubDataLoading,
    data 
  };
}; 