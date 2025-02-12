import { Address, erc20Abi } from "viem";
import { useReadContracts } from "wagmi";

import { DEFAULT_CHAIN_ID } from "@/constants";
import { useCreditVaultContract } from "@/hooks/useCreditVaultContract";
import { useMemberNftContract } from "@/hooks/useMemberNftContract";
import { useClubData } from "@/hooks/useClubData";

export const useClubMember = (memberAddress: Address | undefined, clubAddress: Address) => {
  const { data: clubData } = useClubData(clubAddress);

  const {
    memberNftAddress,
    assetAddress,
  } = clubData;

  const memberNftContract = useMemberNftContract(memberNftAddress);
  const creditVaultContract = useCreditVaultContract(clubAddress);

  const contracts = [
    {
      ...creditVaultContract,
      functionName: "balanceOf",
      args: [memberAddress],
    },
    {
      ...memberNftContract,
      functionName: "balanceOf",
      args: [memberAddress],
    },
    {
      abi: erc20Abi,
      address: assetAddress,
      functionName: "balanceOf",
      args: [memberAddress],
    }
  ];

  const result = useReadContracts({
    // @ts-ignore
    contracts: contracts.map(c => ({
      ...c,
      chainId: DEFAULT_CHAIN_ID,
    })),
    query: {
      enabled: !!clubAddress && !!memberAddress,
    }
  });

  const [
    clubTokenBalance = 0n,
    memberNftBalance = 0n,
    assetBalance = 0n,
  ] = result.data?.map(d => d.result as never) || [];

  const data = {
    isMember: memberNftBalance > 0n,
    clubTokenBalance,
    assetBalance,
  };

  return { ...result, data };
};