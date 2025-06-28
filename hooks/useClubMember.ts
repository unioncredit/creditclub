import { Address, erc20Abi, zeroAddress } from "viem";
import { useReadContract } from "wagmi";

import { DEFAULT_CHAIN_ID } from "@/constants";
import { useCreditVaultContract } from "@/hooks/useCreditVaultContract";
import { useMemberNftContract } from "@/hooks/useMemberNftContract";
import { useClubData } from "@/hooks/useClubData";
import { useContract } from "@/hooks/useContract";
import { useStakingContract } from "@/hooks/useStakingContract";

interface ClubMemberData {
  isMember: boolean;
  clubTokenBalance: bigint;
  assetBalance: bigint;
  stakedBalance: bigint;
  owed: bigint;
  vouch: bigint;
  tokenId: bigint;
  percentVested: bigint;
  baseTrust: bigint;
  badDebt: bigint;
  active: boolean;
  isInvited: boolean;
  invitedByAddress: Address;
  inviteCount: bigint;
  memberNftBalance: bigint;
  referrer: Address;
  updatedAt: bigint;
  tier: number;
  tierPercentage: bigint;
  tierLabel: string;
}

interface UseClubMemberReturn {
  isLoading: boolean;
  refetch: () => Promise<void>;
  data: ClubMemberData;
}

export const useClubMember = (memberAddress: Address | undefined, clubAddress: Address): UseClubMemberReturn => {
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

  // Individual contract queries
  const clubTokenBalanceQuery = useReadContract({
    ...creditVaultContract,
    functionName: "balanceOf",
    args: [memberAddress!],
    chainId: DEFAULT_CHAIN_ID,
    query: {
      enabled: !!clubAddress && !!memberAddress,
    }
  });

  const memberNftBalanceQuery = useReadContract({
    ...memberNftContract,
    functionName: "balanceOf",
    args: [memberAddress!],
    chainId: DEFAULT_CHAIN_ID,
    query: {
      enabled: !!clubAddress && !!memberAddress,
    }
  });

  const stakedBalanceQuery = useReadContract({
    ...stakingContract,
    functionName: "balanceOf",
    args: [memberAddress!],
    chainId: DEFAULT_CHAIN_ID,
    query: {
      enabled: !!clubAddress && !!memberAddress,
    }
  });

  const assetBalanceQuery = useReadContract({
    abi: erc20Abi,
    address: assetAddress,
    functionName: "balanceOf",
    args: [memberAddress!],
    chainId: DEFAULT_CHAIN_ID,
    query: {
      enabled: !!clubAddress && !!memberAddress && !!assetAddress,
    }
  });

  const lockedStakeQuery = useReadContract({
    ...userManagerContract,
    functionName: "getLockedStake",
    args: [clubAddress, memberAddress!],
    chainId: DEFAULT_CHAIN_ID,
    query: {
      enabled: !!clubAddress && !!memberAddress,
    }
  });

  const vouchingAmountQuery = useReadContract({
    ...userManagerContract,
    functionName: "getVouchingAmount",
    args: [clubAddress, memberAddress!],
    chainId: DEFAULT_CHAIN_ID,
    query: {
      enabled: !!clubAddress && !!memberAddress,
    }
  });

  const memberIdQuery = useReadContract({
    ...memberNftContract,
    functionName: "getMemberId",
    args: [memberAddress!],
    chainId: DEFAULT_CHAIN_ID,
    query: {
      enabled: !!clubAddress && !!memberAddress,
    }
  });

  const invitedByQuery = useReadContract({
    ...memberNftContract,
    functionName: "_invited",
    args: [memberAddress!],
    chainId: DEFAULT_CHAIN_ID,
    query: {
      enabled: !!clubAddress && !!memberAddress,
    }
  });

  const inviteCountQuery = useReadContract({
    ...memberNftContract,
    functionName: "getInvites",
    args: [memberAddress!],
    chainId: DEFAULT_CHAIN_ID,
    query: {
      enabled: !!clubAddress && !!memberAddress,
    }
  });

  // Extract values
  const clubTokenBalance = clubTokenBalanceQuery.data || 0n;
  const memberNftBalance = memberNftBalanceQuery.data || 0n;
  const stakedBalance = stakedBalanceQuery.data || 0n;
  const assetBalance = assetBalanceQuery.data || 0n;
  const owed = lockedStakeQuery.data || 0n;
  const vouch = vouchingAmountQuery.data || 0n;
  const tokenId = memberIdQuery.data || 0n;
  const invitedByAddress = invitedByQuery.data || zeroAddress;
  const inviteCount = inviteCountQuery.data || 0n;

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
  const percentVestedQuery = useReadContract({
    ...creditVaultContract,
    functionName: "_percentVested",
    args: [updatedAt],
    chainId: DEFAULT_CHAIN_ID,
    query: {
      enabled: updatedAt > 0n && !!creditVaultContract.address,
      staleTime: Infinity,
    }
  });

  const percentVested = percentVestedQuery.data || 0n;

  // Debug the getMember response
  console.log("useClubMember debug:", {
    tokenId: tokenId?.toString(),
    memberDetails,
    baseTrust: baseTrust?.toString(),
    updatedAt: updatedAt?.toString(),
    active,
    percentVested: percentVested?.toString(),
  });

  const data: ClubMemberData = {
    isMember: memberNftBalance > 0n,
    clubTokenBalance,
    assetBalance,
    stakedBalance,
    owed,
    vouch,
    tokenId,
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

  // Check loading states
  const queries = [
    clubTokenBalanceQuery,
    memberNftBalanceQuery,
    stakedBalanceQuery,
    assetBalanceQuery,
    lockedStakeQuery,
    vouchingAmountQuery,
    memberIdQuery,
    invitedByQuery,
    inviteCountQuery,
    memberDataQuery,
    percentVestedQuery,
  ];

  const isLoading = queries.some(q => q.isLoading || q.isRefetching);
  
  const refetch = async () => {
    await Promise.all(queries.map(q => q.refetch()));
  };

  return {
    isLoading,
    refetch,
    data,
  };
};