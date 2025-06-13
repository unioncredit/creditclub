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
  const { data: clubData } = useClubData(clubAddress);
  const { authAddress } = clubData;

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
      enabled: !!clubAddress && authAddress !== zeroAddress,
      staleTime: Infinity,
    }
  });

  const [
    creditManagerAddress = zeroAddress,
    managerAddress = zeroAddress,
    feeManagerAddress = zeroAddress,
  ] = result.data?.map(d => d.result as never) || [];

  const data = {
    authAddress,
    creditManagerAddress,
    managerAddress,
    feeManagerAddress,
  };

  return { ...result, data };
}; 