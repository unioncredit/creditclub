import { Address, erc20Abi, zeroAddress } from "viem";
import { useReadContract, useReadContracts } from "wagmi";

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
  const { data: clubData, isLoading: clubDataLoading } = useClubData(clubAddress);

  const {
    memberNftAddress,
    assetAddress,
    stakingAddress,
    startingPercentTrust,
  } = clubData;

  const userManagerContract = useContract("userManager");
  const memberNftContract = useMemberNftContract(memberNftAddress);
  const creditVaultContract = useCreditVaultContract(clubAddress);
  const stakingContract = useStakingContract(stakingAddress);

  // Batch 1: Balance Information
  const balanceContracts = [
    {
      ...creditVaultContract,
      functionName: "balanceOf",
      args: [memberAddress!],
    },
    {
      ...memberNftContract,
      functionName: "balanceOf",
      args: [memberAddress!],
    },
    {
      ...stakingContract,
      functionName: "balanceOf",
      args: [memberAddress!],
    },
    {
      abi: erc20Abi,
      address: assetAddress,
      functionName: "balanceOf",
      args: [memberAddress!],
    },
  ];

  // Batch 2: UserManager & MemberNFT Basic Info
  const memberInfoContracts = [
    {
      ...userManagerContract,
      functionName: "getLockedStake",
      args: [clubAddress, memberAddress!],
    },
    {
      ...userManagerContract,
      functionName: "getVouchingAmount",
      args: [clubAddress, memberAddress!],
    },
    {
      ...memberNftContract,
      functionName: "getMemberId",
      args: [memberAddress!],
    },
    {
      ...memberNftContract,
      functionName: "_invited",
      args: [memberAddress!],
    },
    {
      ...memberNftContract,
      functionName: "getInvites",
      args: [memberAddress!],
    },
  ];

  // Execute balance and member info batches
  const balanceResult = useReadContracts({
    contracts: balanceContracts.map(c => ({
      ...c,
      chainId: DEFAULT_CHAIN_ID,
    })) as any,
    query: {
      enabled: !!clubAddress && !!memberAddress && !clubDataLoading && !!assetAddress,
      staleTime: Infinity,
    }
  });

  const memberInfoResult = useReadContracts({
    contracts: memberInfoContracts.map(c => ({
      ...c,
      chainId: DEFAULT_CHAIN_ID,
    })) as any,
    query: {
      enabled: !!clubAddress && !!memberAddress && !clubDataLoading,
      staleTime: Infinity,
    }
  });

  // Extract values with proper type handling
  const safeBigInt = (value: any): bigint => {
    if (typeof value === 'bigint') return value;
    if (typeof value === 'number') return BigInt(value);
    if (typeof value === 'string') return BigInt(value);
    return 0n;
  };

  // Extract balance data
  const [
    clubTokenBalance = 0n,
    memberNftBalance = 0n,
    stakedBalance = 0n,
    assetBalance = 0n,
  ] = balanceResult.data?.map(d => safeBigInt(d.result)) || [];

  // Extract member info data
  const memberInfoData = memberInfoResult.data || [];
  const owed = safeBigInt(memberInfoData[0]?.result);
  const vouch = safeBigInt(memberInfoData[1]?.result);
  const tokenId = safeBigInt(memberInfoData[2]?.result);
  const invitedByAddress = (memberInfoData[3]?.result as Address) || zeroAddress;
  const inviteCount = safeBigInt(memberInfoData[4]?.result);

  // Get member details from getMember function (only if tokenId is available)
  const memberDataQuery = useReadContract({
    ...memberNftContract,
    functionName: "getMember",
    args: [tokenId],
    chainId: DEFAULT_CHAIN_ID,
    query: {
      enabled: tokenId > 0n && !!memberNftContract.address && !clubDataLoading,
      staleTime: Infinity,
    }
  });

  // Safely extract member data from the tuple
  let referrer = zeroAddress;
  let baseTrust = 0n;
  let badDebt = 0n;
  let updatedAt = 0n;
  let active = false;
  let tier = 0;
  let tierPercentage = 0n;
  let tierLabel = "";

  if (memberDataQuery.data && typeof memberDataQuery.data === 'object') {
    const memberDetails = memberDataQuery.data as any;
    

    
    // Only access properties if memberDetails is a valid object
    if (memberDetails && !memberDetails.error && !Array.isArray(memberDetails)) {
      referrer = memberDetails.referrer || zeroAddress;
      baseTrust = safeBigInt(memberDetails.baseTrust);
      badDebt = safeBigInt(memberDetails.badDebt);
      updatedAt = safeBigInt(memberDetails.updatedAt);
      active = memberDetails.isActive === true;
      tier = typeof memberDetails.tier === 'number' ? memberDetails.tier : 0;
      tierPercentage = safeBigInt(memberDetails.tierPercentage);
      tierLabel = typeof memberDetails.tierLabel === 'string' ? memberDetails.tierLabel : "";
    }
  }

  // Get percent vested based on updatedAt
  const percentVestedQuery = useReadContract({
    ...creditVaultContract,
    functionName: "_percentVested",
    args: [updatedAt],
    chainId: DEFAULT_CHAIN_ID,
    query: {
      enabled: updatedAt > 0n && !!creditVaultContract.address && !clubDataLoading,
      staleTime: Infinity,
    }
  });

  const percentVested = safeBigInt(percentVestedQuery.data);

  // Calculate values based on available data
  const WAD = 10n ** 18n;
  const startingAmount = baseTrust > 0n && startingPercentTrust > 0n
    ? (baseTrust * startingPercentTrust) / WAD 
    : 0n;
  
  const additionalVested = baseTrust > startingAmount && percentVested > 0n
    ? ((baseTrust - startingAmount) * percentVested) / WAD 
    : 0n;
  
  const totalVested = startingAmount + additionalVested;
  const claimableCredit = totalVested > vouch ? totalVested - vouch : 0n;

  const canRepay = owed > 0n;
  const canBorrow = vouch > owed;
  const shares = 0n;  // Default value

  // Check loading states
  const isLoading = 
    clubDataLoading ||
    balanceResult.isLoading ||
    memberInfoResult.isLoading ||
    memberDataQuery.isLoading ||
    percentVestedQuery.isLoading;

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

  const refetch = async () => {
    await Promise.all([
      balanceResult.refetch(),
      memberInfoResult.refetch(),
      memberDataQuery.refetch(),
      percentVestedQuery.refetch(),
    ]);
  };

  return {
    data,
    isLoading,
    refetch,
  };
};