import { Address, zeroAddress } from "viem";
import { useReadContracts } from "wagmi";

import { DEFAULT_CHAIN_ID } from "@/constants";
import { useClubData } from "@/hooks/useClubData";
import { useMemberNftContract } from "@/hooks/useMemberNftContract";

export const useClubMemberNft = (clubAddress: Address) => {
  const { data: clubData, isLoading: clubDataLoading } = useClubData(clubAddress);
  const { memberNftAddress } = clubData;

  const memberNftContract = useMemberNftContract(memberNftAddress);

  // Batch all member NFT queries together
  const memberNftContracts = [
    {
      ...memberNftContract,
      functionName: "contractURI",
    },
    {
      ...memberNftContract,
      functionName: "membershipCost",
    },
    {
      ...memberNftContract,
      functionName: "gatingToken",
    },
    {
      ...memberNftContract,
      functionName: "maxMembers",
    },
    {
      ...memberNftContract,
      functionName: "isInviteEnabled",
    },
    {
      ...memberNftContract,
      functionName: "minMembers",
    },
    {
      ...memberNftContract,
      functionName: "gatingTokenAmount",
    },
    {
      ...memberNftContract,
      functionName: "isSoulBound",
    },
    {
      ...memberNftContract,
      functionName: "inviteCost",
    },
  ];

  const result = useReadContracts({
    contracts: memberNftContracts.map(c => ({
      ...c,
      chainId: DEFAULT_CHAIN_ID,
    })) as any,
    query: {
      enabled: !!clubAddress && !clubDataLoading && !!memberNftAddress,
      staleTime: Infinity,
    }
  });

  // Extract values with defaults
  const [
    contractURI = "",
    membershipCost = 0n,
    gatingTokenAddress = zeroAddress,
    maxMembers = 0n,
    isInviteEnabled = false,
    minMembers = 0n,
    gatingTokenAmount = 0n,
    isSoulBound = false,
    inviteCost = 0n,
  ] = result.data?.map(d => d.result as never) || [];

  let contractMetadata: {
    name?: string;
    description?: string;
    image?: string;
  } = {};
  
  try {
    if (contractURI && typeof contractURI === 'string') {
      const cleanedURI = (contractURI as string).replace("data:application/json;utf8,", "");
      const decodedURI = decodeURIComponent(cleanedURI);
      contractMetadata = JSON.parse(decodedURI || "{}");
    }
  } catch (error) {
    console.error("Failed to parse contract metadata:", error);
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
    membershipCost: membershipCost as bigint,
    gatingTokenAddress: gatingTokenAddress as Address,
    maxMembers: maxMembers as bigint,
    isInviteEnabled: isInviteEnabled as boolean,
    minMembers: minMembers as bigint,
    gatingTokenAmount: gatingTokenAmount as bigint,
    isSoulBound: isSoulBound as boolean,
    inviteCost: inviteCost as bigint,
  };

  const isLoading = clubDataLoading || result.isLoading;
  const isRefetching = result.isRefetching;
  const refetch = result.refetch;

  return { 
    data, 
    isLoading,
    isRefetching,
    refetch,
  };
};