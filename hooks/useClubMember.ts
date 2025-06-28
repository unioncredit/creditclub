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
  locking: bigint;
  membershipStart: bigint;
  totalVested: bigint;
  claimableCredit: bigint;
  tokenAddress: Address;
  canRepay: boolean;
  canBorrow: boolean;
  shares: bigint;
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

  // Extract values with proper type handling
  const safeBigInt = (value: any): bigint => {
    if (typeof value === 'bigint') return value;
    if (typeof value === 'number') return BigInt(value);
    if (typeof value === 'string') return BigInt(value);
    return 0n;
  };

  const clubTokenBalance = safeBigInt(clubTokenBalanceQuery.data);
  const memberNftBalance = safeBigInt(memberNftBalanceQuery.data);
  const stakedBalance = safeBigInt(stakedBalanceQuery.data);
  const assetBalance = safeBigInt(assetBalanceQuery.data);
  const owed = safeBigInt(lockedStakeQuery.data);
  const vouch = safeBigInt(vouchingAmountQuery.data);
  const tokenId = safeBigInt(memberIdQuery.data);
  const invitedByAddress = (invitedByQuery.data as Address) || zeroAddress;
  const inviteCount = safeBigInt(inviteCountQuery.data);

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
  const baseTrust = safeBigInt(memberDetails?.baseTrust);
  const badDebt = safeBigInt(memberDetails?.badDebt);
  const updatedAt = safeBigInt(memberDetails?.updatedAt);
  const active = memberDetails?.isActive || false;
  const tier = memberDetails?.tier || 0;
  const tierPercentage = safeBigInt(memberDetails?.tierPercentage);
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

  const percentVested = safeBigInt(percentVestedQuery.data);

  // Calculate values based on available data
  const WAD = 10n ** 18n;
  const startingAmount = baseTrust > 0n && clubData?.startingPercentTrust > 0n
    ? (baseTrust * clubData.startingPercentTrust) / WAD 
    : 0n;
  
  const additionalVested = baseTrust > startingAmount && percentVested > 0n
    ? ((baseTrust - startingAmount) * percentVested) / WAD 
    : 0n;
  
  const totalVested = startingAmount + additionalVested;
  const claimableCredit = totalVested > vouch ? totalVested - vouch : 0n;

  const canRepay = owed > 0n;
  const canBorrow = vouch > owed;
  const shares = 0n;  // Default value

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
    locking: 0n,  // Default values for properties not in memberDetails
    membershipStart: updatedAt,  // Use updatedAt as a proxy for membership start
    totalVested,
    claimableCredit,
    tokenAddress: assetAddress,
    canRepay,
    canBorrow,
    shares,
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
    data,
    isLoading,
    refetch,
  };
};