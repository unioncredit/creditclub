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
  const { ownerAddress } = clubData || {};

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

  // Get the role hashes
  const [
    creditManagerRoleHash,
    managerRoleHash,
    feeManagerRoleHash,
  ] = roleResult.data?.map(d => d.result as `0x${string}`) || [];

  // First check if roles have any members
  const roleCountContracts = [
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

  const roleCountResult = useReadContracts({
    contracts: roleCountContracts.map(c => ({
      ...c,
      chainId: DEFAULT_CHAIN_ID,
    })),
    query: {
      enabled: !!creditManagerRoleHash && !!managerRoleHash && !!feeManagerRoleHash,
      staleTime: Infinity,
    }
  });

  const [
    creditManagerCount = BigInt(0),
    managerCount = BigInt(0),
    feeManagerCount = BigInt(0),
  ] = roleCountResult.data?.map(d => {
    const result = d.result;
    return typeof result === 'bigint' ? result : BigInt(0);
  }) || [];

  // Then get the first member of each role (only if they have members)
  const memberContracts = [
    ...(creditManagerCount > BigInt(0) ? [{
      ...authContract,
      functionName: "getRoleMember",
      args: [creditManagerRoleHash, 0],
    }] : []),
    ...(managerCount > BigInt(0) ? [{
      ...authContract,
      functionName: "getRoleMember", 
      args: [managerRoleHash, 0],
    }] : []),
    ...(feeManagerCount > BigInt(0) ? [{
      ...authContract,
      functionName: "getRoleMember",
      args: [feeManagerRoleHash, 0],
    }] : []),
  ];

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

  // Debug logging
  console.log('🔍 useClubAuth Debug (AccessControl):', {
    clubAddress,
    ownerAddress: ownerAddress,
    authAddress: ownerAddress, // Owner IS the auth contract
    clubDataLoading,
    roleHashes: {
      creditManagerRoleHash,
      managerRoleHash,
      feeManagerRoleHash,
    },
    roleCounts: {
      creditManagerCount: Number(creditManagerCount),
      managerCount: Number(managerCount),
      feeManagerCount: Number(feeManagerCount),
    },
    roleResult: {
      status: roleResult.status,
      data: roleResult.data,
    },
    roleCountResult: {
      status: roleCountResult.status,
      data: roleCountResult.data,
    },
    memberResult: {
      status: memberResult.status,
      data: memberResult.data,
    },
    memberContractsLength: memberContracts.length,
  });

  // If club data is still loading, return loading state
  if (clubDataLoading) {
    console.log('📊 Club data still loading...');
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
    console.log('⚠️ No owner address found:', ownerAddress);
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

  // If still loading role members, return loading state
  if (roleResult.isLoading || memberResult.isLoading) {
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

  const [
    creditManagerAddress = zeroAddress,
    managerAddress = zeroAddress,
    feeManagerAddress = zeroAddress,
  ] = memberResult.data?.map(d => d.result as Address) || [];

  console.log('📋 Parsed management addresses (from AccessControl):', {
    creditManagerAddress,
    managerAddress,
    feeManagerAddress,
  });

  const data = {
    authAddress: ownerAddress,
    creditManagerAddress,
    managerAddress,
    feeManagerAddress,
  };

  console.log('✅ Final useClubAuth data:', data);

  return { 
    isLoading: roleResult.isLoading || memberResult.isLoading,
    data 
  };
}; 