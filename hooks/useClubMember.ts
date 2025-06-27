import { Address, erc20Abi, zeroAddress } from "viem";
import { useReadContracts } from "wagmi";

import { DEFAULT_CHAIN_ID } from "@/constants";
import { useCreditVaultContract } from "@/hooks/useCreditVaultContract";
import { useMemberNftContract } from "@/hooks/useMemberNftContract";
import { useClubData } from "@/hooks/useClubData";
import { useContract } from "@/hooks/useContract";
import { useStakingContract } from "@/hooks/useStakingContract";

export const useClubMember = (memberAddress: Address | undefined, clubAddress: Address) => {
  const { data: clubData } = useClubData(clubAddress);

  const {
    memberNftAddress,
    assetAddress,
    stakingAddress,
  } = clubData;

  const userManagerContract = useContract("userManager");
  const memberNftContract = useMemberNftContract(memberNftAddress);
  const creditVaultContract = useCreditVaultContract(clubAddress);
  const stakingContract = useStakingContract(stakingAddress);

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
      ...stakingContract,
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
      functionName: "getMemberId",
      args: [memberAddress],
    },
    {
      ...creditVaultContract,
      functionName: "previewCreditClaim",
      args: [memberAddress],
    },
    {
      ...memberNftContract,
      functionName: "_invited",
      args: [memberAddress],
    },
    {
      ...memberNftContract,
      functionName: "getInvites",
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
    stakedBalance = 0n,
    assetBalance = 0n,
    owed = 0n,
    vouch = 0n,
    tokenId = 0n,
    previewCreditClaim = 0n,
    invitedByAddress = zeroAddress,
    inviteCount = 0n,
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
        functionName: "getMember",
        args: [tokenId],
      }
    ].map(c => ({
      ...c,
      chainId: DEFAULT_CHAIN_ID,
    })),
    query: {
      enabled: tokenId !== undefined && tokenId > 0n,
      staleTime: Infinity,
    }
  });

  const [
    percentVested = 0n,
    nftCreditStatus = undefined,
    // @ts-ignore
  ] = resultTwo.data?.map(d => d.result as never) || [];

  const data = {
    isMember: memberNftBalance > 0n,
    clubTokenBalance,
    assetBalance,
    stakedBalance,
    owed,
    vouch,
    tokenId,
    previewCreditClaim,
    percentVested,
    baseTrust: nftCreditStatus?.[1] || 0n,
    badDebt: nftCreditStatus?.[2] || 0n,
    active: nftCreditStatus?.[4] || false,
    isInvited: invitedByAddress !== zeroAddress,
    invitedByAddress,
    inviteCount,
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