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

  // Extract data from batch results with proper wagmi result destructuring

  // Extract basic info results with proper destructuring
  const [
    nameResult,
    symbolResult,
    decimalsResult,
    memberNftAddressResult,
    assetAddressResult,
    stakingAddressResult,
    auctionAddressResult,
    rewardsManagerAddressResult,
    creatorAddressResult,
    ownerAddressResult,
    imageResult,
    descriptionResult,
  ] = basicInfoResult.data || [];

  const name: string = (nameResult?.result as string) ?? "";
  const symbol: string = (symbolResult?.result as string) ?? "";
  const decimals: number = (decimalsResult?.result as number) ?? 18;
  const memberNftAddress: Address = (memberNftAddressResult?.result as Address) ?? zeroAddress;
  const assetAddress: Address = (assetAddressResult?.result as Address) ?? zeroAddress;
  const stakingAddress: Address = (stakingAddressResult?.result as Address) ?? zeroAddress;
  const auctionAddress: Address = (auctionAddressResult?.result as Address) ?? zeroAddress;
  const rewardsManagerAddress: Address = (rewardsManagerAddressResult?.result as Address) ?? zeroAddress;
  const creatorAddress: Address = (creatorAddressResult?.result as Address) ?? zeroAddress;
  const ownerAddress: Address = (ownerAddressResult?.result as Address) ?? zeroAddress;
  const image: string = (imageResult?.result as string) ?? "";
  const description: string = (descriptionResult?.result as string) ?? "";

  // Extract financial info results with proper destructuring
  const [
    totalLockedStakeResult,
    stakedBalanceResult,
    totalAssetsResult,
    totalSupplyResult,
    fixedBidPriceResult,
    vaultWithdrawFeeBpsResult,
    feeRecipientResult,
    unionBalanceResult,
    unclaimedRewardsResult,
  ] = financialInfoResult.data || [];

  const totalLockedStake: bigint = (totalLockedStakeResult?.result as bigint) ?? 0n;
  const stakedBalance: bigint = (stakedBalanceResult?.result as bigint) ?? 0n;
  const totalAssets: bigint = (totalAssetsResult?.result as bigint) ?? 0n;
  const totalSupply: bigint = (totalSupplyResult?.result as bigint) ?? 0n;
  const fixedBidPrice: bigint = (fixedBidPriceResult?.result as bigint) ?? 0n;
  const vaultWithdrawFeeBps: bigint = (vaultWithdrawFeeBpsResult?.result as bigint) ?? 0n;
  const feeRecipient: Address = (feeRecipientResult?.result as Address) ?? zeroAddress;
  const unionBalance: bigint = (unionBalanceResult?.result as bigint) ?? 0n;
  const unclaimedRewards: bigint = (unclaimedRewardsResult?.result as bigint) ?? 0n;

  // Extract configuration results with proper destructuring
  const [
    isPublicResult,
    isActivatedResult,
    isTokenEnabledResult,
    isClosedEndFundResult,
    isTiersEnabledResult,
    lockupPeriodResult,
    lockupEndResult,
    withdrawPeriodResult,
    vestingDurationInSecondsResult,
    startingPercentTrustResult,
    baseTrustResult,
  ] = configurationResult.data || [];

  const isPublic: boolean = (isPublicResult?.result as boolean) ?? false;
  const isActivated: boolean = (isActivatedResult?.result as boolean) ?? false;
  const isTokenEnabled: boolean = (isTokenEnabledResult?.result as boolean) ?? false;
  const isClosedEndFund: boolean = (isClosedEndFundResult?.result as boolean) ?? false;
  const isTiersEnabled: boolean = (isTiersEnabledResult?.result as boolean) ?? false;
  const lockupPeriod: bigint = (lockupPeriodResult?.result as bigint) ?? 0n;
  const lockupEnd: bigint = (lockupEndResult?.result as bigint) ?? 0n;
  const withdrawPeriod: bigint = (withdrawPeriodResult?.result as bigint) ?? 0n;
  const vestingDurationInSeconds: bigint = (vestingDurationInSecondsResult?.result as bigint) ?? 0n;
  const startingPercentTrust: bigint = (startingPercentTrustResult?.result as bigint) ?? 0n;
  const baseTrust: bigint = (baseTrustResult?.result as bigint) ?? 0n;

  // Extract rewards results with proper destructuring
  const [
    callerPercentResult,
    winnerPercentResult,
    costToCallResult,
    lastRewardResult,
    rewardCooldownResult,
  ] = rewardsResult.data || [];

  const callerPercent: bigint = (callerPercentResult?.result as bigint) ?? 0n;
  const winnerPercent: bigint = (winnerPercentResult?.result as bigint) ?? 0n;
  const costToCall: bigint = (costToCallResult?.result as bigint) ?? 0n;
  const lastReward: bigint = (lastRewardResult?.result as bigint) ?? 0n;
  const rewardCooldown: number = (rewardCooldownResult?.result as number) ?? 0;

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

  const stakingWithdrawFeeBps: bigint = (stakingWithdrawFeeBpsQuery.data as bigint) ?? 0n;

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