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
  // Helper function to safely extract contract result values
  const extractResult = (contractResult: any): any => {
    // If the result is successful and has a result property, return it
    if (contractResult?.status === 'success' && contractResult?.result !== undefined) {
      return contractResult.result;
    }
    // If it's a direct result (for backwards compatibility), return it
    if (contractResult?.result !== undefined) {
      return contractResult.result;
    }
    // Otherwise return null for failed/missing results
    return null;
  };

  const safeString = (value: any): string => {
    const extracted = extractResult(value);
    const result = (() => {
      if (typeof extracted === 'string') return extracted;
      if (extracted === null || extracted === undefined) return "";
      return String(extracted);
    })();
    
    // Debug logging for React Error #310
    if (typeof result === 'object' && result !== null) {
      console.error('🔴 safeString returning object:', { input: value, extracted, result });
    }
    
    return result;
  };

  const safeNumber = (value: any): number => {
    const extracted = extractResult(value);
    const result = (() => {
      if (typeof extracted === 'number') return extracted;
      if (typeof extracted === 'bigint') return Number(extracted);
      if (typeof extracted === 'string') return parseInt(extracted) || 0;
      return 0;
    })();
    
    // Debug logging for React Error #310
    if (typeof result === 'object' && result !== null) {
      console.error('🔴 safeNumber returning object:', { input: value, extracted, result });
    }
    
    return result;
  };

  const safeBigInt = (value: any): bigint => {
    const extracted = extractResult(value);
    const result = (() => {
      if (typeof extracted === 'bigint') return extracted;
      if (typeof extracted === 'number') return BigInt(extracted);
      if (typeof extracted === 'string') return BigInt(extracted || 0);
      return 0n;
    })();
    
    // Debug logging for React Error #310
    if (typeof result === 'object' && result !== null) {
      console.error('🔴 safeBigInt returning object:', { input: value, extracted, result });
    }
    
    return result;
  };

  const safeBoolean = (value: any): boolean => {
    const extracted = extractResult(value);
    const result = (() => {
      if (typeof extracted === 'boolean') return extracted;
      return Boolean(extracted);
    })();
    
    // Debug logging for React Error #310
    if (typeof result === 'object' && result !== null) {
      console.error('🔴 safeBoolean returning object:', { input: value, extracted, result });
    }
    
    return result;
  };

  const safeAddress = (value: any): Address => {
    const extracted = extractResult(value);
    const result = (() => {
      if (typeof extracted === 'string' && extracted.startsWith('0x')) return extracted as Address;
      return zeroAddress;
    })();
    
    // Debug logging for React Error #310
    if (typeof result === 'object' && result !== null && result !== zeroAddress) {
      console.error('🔴 safeAddress returning object:', { input: value, extracted, result });
    }
    
    return result;
  };

  const basicInfoData = basicInfoResult.data || [];
  const name = safeString(basicInfoData[0]);
  const symbol = safeString(basicInfoData[1]);
  const decimals = safeNumber(basicInfoData[2]);
  const memberNftAddress = safeAddress(basicInfoData[3]);
  const assetAddress = safeAddress(basicInfoData[4]);
  const stakingAddress = safeAddress(basicInfoData[5]);
  const auctionAddress = safeAddress(basicInfoData[6]);
  const rewardsManagerAddress = safeAddress(basicInfoData[7]);
  const creatorAddress = safeAddress(basicInfoData[8]);
  const ownerAddress = safeAddress(basicInfoData[9]);
  const image = safeString(basicInfoData[10]);
  const description = safeString(basicInfoData[11]);

  const financialInfoData = financialInfoResult.data || [];
  const totalLockedStake = safeBigInt(financialInfoData[0]);
  const stakedBalance = safeBigInt(financialInfoData[1]);
  const totalAssets = safeBigInt(financialInfoData[2]);
  const totalSupply = safeBigInt(financialInfoData[3]);
  const fixedBidPrice = safeBigInt(financialInfoData[4]);
  const vaultWithdrawFeeBps = safeBigInt(financialInfoData[5]);
  const feeRecipient = safeAddress(financialInfoData[6]);
  const unionBalance = safeBigInt(financialInfoData[7]);
  const unclaimedRewards = safeBigInt(financialInfoData[8]);

  const configurationData = configurationResult.data || [];
  const isPublic = safeBoolean(configurationData[0]);
  const isActivated = safeBoolean(configurationData[1]);
  const isTokenEnabled = safeBoolean(configurationData[2]);
  const isClosedEndFund = safeBoolean(configurationData[3]);
  const isTiersEnabled = safeBoolean(configurationData[4]);
  const lockupPeriod = safeBigInt(configurationData[5]);
  const lockupEnd = safeBigInt(configurationData[6]);
  const withdrawPeriod = safeBigInt(configurationData[7]);
  const vestingDurationInSeconds = safeBigInt(configurationData[8]);
  const startingPercentTrust = safeBigInt(configurationData[9]);
  const baseTrust = safeBigInt(configurationData[10]);

  const rewardsData = rewardsResult.data || [];
  const callerPercent = safeBigInt(rewardsData[0]);
  const winnerPercent = safeBigInt(rewardsData[1]);
  const costToCall = safeBigInt(rewardsData[2]);
  const lastReward = safeBigInt(rewardsData[3]);
  const rewardCooldown = safeNumber(rewardsData[4]);

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

  const stakingWithdrawFeeBps = safeBigInt(stakingWithdrawFeeBpsQuery.data);

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