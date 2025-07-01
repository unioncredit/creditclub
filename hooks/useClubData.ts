import { Address, zeroAddress } from "viem";
import { useReadContract, useReadContracts } from "wagmi";
import { useMemo } from "react";

import { DEFAULT_CHAIN_ID, TOTAL_PERCENT } from "@/constants";
import { useContract } from "@/hooks/useContract";
import { useCreditVaultContract } from "@/hooks/useCreditVaultContract";
import { useStakingContract } from "@/hooks/useStakingContract";
import { unionContract } from "@/contracts/base";

interface ClubData {
  totalLockedStake: bigint;
  stakedBalance: bigint;
  fixedBidPrice: bigint;
  unionBalance: bigint;
  callerPercent: number;
  winnerPercent: number;
  bidBucketPercent: number;
  unclaimedRewards: bigint;
  costToCall: bigint;
  lastReward: bigint;
  rewardCooldown: number;
  name: string;
  symbol: string;
  memberNftAddress: Address;
  isTokenEnabled: boolean;
  totalAssets: bigint;
  decimals: number;
  lockupPeriod: bigint;
  lockupEnd: bigint;
  assetAddress: Address;
  isPublic: boolean;
  vestingDurationInSeconds: bigint;
  startingPercentTrust: bigint;
  totalSupply: bigint;
  creatorAddress: Address;
  isActivated: boolean;
  rewardsManagerAddress: Address;
  auctionAddress: Address;
  image: string;
  description: string;
  stakingAddress: Address;
  feeRecipient: Address;
  isClosedEndFund: boolean;
  withdrawPeriod: bigint;
  vaultWithdrawFeeBps: bigint;
  stakingWithdrawFeeBps: bigint;
  isTiersEnabled: boolean;
  ownerAddress: Address;
  baseTrust: bigint;
}

interface UseClubDataReturn {
  data: ClubData;
  isLoading: boolean;
  isRefetching: boolean;
  refetch: () => Promise<void>;
}

