import { Address, zeroAddress } from "viem";
import { useReadContracts } from "wagmi";

import { DEFAULT_CHAIN_ID } from "@/constants";
import { useClubData } from "@/hooks/useClubData";
import { useMemberNftContract } from "@/hooks/useMemberNftContract";

export const useClubMemberNft = (clubAddress: Address) => {
  const { data: clubData } = useClubData(clubAddress);
  const { memberNftAddress } = clubData;

  const memberNftContract = useMemberNftContract(memberNftAddress);

  const contracts = [
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
      functionName: "gatingToken"
    },
    {
      ...memberNftContract,
      functionName: "maxMembers"
    },
    {
      ...memberNftContract,
      functionName: "isInviteEnabled"
    },
    {
      ...memberNftContract,
      functionName: "minMembers"
    },
    {
      ...memberNftContract,
      functionName: "gatingTokenAmount"
    },
    {
      ...memberNftContract,
      functionName: "isSoulBound"
    },
    {
      ...memberNftContract,
      functionName: "inviteCost"
    },
  ];

  const result = useReadContracts({
    // @ts-ignore
    contracts: contracts.map(c => ({
      ...c,
      chainId: DEFAULT_CHAIN_ID,
    })),
    query: {
      enabled: !!clubAddress,
      staleTime: Infinity,
    }
  });

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
    // @ts-ignore
  ] = result.data?.map(d => d.result as never) || [];

  let contractMetadata = {};
  
  try {
    if (contractURI) {
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

  // Debug logging
  console.log("Contract metadata:", {
    contractURI,
    contractMetadata,
    name,
    description,
    image
  });

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

  return { ...result, data };
};