import { Address, zeroAddress } from "viem";
import { useReadContracts } from "wagmi";

import { DEFAULT_CHAIN_ID } from "@/constants";
import { useClubData } from "@/hooks/useClubData";
import { useMemberNftContract } from "@/hooks/useMemberNftContract";

export const useClubMemberNft = (clubAddress: Address) => {
  const { data: clubData, isLoading: clubDataLoading } = useClubData(clubAddress);
  const memberNftAddress: Address = clubData?.memberNftAddress ?? zeroAddress;

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

  // Safe boolean conversion to ensure primitive booleans are always returned
  const safeBoolean = (value: any): boolean => {
    if (typeof value === 'boolean') return value;
    if (value === null || value === undefined) return false;
    return Boolean(value);
  };

  // Extract data with proper wagmi result destructuring
  const [
    contractURIResult,
    membershipCostResult,
    gatingTokenAddressResult,
    maxMembersResult,
    isInviteEnabledResult,
    minMembersResult,
    gatingTokenAmountResult,
    isSoulBoundResult,
    inviteCostResult,
  ] = result.data || [];

  const contractURI: string = (contractURIResult?.result as string) ?? "";
  const membershipCost: bigint = (membershipCostResult?.result as bigint) ?? 0n;
  const gatingTokenAddress: Address = (gatingTokenAddressResult?.result as Address) ?? zeroAddress;
  const maxMembers: bigint = (maxMembersResult?.result as bigint) ?? 0n;
  const isInviteEnabled: boolean = safeBoolean(isInviteEnabledResult?.result);
  const minMembers: bigint = (minMembersResult?.result as bigint) ?? 0n;
  const gatingTokenAmount: bigint = (gatingTokenAmountResult?.result as bigint) ?? 0n;
  const isSoulBound: boolean = safeBoolean(isSoulBoundResult?.result);
  const inviteCost: bigint = (inviteCostResult?.result as bigint) ?? 0n;

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

  const name: string = contractMetadata?.name ?? "";
  const description: string = contractMetadata?.description ?? "";
  const image: string = contractMetadata?.image ?? "";

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