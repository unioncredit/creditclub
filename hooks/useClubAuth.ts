import { Address, zeroAddress } from "viem";
import { useReadContracts } from "wagmi";

import { DEFAULT_CHAIN_ID } from "@/constants";
import { useClubData } from "@/hooks/useClubData";
import { authAbi } from "@/abis/auth";

export const useClubAuth = (clubAddress: Address) => {
  const { data: clubData, isLoading: clubDataLoading } = useClubData(clubAddress);
  const { authAddress } = clubData || {};

  const authContract = {
    address: authAddress,
    abi: authAbi,
  };

  const contracts = [
    {
      ...authContract,
      functionName: "creditManager",
    },
    {
      ...authContract,
      functionName: "manager",
    },
    {
      ...authContract,
      functionName: "feeManager",
    },
  ];

  const result = useReadContracts({
    contracts: contracts.map(c => ({
      ...c,
      chainId: DEFAULT_CHAIN_ID,
    })),
    query: {
      enabled: !!clubAddress && !!authAddress && authAddress !== zeroAddress,
      staleTime: Infinity,
    }
  });

  // If club data is still loading, return loading state
  if (clubDataLoading) {
    return {
      ...result,
      isLoading: true,
      data: {
        authAddress: zeroAddress,
        creditManagerAddress: zeroAddress,
        managerAddress: zeroAddress,
        feeManagerAddress: zeroAddress,
      }
    };
  }

  // If no auth contract exists, return immediately with zero addresses
  if (!authAddress || authAddress === zeroAddress) {
    return {
      ...result,
      isLoading: false,
      data: {
        authAddress: authAddress,
        creditManagerAddress: zeroAddress,
        managerAddress: zeroAddress,
        feeManagerAddress: zeroAddress,
      }
    };
  }

  const [
    creditManagerAddress = zeroAddress,
    managerAddress = zeroAddress,
    feeManagerAddress = zeroAddress,
  ] = result.data?.map(d => d.result as never) || [];

  const data = {
    authAddress: authAddress,
    creditManagerAddress,
    managerAddress,
    feeManagerAddress,
  };

  return { ...result, data };
}; 