export const useClubData = (clubAddress: Address): UseClubDataReturn => {
  const tokenContract = useContract("token");
  const userManagerContract = useContract("userManager");
  const comptrollerContract = useContract("comptroller");
  const creditVaultContract = useCreditVaultContract(clubAddress);

  // Batch 1: Basic Information (name, symbol, addresses, etc.)
  const basicInfoContracts = useMemo(() => ([
    {
      ...creditVaultContract,
      functionName: "name",
    },
    {
      ...creditVaultContract,
      functionName: "symbol",
    },
    {
      ...creditVaultContract,
      functionName: "decimals",
    },
    {
      ...creditVaultContract,
      functionName: "nft",
    },
    {
      ...creditVaultContract,
      functionName: "asset",
    },
    {
      ...creditVaultContract,
      functionName: "staking",
    },
    {
      ...creditVaultContract,
      functionName: "auction",
    },
    {
      ...creditVaultContract,
      functionName: "rewardManager",
    },
    {
      ...creditVaultContract,
      functionName: "creator",
    },
    {
      ...creditVaultContract,
      functionName: "owner",
    },
    {
      ...creditVaultContract,
      functionName: "image",
    },
    {
      ...creditVaultContract,
      functionName: "description",
    },
  ]), [creditVaultContract]);

  // Batch 2: Financial Information
  const financialInfoContracts = useMemo(() => ([
    {
      ...userManagerContract,
      functionName: "getTotalLockedStake",
      args: [clubAddress],
    },
    {
      ...userManagerContract,
      functionName: "getStakerBalance",
      args: [clubAddress],
    },
    {
      ...creditVaultContract,
      functionName: "totalAssets",
    },
    {
      ...creditVaultContract,
      functionName: "totalSupply",
    },
    {
      ...creditVaultContract,
      functionName: "fixedBidPrice",
    },
    {
      ...creditVaultContract,
      functionName: "withdrawFeeBps",
    },
    {
      ...creditVaultContract,
      functionName: "feeRecipient",
    },
    {
      ...unionContract,
      functionName: "balanceOf",
      args: [clubAddress],
    },
    {
      ...comptrollerContract,
      functionName: "calculateRewards",
      args: [clubAddress, tokenContract.address],
    },
  ]), [userManagerContract, creditVaultContract, unionContract, comptrollerContract, clubAddress, tokenContract.address]);

  // Batch 3: Configuration & Settings
  const configurationContracts = useMemo(() => ([
    {
      ...creditVaultContract,
      functionName: "isPublic",
    },
    {
      ...creditVaultContract,
      functionName: "isActivated",
    },
    {
      ...creditVaultContract,
      functionName: "isTokenEnabled",
    },
    {
      ...creditVaultContract,
      functionName: "isClosedEndFund",
    },
    {
      ...creditVaultContract,
      functionName: "isTiersEnabled",
    },
    {
      ...creditVaultContract,
      functionName: "lockupPeriod",
    },
    {
      ...creditVaultContract,
      functionName: "lockupEnd",
    },
    {
      ...creditVaultContract,
      functionName: "withdrawPeriod",
    },
    {
      ...creditVaultContract,
      functionName: "vestingDuration",
    },
    {
      ...creditVaultContract,
      functionName: "startingPercentTrust",
    },
    {
      ...creditVaultContract,
      functionName: "baseTrust",
    },
  ]), [creditVaultContract]);

  // Batch 4: Rewards & Game Mechanics
  const rewardsContracts = useMemo(() => ([
    {
      ...creditVaultContract,
      functionName: "callerPercent",
    },
    {
      ...creditVaultContract,
      functionName: "winnerPercent",
    },
    {
      ...creditVaultContract,
      functionName: "FEELING_LUCKY_COST",
    },
    {
      ...creditVaultContract,
      functionName: "lastReward",
    },
    {
      ...creditVaultContract,
      functionName: "rewardCooldown",
    },
  ]), [creditVaultContract]);

  // Execute all batches with proper typing
  const basicInfoResult = useReadContracts({
    contracts: basicInfoContracts.map(c => ({
      ...c,
      chainId: DEFAULT_CHAIN_ID,
    })) as any,
    query: {
      enabled: !!clubAddress,
      staleTime: Infinity,
    }
  });

  const financialInfoResult = useReadContracts({
    contracts: financialInfoContracts.map(c => ({
      ...c,
      chainId: DEFAULT_CHAIN_ID,
    })) as any,
    query: {
      enabled: !!clubAddress,
      staleTime: Infinity,
    }
  });

  const configurationResult = useReadContracts({
    contracts: configurationContracts.map(c => ({
      ...c,
      chainId: DEFAULT_CHAIN_ID,
    })) as any,
    query: {
      enabled: !!clubAddress,
      staleTime: Infinity,
    }
  });

  const rewardsResult = useReadContracts({
    contracts: rewardsContracts.map(c => ({
      ...c,
      chainId: DEFAULT_CHAIN_ID,
    })) as any,
    query: {
      enabled: !!clubAddress,
      staleTime: Infinity,
    }
  });

  // Extract data from batch results
  const [
    name = "",
    symbol = "",
    decimals = 0,
    memberNftAddress = zeroAddress,
    assetAddress = zeroAddress,
    stakingAddress = zeroAddress,
    auctionAddress = zeroAddress,
    rewardsManagerAddress = zeroAddress,
    creatorAddress = zeroAddress,
    ownerAddress = zeroAddress,
    image = "",
    description = "",
  ] = basicInfoResult.data?.map(d => d.result as never) || [];

  const [
    totalLockedStake = 0n,
    stakedBalance = 0n,
    totalAssets = 0n,
    totalSupply = 0n,
    fixedBidPrice = 0n,
    vaultWithdrawFeeBps = 0n,
    feeRecipient = zeroAddress,
    unionBalance = 0n,
    unclaimedRewards = 0n,
  ] = financialInfoResult.data?.map(d => d.result as never) || [];

  const [
    isPublic = false,
    isActivated = false,
    isTokenEnabled = false,
    isClosedEndFund = false,
    isTiersEnabled = false,
    lockupPeriod = 0n,
    lockupEnd = 0n,
    withdrawPeriod = 0n,
    vestingDurationInSeconds = 0n,
    startingPercentTrust = 0n,
    baseTrust = 0n,
  ] = configurationResult.data?.map(d => d.result as never) || [];

  const [
    callerPercent = 0n,
    winnerPercent = 0n,
    costToCall = 0n,
    lastReward = 0n,
    rewardCooldown = 0,
  ] = rewardsResult.data?.map(d => d.result as never) || [];

  // Get staking withdraw fee from staking contract (kept as separate call)
  const stakingContract = useStakingContract(stakingAddress);
  const stakingWithdrawFeeBpsQuery = useReadContract({
    ...stakingContract,
    functionName: "withdrawFeeBps",
    chainId: DEFAULT_CHAIN_ID,
    query: { 
      enabled: !!stakingAddress && stakingAddress !== zeroAddress && !!basicInfoResult.data, 
      staleTime: Infinity 
    }
  });

  const stakingWithdrawFeeBps = stakingWithdrawFeeBpsQuery.data || 0n;

  // Check if all data is loading
  const isLoading = 
    basicInfoResult.isLoading || 
    financialInfoResult.isLoading || 
    configurationResult.isLoading || 
    rewardsResult.isLoading ||
    stakingWithdrawFeeBpsQuery.isLoading;

  const isRefetching = 
    basicInfoResult.isRefetching || 
    financialInfoResult.isRefetching || 
    configurationResult.isRefetching || 
    rewardsResult.isRefetching ||
    stakingWithdrawFeeBpsQuery.isRefetching;

  const data: ClubData = {
    totalLockedStake,
    stakedBalance,
    fixedBidPrice,
    unionBalance,
    callerPercent: Number(callerPercent),
    winnerPercent: Number(winnerPercent),
    bidBucketPercent: TOTAL_PERCENT - Number(callerPercent) - Number(winnerPercent),
    unclaimedRewards,
    costToCall,
    lastReward,
    rewardCooldown,
    name,
    symbol,
    memberNftAddress,
    isTokenEnabled,
    totalAssets,
    decimals,
    lockupPeriod,
    lockupEnd,
    assetAddress,
    isPublic,
    vestingDurationInSeconds,
    startingPercentTrust,
    totalSupply,
    creatorAddress,
    isActivated,
    rewardsManagerAddress,
    auctionAddress,
    image,
    description,
    stakingAddress,
    feeRecipient,
    isClosedEndFund,
    withdrawPeriod,
    vaultWithdrawFeeBps,
    stakingWithdrawFeeBps,
    isTiersEnabled,
    ownerAddress,
    baseTrust,
  };

  const refetch = async () => {
    await Promise.all([
      basicInfoResult.refetch(),
      financialInfoResult.refetch(),
      configurationResult.refetch(),
      rewardsResult.refetch(),
      stakingWithdrawFeeBpsQuery.refetch(),
    ]);
  };

  return { 
    data, 
    isLoading,
    isRefetching,
    refetch 
  };
};