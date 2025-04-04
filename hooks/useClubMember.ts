import { Address, erc20Abi } from "viem";
import { useReadContracts } from "wagmi";

import { DEFAULT_CHAIN_ID } from "@/constants";
import { useCreditVaultContract } from "@/hooks/useCreditVaultContract";
import { useMemberNftContract } from "@/hooks/useMemberNftContract";
import { useClubData } from "@/hooks/useClubData";
import { useContract } from "@/hooks/useContract";

export const useClubMember = (memberAddress: Address | undefined, clubAddress: Address) => {
  const { data: clubData } = useClubData(clubAddress);

  const {
    memberNftAddress,
    assetAddress,
  } = clubData;

  const userManagerContract = useContract("userManager");
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
    },
    {
      ...userManagerContract,
      functionName: "getLockedStake",
      args: [clubAddress, memberAddress],
    },
    {
      ...userManagerContract,
      functionName: "getVouchingAmount",
      args: [clubAddress, memberAddress],
    },
    {
      ...memberNftContract,
      functionName: "tokenOfOwnerByIndex",
      args: [memberAddress, 0n],
    },
    {
      ...creditVaultContract,
      functionName: "previewCreditClaim",
      args: [memberAddress],
    }
  ];

  const resultOne = useReadContracts({
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
    owed = 0n,
    vouch = 0n,
    tokenId = 0n,
    previewCreditClaim = 0n,
  ] = resultOne.data?.map(d => d.result as never) || [];

  const resultTwo = useReadContracts({
    // @ts-ignore
    contracts: [
      {
        ...creditVaultContract,
        functionName: "percentVested",
        args: [tokenId],
      },
      {
        ...memberNftContract,
        functionName: "nftCreditStatus",
        args: [tokenId],
      }
    ].map(c => ({
      ...c,
      chainId: DEFAULT_CHAIN_ID,
    })),
    query: {
      enabled: tokenId !== undefined,
    }
  });

  const [
    percentVested = 0n,
    nftCreditStatus = undefined,
  ] = resultTwo.data?.map(d => d.result as never) || [];

  const data = {
    isMember: memberNftBalance > 0n,
    clubTokenBalance,
    assetBalance,
    owed,
    vouch,
    tokenId,
    previewCreditClaim,
    percentVested,
    baseTrust: nftCreditStatus?.[0] || 0n,
    active: nftCreditStatus?.[1] || false,
    badDebt: nftCreditStatus?.[2] || 0n,
    tier: nftCreditStatus?.[3] || 0,
    inviteCount: nftCreditStatus?.[4] || 0,
  };

  const {
    refetch: refetchOne,
    isLoading: isLoadingOne,
    isRefetching: isRefetchingOne,
  } = resultOne;

  const {
    refetch: refetchTwo,
    isLoading: isLoadingTwo,
    isRefetching: isRefetchingTwo,
  } = resultTwo;

  const refetch = async () => {
    await refetchOne();
    await refetchTwo();
  };

  return {
    ...resultTwo,
    isLoading: isLoadingOne || isLoadingTwo || isRefetchingOne || isRefetchingTwo,
    refetch,
    data,
  };
};