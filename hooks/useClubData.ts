import { Address, zeroAddress } from "viem";
import { useReadContract, useReadContracts } from "wagmi";

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

  const contracts = [
    // UserManager contracts
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
    // CreditVault contracts
    {
      ...creditVaultContract,
      functionName: "fixedBidPrice",
    },
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
      functionName: "nft",
    },
    {
      ...creditVaultContract,
      functionName: "isTokenEnabled",
    },
    {
      ...creditVaultContract,
      functionName: "totalAssets",
    },
    {
      ...creditVaultContract,
      functionName: "decimals",
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
      functionName: "asset",
    },
    {
      ...creditVaultContract,
      functionName: "isPublic",
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
      functionName: "totalSupply",
    },
    {
      ...creditVaultContract,
      functionName: "creator",
    },
    {
      ...creditVaultContract,
      functionName: "isActivated",
    },
    {
      ...creditVaultContract,
      functionName: "rewardManager",
    },
    {
      ...creditVaultContract,
      functionName: "auction",
    },
    {
      ...creditVaultContract,
      functionName: "image",
    },
    {
      ...creditVaultContract,
      functionName: "description",
    },
    {
      ...creditVaultContract,
      functionName: "staking",
    },
    {
      ...creditVaultContract,
      functionName: "feeRecipient",
    },
    {
      ...creditVaultContract,
      functionName: "isClosedEndFund",
    },
    {
      ...creditVaultContract,
      functionName: "withdrawPeriod",
    },
    {
      ...creditVaultContract,
      functionName: "withdrawFeeBps",
    },
    {
      ...creditVaultContract,
      functionName: "isTiersEnabled",
    },
    {
      ...creditVaultContract,
      functionName: "owner",
    },
    {
      ...creditVaultContract,
      functionName: "baseTrust",
    },
    // Union contract
    {
      ...unionContract,
      functionName: "balanceOf",
      args: [clubAddress],
    },
    // Comptroller contract
    {
      ...comptrollerContract,
      functionName: "calculateRewards",
      args: [clubAddress, tokenContract.address],
    },
  ];

  const result = useReadContracts({
    // @ts-ignore
    contracts: contracts.map(c => ({
      ...c,
      chainId: DEFAULT_CHAIN_ID,
    })),
    query: {
      enabled: !!clubAddress,
      staleTime: Infinity,
    }
  });

  const [
    totalLockedStake = 0n,
    stakedBalance = 0n,
    fixedBidPrice = 0n,
    callerPercent = 0n,
    winnerPercent = 0n,
    costToCall = 0n,
    lastReward = 0n,
    rewardCooldown = 0,
    name = "",
    symbol = "",
    memberNftAddress = zeroAddress,
    isTokenEnabled = false,
    totalAssets = 0n,
    decimals = 0,
    lockupPeriod = 0n,
    lockupEnd = 0n,
    assetAddress = zeroAddress,
    isPublic = false,
    vestingDurationInSeconds = 0n,
    startingPercentTrust = 0n,
    totalSupply = 0n,
    creatorAddress = zeroAddress,
    isActivated = false,
    rewardsManagerAddress = zeroAddress,
    auctionAddress = zeroAddress,
    image = "",
    description = "",
    stakingAddress = zeroAddress,
    feeRecipient = zeroAddress,
    isClosedEndFund = false,
    withdrawPeriod = 0n,
    vaultWithdrawFeeBps = 0n,
    isTiersEnabled = false,
    ownerAddress = zeroAddress,
    baseTrust = 0n,
    unionBalance = 0n,
    unclaimedRewards = 0n,
  ] = result.data?.map(d => d.result as never) || [];

  // Get staking withdraw fee from staking contract
  const stakingContract = useStakingContract(stakingAddress);
  const stakingWithdrawFeeBpsQuery = useReadContract({
    ...stakingContract,
    functionName: "withdrawFeeBps",
    chainId: DEFAULT_CHAIN_ID,
    query: { 
      enabled: !!stakingAddress && stakingAddress !== zeroAddress, 
      staleTime: Infinity 
    }
  });

  const stakingWithdrawFeeBps = stakingWithdrawFeeBpsQuery.data || 0n;

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
    await result.refetch();
    await stakingWithdrawFeeBpsQuery.refetch();
  };

  return { 
    data, 
    isLoading: result.isLoading || stakingWithdrawFeeBpsQuery.isLoading,
    isRefetching: result.isRefetching || stakingWithdrawFeeBpsQuery.isRefetching,
    refetch 
  };
};