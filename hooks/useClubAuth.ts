import { Address, zeroAddress } from "viem";
import { useReadContracts } from "wagmi";

import { DEFAULT_CHAIN_ID } from "@/constants";
import { useClubData } from "@/hooks/useClubData";

// Auth contract ABI for the specific functions we need
const authAbi = [
  {
    "inputs": [],
    "name": "creditManager",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "manager",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "feeManager",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const useClubAuth = (clubAddress: Address) => {
  const { data: clubData, isLoading: clubDataLoading } = useClubData(clubAddress);
  const { ownerAddress } = clubData || {};

  const authContract = {
    address: ownerAddress,
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
      enabled: !!clubAddress && !!ownerAddress && ownerAddress !== zeroAddress,
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
  if (!ownerAddress || ownerAddress === zeroAddress) {
    return {
      ...result,
      isLoading: false,
      data: {
        authAddress: ownerAddress,
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
    authAddress: ownerAddress,
    creditManagerAddress,
    managerAddress,
    feeManagerAddress,
  };

  return { ...result, data };
}; 