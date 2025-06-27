import { Address, erc20Abi, zeroAddress } from "viem";
import { useReadContracts, useReadContract } from "wagmi";

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

  // Get member data from getMember function
  const memberDataQuery = useReadContract({
    ...memberNftContract,
    functionName: "getMember",
    args: [tokenId],
    chainId: DEFAULT_CHAIN_ID,
    query: {
      enabled: tokenId > 0n && !!memberNftContract.address,
      staleTime: Infinity,
    }
  });

  // Extract member data from the tuple
  const memberDetails = memberDataQuery.data;
  const referrer = memberDetails?.referrer || zeroAddress;
  const baseTrust = memberDetails?.baseTrust || 0n;
  const badDebt = memberDetails?.badDebt || 0n;
  const updatedAt = memberDetails?.updatedAt || 0n;
  const active = memberDetails?.isActive || false;
  const tier = memberDetails?.tier || 0;
  const tierPercentage = memberDetails?.tierPercentage || 0n;
  const tierLabel = memberDetails?.tierLabel || "";

  // Get percent vested based on updatedAt
  const resultTwo = useReadContracts({
    // @ts-ignore
    contracts: [
      {
        ...creditVaultContract,
        functionName: "_percentVested",
        args: [updatedAt],
      }
    ].map(c => ({
      ...c,
      chainId: DEFAULT_CHAIN_ID,
    })),
    query: {
      enabled: updatedAt > 0n && !!creditVaultContract.address,
      staleTime: Infinity,
    }
  });

  const [
    percentVested = 0n,
    // @ts-ignore
  ] = resultTwo.data?.map(d => d.result as never) || [];

  // Debug the getMember response
  console.log("useClubMember debug:", {
    tokenId: tokenId?.toString(),
    memberDetails,
    baseTrust: baseTrust?.toString(),
    updatedAt: updatedAt?.toString(),
    active,
    percentVested: percentVested?.toString(),
  });

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
    baseTrust,
    badDebt,
    active,
    isInvited: invitedByAddress !== zeroAddress,
    invitedByAddress,
    inviteCount,
    memberNftBalance,
    referrer,
    updatedAt,
    tier,
    tierPercentage,
    tierLabel,
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

  const {
    refetch: refetchMember,
    isLoading: isLoadingMember,
    isRefetching: isRefetchingMember,
  } = memberDataQuery;

  const refetch = async () => {
    await refetchOne();
    await refetchTwo();
    await refetchMember();
  };

  return {
    ...resultTwo,
    isLoading: isLoadingOne || isLoadingTwo || isLoadingMember || isRefetchingOne || isRefetchingTwo || isRefetchingMember,
    refetch,
    data,
  };
};