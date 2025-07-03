import { Address, zeroAddress } from "viem";
import { useReadContracts } from "wagmi";

import { DEFAULT_CHAIN_ID } from "@/constants";
import { useClubData } from "@/hooks/useClubData";

// Auth contract ABI - uses AccessControl pattern with roles
const authAbi = [
  {
    "inputs": [],
    "name": "CREDIT_MANAGER_ROLE",
    "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MANAGER_ROLE", 
    "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "FEE_MANAGER_ROLE",
    "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "role", "type": "bytes32" },
      { "internalType": "uint256", "name": "index", "type": "uint256" }
    ],
    "name": "getRoleMember",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "role", "type": "bytes32" }
    ],
    "name": "getRoleMemberCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const useClubAuth = (clubAddress: Address) => {
  const { data: clubData, isLoading: clubDataLoading } = useClubData(clubAddress);
  const ownerAddress: Address = clubData?.ownerAddress ?? "0x0";

  const authContract = {
    address: ownerAddress,
    abi: authAbi,
  };

  // First, get the role hashes
  const roleContracts = [
    {
      ...authContract,
      functionName: "CREDIT_MANAGER_ROLE",
    },
    {
      ...authContract,
      functionName: "MANAGER_ROLE",
    },
    {
      ...authContract,
      functionName: "FEE_MANAGER_ROLE",
    },
  ];

  const roleResult = useReadContracts({
    contracts: roleContracts.map(c => ({
      ...c,
      chainId: DEFAULT_CHAIN_ID,
    })),
    query: {
      enabled: !!clubAddress && !!ownerAddress && ownerAddress !== zeroAddress,
      staleTime: Infinity,
    }
  });

  // Extract role hashes and member data with proper destructuring

  // Extract role hashes with proper destructuring
  const [
    creditManagerRoleResult,
    managerRoleResult,
    feeManagerRoleResult,
  ] = roleResult.data || [];

  const creditManagerRoleHash = (creditManagerRoleResult?.result as string) ?? "" as `0x${string}`;
  const managerRoleHash = (managerRoleResult?.result as string) ?? "" as `0x${string}`;
  const feeManagerRoleHash = (feeManagerRoleResult?.result as string) ?? "" as `0x${string}`;

  // Check role member counts first
  const countContracts = [
    {
      ...authContract,
      functionName: "getRoleMemberCount",
      args: [creditManagerRoleHash],
    },
    {
      ...authContract,
      functionName: "getRoleMemberCount", 
      args: [managerRoleHash],
    },
    {
      ...authContract,
      functionName: "getRoleMemberCount",
      args: [feeManagerRoleHash],
    },
  ];

  const countResult = useReadContracts({
    contracts: countContracts.map(c => ({
      ...c,
      chainId: DEFAULT_CHAIN_ID,
    })),
    query: {
      enabled: !!creditManagerRoleHash && !!managerRoleHash && !!feeManagerRoleHash,
      staleTime: Infinity,
    }
  });

  // Extract role member counts with proper destructuring
  const [
    creditManagerCountResult,
    managerCountResult,
    feeManagerCountResult,
  ] = countResult.data || [];

  const creditManagerCount: bigint = (creditManagerCountResult?.result as unknown as bigint) ?? 0n;
  const managerCount: bigint = (managerCountResult?.result as unknown as bigint) ?? 0n;
  const feeManagerCount: bigint = (feeManagerCountResult?.result as unknown as bigint) ?? 0n;

  // Only get role members if there are any members assigned
  const memberContracts = [];
  if (creditManagerCount > BigInt(0)) {
    memberContracts.push({
      ...authContract,
      functionName: "getRoleMember",
      args: [creditManagerRoleHash, 0],
    });
  }
  if (managerCount > BigInt(0)) {
    memberContracts.push({
      ...authContract,
      functionName: "getRoleMember", 
      args: [managerRoleHash, 0],
    });
  }
  if (feeManagerCount > BigInt(0)) {
    memberContracts.push({
      ...authContract,
      functionName: "getRoleMember",
      args: [feeManagerRoleHash, 0],
    });
  }

  const memberResult = useReadContracts({
    contracts: memberContracts.map(c => ({
      ...c,
      chainId: DEFAULT_CHAIN_ID,
    })),
    query: {
      enabled: memberContracts.length > 0,
      staleTime: Infinity,
    }
  });

  // If club data is still loading, return loading state
  if (clubDataLoading) {
    return {
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
      isLoading: false,
      data: {
        authAddress: ownerAddress,
        creditManagerAddress: zeroAddress,
        managerAddress: zeroAddress,
        feeManagerAddress: zeroAddress,
      }
    };
  }

  // If still loading role data, return loading state
  if (roleResult.isLoading || countResult.isLoading || memberResult.isLoading) {
    return {
      isLoading: true,
      data: {
        authAddress: ownerAddress,
        creditManagerAddress: zeroAddress,
        managerAddress: zeroAddress,
        feeManagerAddress: zeroAddress,
      }
    };
  }

  // Parse member addresses based on which roles have members
  let creditManagerAddress: Address = zeroAddress;
  let managerAddress: Address = zeroAddress;
  let feeManagerAddress: Address = zeroAddress;

  // Extract member addresses with proper destructuring
  const memberData = memberResult.data || [];
  let memberIndex = 0;
  
  if (creditManagerCount > BigInt(0) && memberData[memberIndex]) {
    const result = (memberData[memberIndex]?.result as string) ?? "";
    if (result && result.startsWith('0x')) {
      creditManagerAddress = result as Address;
    }
    memberIndex++;
  }
  
  if (managerCount > BigInt(0) && memberData[memberIndex]) {
    const result = (memberData[memberIndex]?.result as string) ?? "";
    if (result && result.startsWith('0x')) {
      managerAddress = result as Address;
    }
    memberIndex++;
  }
  
  if (feeManagerCount > BigInt(0) && memberData[memberIndex]) {
    const result = (memberData[memberIndex]?.result as string) ?? "";
    if (result && result.startsWith('0x')) {
      feeManagerAddress = result as Address;
    }
  }

  const data = {
    authAddress: ownerAddress,
    creditManagerAddress,
    managerAddress,
    feeManagerAddress,
  };

  return { 
    isLoading: roleResult.isLoading || countResult.isLoading || memberResult.isLoading,
    data 
  };
}; 