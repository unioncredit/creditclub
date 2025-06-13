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

  const resultData = result.data?.map(d => d.result) || [];
  
  const contractURI = (resultData[0] as string) || "";
  const membershipCost = (resultData[1] as bigint) || 0n;
  const gatingTokenAddress = (resultData[2] as Address) || zeroAddress;
  const maxMembers = (resultData[3] as bigint) || 0n;
  const isInviteEnabled = (resultData[4] as boolean) || false;
  const minMembers = (resultData[5] as bigint) || 0n;
  const gatingTokenAmount = (resultData[6] as bigint) || 0n;
  const isSoulBound = (resultData[7] as boolean) || false;
  const inviteCost = (resultData[8] as bigint) || 0n;

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

  // Debug logging - can be removed after testing
  console.warn("useClubMemberNft DEBUG:", {
    clubAddress,
    contractURI,
    contractMetadata,
    name,
    description,
    image,
    resultDataLength: resultData.length,
    rawResults: resultData
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