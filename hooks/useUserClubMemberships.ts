import { Address, zeroAddress } from "viem";
import { useAccount, useReadContracts } from "wagmi";

import { DEFAULT_CHAIN_ID } from "@/constants";

// List of known club addresses - you can expand this list or fetch from a registry
const KNOWN_CLUB_ADDRESSES: Address[] = [
  // Add your known club addresses here
  // "0x..." as Address,
];

export interface UserClubMembership {
  clubAddress: Address;
  memberNftAddress: Address;
  isMember: boolean;
  memberNftBalance: bigint;
}

export const useUserClubMemberships = (clubAddresses?: Address[]) => {
  const { address = zeroAddress } = useAccount();
  
  // Use provided club addresses or fall back to known addresses
  const clubsToCheck = clubAddresses || KNOWN_CLUB_ADDRESSES;

  // First, get all the club data to extract memberNftAddresses
  const clubDataContracts = clubsToCheck.map(clubAddress => ({
    address: clubAddress,
    abi: [], // We'll need the credit vault ABI here
    functionName: "nft", // This gets the memberNftAddress
  }));

  const clubDataResult = useReadContracts({
    contracts: clubDataContracts.map(c => ({
      ...c,
      chainId: DEFAULT_CHAIN_ID,
    })),
    query: {
      enabled: clubsToCheck.length > 0 && address !== zeroAddress,
    }
  });

  const memberNftAddresses = clubDataResult.data?.map(d => d.result as Address) || [];

  // Now check membership NFT balances for each club
  const membershipContracts = memberNftAddresses.map((memberNftAddress, index) => ({
    abi: [
      {
        "type": "function",
        "name": "balanceOf",
        "inputs": [{"name": "owner", "type": "address"}],
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view"
      }
    ],
    address: memberNftAddress,
    functionName: "balanceOf",
    args: [address],
  }));

  const membershipResult = useReadContracts({
    contracts: membershipContracts.map(c => ({
      ...c,
      chainId: DEFAULT_CHAIN_ID,
    })),
    query: {
      enabled: memberNftAddresses.length > 0 && address !== zeroAddress,
    }
  });

  const membershipBalances = membershipResult.data?.map(d => d.result as bigint) || [];

  // Combine the data
  const memberships: UserClubMembership[] = clubsToCheck.map((clubAddress, index) => ({
    clubAddress,
    memberNftAddress: memberNftAddresses[index] || zeroAddress,
    isMember: (membershipBalances[index] || 0n) > 0n,
    memberNftBalance: membershipBalances[index] || 0n,
  }));

  // Filter to only clubs where user is a member
  const userClubs = memberships.filter(membership => membership.isMember);

  const data = {
    allMemberships: memberships,
    userClubs,
    clubAddresses: userClubs.map(club => club.clubAddress),
    hasAnyMembership: userClubs.length > 0,
  };

  return {
    ...membershipResult,
    data,
    isLoading: clubDataResult.isLoading || membershipResult.isLoading,
  };
}; 