import { Address, zeroAddress } from "viem";
import { useReadContract } from "wagmi";

import { DEFAULT_CHAIN_ID } from "@/constants";
import { useClubData } from "@/hooks/useClubData";
import { useMemberNftContract } from "@/hooks/useMemberNftContract";

export const useClubMemberNft = (clubAddress: Address) => {
  const { data: clubData } = useClubData(clubAddress);
  const { memberNftAddress } = clubData;

  const memberNftContract = useMemberNftContract(memberNftAddress);

  const contractURIQuery = useReadContract({
    ...memberNftContract,
    functionName: "contractURI",
    chainId: DEFAULT_CHAIN_ID,
    query: {
      enabled: !!clubAddress,
      staleTime: Infinity,
    }
  });

  const membershipCostQuery = useReadContract({
    ...memberNftContract,
    functionName: "membershipCost",
    chainId: DEFAULT_CHAIN_ID,
    query: {
      enabled: !!clubAddress,
      staleTime: Infinity,
    }
  });

  const gatingTokenQuery = useReadContract({
    ...memberNftContract,
    functionName: "gatingToken",
    chainId: DEFAULT_CHAIN_ID,
    query: {
      enabled: !!clubAddress,
      staleTime: Infinity,
    }
  });

  const maxMembersQuery = useReadContract({
    ...memberNftContract,
    functionName: "maxMembers",
    chainId: DEFAULT_CHAIN_ID,
    query: {
      enabled: !!clubAddress,
      staleTime: Infinity,
    }
  });

  const isInviteEnabledQuery = useReadContract({
    ...memberNftContract,
    functionName: "isInviteEnabled",
    chainId: DEFAULT_CHAIN_ID,
    query: {
      enabled: !!clubAddress,
      staleTime: Infinity,
    }
  });

  const minMembersQuery = useReadContract({
    ...memberNftContract,
    functionName: "minMembers",
    chainId: DEFAULT_CHAIN_ID,
    query: {
      enabled: !!clubAddress,
      staleTime: Infinity,
    }
  });

  const gatingTokenAmountQuery = useReadContract({
    ...memberNftContract,
    functionName: "gatingTokenAmount",
    chainId: DEFAULT_CHAIN_ID,
    query: {
      enabled: !!clubAddress,
      staleTime: Infinity,
    }
  });

  const isSoulBoundQuery = useReadContract({
    ...memberNftContract,
    functionName: "isSoulBound",
    chainId: DEFAULT_CHAIN_ID,
    query: {
      enabled: !!clubAddress,
      staleTime: Infinity,
    }
  });

  const inviteCostQuery = useReadContract({
    ...memberNftContract,
    functionName: "inviteCost",
    chainId: DEFAULT_CHAIN_ID,
    query: {
      enabled: !!clubAddress,
      staleTime: Infinity,
    }
  });
  
  const contractURI = contractURIQuery.data || "";
  const membershipCost = membershipCostQuery.data || 0n;
  const gatingTokenAddress = gatingTokenQuery.data || zeroAddress;
  const maxMembers = maxMembersQuery.data || 0n;
  const isInviteEnabled = isInviteEnabledQuery.data || false;
  const minMembers = minMembersQuery.data || 0n;
  const gatingTokenAmount = gatingTokenAmountQuery.data || 0n;
  const isSoulBound = isSoulBoundQuery.data || false;
  const inviteCost = inviteCostQuery.data || 0n;

  let contractMetadata: {
    name?: string;
    description?: string;
    image?: string;
  } = {};
  
  try {
    if (contractURI && typeof contractURI === 'string') {
      const cleanedURI = contractURI.replace("data:application/json;utf8,", "");
      const decodedURI = decodeURIComponent(cleanedURI);
      contractMetadata = JSON.parse(decodedURI || "{}");
    }
  } catch (error) {
    console.error("Failed to parse contract metadata:", error);
    console.log("Raw contractURI:", contractURI);
    contractMetadata = {};
  }

  const {
    name = "",
    description = "",
    image = ""
  } = contractMetadata;

  const data = {
    name,
    description,
    image,
    membershipCost,
    gatingTokenAddress,
    maxMembers,
    isInviteEnabled,
    minMembers,
    gatingTokenAmount,
    isSoulBound,
    inviteCost,
  };

  const isLoading = contractURIQuery.isLoading || 
    membershipCostQuery.isLoading || 
    gatingTokenQuery.isLoading || 
    maxMembersQuery.isLoading || 
    isInviteEnabledQuery.isLoading || 
    minMembersQuery.isLoading || 
    gatingTokenAmountQuery.isLoading || 
    isSoulBoundQuery.isLoading || 
    inviteCostQuery.isLoading;

  const isRefetching = contractURIQuery.isRefetching || 
    membershipCostQuery.isRefetching || 
    gatingTokenQuery.isRefetching || 
    maxMembersQuery.isRefetching || 
    isInviteEnabledQuery.isRefetching || 
    minMembersQuery.isRefetching || 
    gatingTokenAmountQuery.isRefetching || 
    isSoulBoundQuery.isRefetching || 
    inviteCostQuery.isRefetching;

  const refetch = async () => {
    await Promise.all([
      contractURIQuery.refetch(),
      membershipCostQuery.refetch(),
      gatingTokenQuery.refetch(),
      maxMembersQuery.refetch(),
      isInviteEnabledQuery.refetch(),
      minMembersQuery.refetch(),
      gatingTokenAmountQuery.refetch(),
      isSoulBoundQuery.refetch(),
      inviteCostQuery.refetch(),
    ]);
  };

  return { 
    data, 
    isLoading,
    isRefetching,
    refetch,
  };
};