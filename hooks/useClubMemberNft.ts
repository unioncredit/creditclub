import { Address } from "viem";
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
  ];

  const result = useReadContracts({
    // @ts-ignore
    contracts: contracts.map(c => ({
      ...c,
      chainId: DEFAULT_CHAIN_ID,
    })),
    query: {
      enabled: !!clubAddress,
    }
  });

  const [
    contractURI = "",
  ] = result.data?.map(d => d.result as never) || [];

  const contractMetadata = JSON.parse(decodeURIComponent(contractURI.replace("data:application/json;utf8,", "")) || "{}");

  const {
    name = "",
    description = "",
    image = ""
  } = contractMetadata;

  const data = {
    name,
    description,
    image,
  };

  return { ...result, data };
};