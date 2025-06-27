import { Address, zeroAddress } from "viem";
import { useReadContract } from "wagmi";

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

  // Individual contract queries
  const totalLockedStakeQuery = useReadContract({
    ...userManagerContract,
    functionName: "getTotalLockedStake",
    args: [clubAddress],
    chainId: DEFAULT_CHAIN_ID,
    query: { enabled: !!clubAddress, staleTime: Infinity }
  });

  const stakedBalanceQuery = useReadContract({
    ...userManagerContract,
    functionName: "getStakerBalance",
    args: [clubAddress],
    chainId: DEFAULT_CHAIN_ID,
    query: { enabled: !!clubAddress, staleTime: Infinity }
  });

  const fixedBidPriceQuery = useReadContract({
    ...creditVaultContract,
    functionName: "fixedBidPrice",
    chainId: DEFAULT_CHAIN_ID,
    query: { enabled: !!clubAddress, staleTime: Infinity }
  });

  const unionBalanceQuery = useReadContract({
    ...unionContract,
    functionName: "balanceOf",
    args: [clubAddress],
    chainId: DEFAULT_CHAIN_ID,
    query: { enabled: !!clubAddress, staleTime: Infinity }
  });

  const callerPercentQuery = useReadContract({
    ...creditVaultContract,
    functionName: "callerPercent",
    chainId: DEFAULT_CHAIN_ID,
    query: { enabled: !!clubAddress, staleTime: Infinity }
  });

  const winnerPercentQuery = useReadContract({
    ...creditVaultContract,
    functionName: "winnerPercent",
    chainId: DEFAULT_CHAIN_ID,
    query: { enabled: !!clubAddress, staleTime: Infinity }
  });

  const unclaimedRewardsQuery = useReadContract({
    ...comptrollerContract,
    functionName: "calculateRewards",
    args: [clubAddress, tokenContract.address],
    chainId: DEFAULT_CHAIN_ID,
    query: { enabled: !!clubAddress, staleTime: Infinity }
  });

  const costToCallQuery = useReadContract({
    ...creditVaultContract,
    functionName: "FEELING_LUCKY_COST",
    chainId: DEFAULT_CHAIN_ID,
    query: { enabled: !!clubAddress, staleTime: Infinity }
  });

  const lastRewardQuery = useReadContract({
    ...creditVaultContract,
    functionName: "lastReward",
    chainId: DEFAULT_CHAIN_ID,
    query: { enabled: !!clubAddress, staleTime: Infinity }
  });

  const rewardCooldownQuery = useReadContract({
    ...creditVaultContract,
    functionName: "rewardCooldown",
    chainId: DEFAULT_CHAIN_ID,
    query: { enabled: !!clubAddress, staleTime: Infinity }
  });

  const nameQuery = useReadContract({
    ...creditVaultContract,
    functionName: "name",
    chainId: DEFAULT_CHAIN_ID,
    query: { enabled: !!clubAddress, staleTime: Infinity }
  });

  const symbolQuery = useReadContract({
    ...creditVaultContract,
    functionName: "symbol",
    chainId: DEFAULT_CHAIN_ID,
    query: { enabled: !!clubAddress, staleTime: Infinity }
  });

  const memberNftAddressQuery = useReadContract({
    ...creditVaultContract,
    functionName: "nft",
    chainId: DEFAULT_CHAIN_ID,
    query: { enabled: !!clubAddress, staleTime: Infinity }
  });

  const isTokenEnabledQuery = useReadContract({
    ...creditVaultContract,
    functionName: "isTokenEnabled",
    chainId: DEFAULT_CHAIN_ID,
    query: { enabled: !!clubAddress, staleTime: Infinity }
  });

  const totalAssetsQuery = useReadContract({
    ...creditVaultContract,
    functionName: "totalAssets",
    chainId: DEFAULT_CHAIN_ID,
    query: { enabled: !!clubAddress, staleTime: Infinity }
  });

  const decimalsQuery = useReadContract({
    ...creditVaultContract,
    functionName: "decimals",
    chainId: DEFAULT_CHAIN_ID,
    query: { enabled: !!clubAddress, staleTime: Infinity }
  });

  const lockupPeriodQuery = useReadContract({
    ...creditVaultContract,
    functionName: "lockupPeriod",
    chainId: DEFAULT_CHAIN_ID,
    query: { enabled: !!clubAddress, staleTime: Infinity }
  });

  const lockupEndQuery = useReadContract({
    ...creditVaultContract,
    functionName: "lockupEnd",
    chainId: DEFAULT_CHAIN_ID,
    query: { enabled: !!clubAddress, staleTime: Infinity }
  });

  const assetAddressQuery = useReadContract({
    ...creditVaultContract,
    functionName: "asset",
    chainId: DEFAULT_CHAIN_ID,
    query: { enabled: !!clubAddress, staleTime: Infinity }
  });

  const isPublicQuery = useReadContract({
    ...creditVaultContract,
    functionName: "isPublic",
    chainId: DEFAULT_CHAIN_ID,
    query: { enabled: !!clubAddress, staleTime: Infinity }
  });

  const vestingDurationQuery = useReadContract({
    ...creditVaultContract,
    functionName: "vestingDuration",
    chainId: DEFAULT_CHAIN_ID,
    query: { enabled: !!clubAddress, staleTime: Infinity }
  });

  const startingPercentTrustQuery = useReadContract({
    ...creditVaultContract,
    functionName: "startingPercentTrust",
    chainId: DEFAULT_CHAIN_ID,
    query: { enabled: !!clubAddress, staleTime: Infinity }
  });

  const totalSupplyQuery = useReadContract({
    ...creditVaultContract,
    functionName: "totalSupply",
    chainId: DEFAULT_CHAIN_ID,
    query: { enabled: !!clubAddress, staleTime: Infinity }
  });

  const creatorAddressQuery = useReadContract({
    ...creditVaultContract,
    functionName: "creator",
    chainId: DEFAULT_CHAIN_ID,
    query: { enabled: !!clubAddress, staleTime: Infinity }
  });

  const isActivatedQuery = useReadContract({
    ...creditVaultContract,
    functionName: "isActivated",
    chainId: DEFAULT_CHAIN_ID,
    query: { enabled: !!clubAddress, staleTime: Infinity }
  });

  const rewardsManagerAddressQuery = useReadContract({
    ...creditVaultContract,
    functionName: "rewardManager",
    chainId: DEFAULT_CHAIN_ID,
    query: { enabled: !!clubAddress, staleTime: Infinity }
  });

  const auctionAddressQuery = useReadContract({
    ...creditVaultContract,
    functionName: "auction",
    chainId: DEFAULT_CHAIN_ID,
    query: { enabled: !!clubAddress, staleTime: Infinity }
  });

  const imageQuery = useReadContract({
    ...creditVaultContract,
    functionName: "image",
    chainId: DEFAULT_CHAIN_ID,
    query: { enabled: !!clubAddress, staleTime: Infinity }
  });

  const descriptionQuery = useReadContract({
    ...creditVaultContract,
    functionName: "description",
    chainId: DEFAULT_CHAIN_ID,
    query: { enabled: !!clubAddress, staleTime: Infinity }
  });

  const stakingAddressQuery = useReadContract({
    ...creditVaultContract,
    functionName: "staking",
    chainId: DEFAULT_CHAIN_ID,
    query: { enabled: !!clubAddress, staleTime: Infinity }
  });

  const feeRecipientQuery = useReadContract({
    ...creditVaultContract,
    functionName: "feeRecipient",
    chainId: DEFAULT_CHAIN_ID,
    query: { enabled: !!clubAddress, staleTime: Infinity }
  });

  const isClosedEndFundQuery = useReadContract({
    ...creditVaultContract,
    functionName: "isClosedEndFund",
    chainId: DEFAULT_CHAIN_ID,
    query: { enabled: !!clubAddress, staleTime: Infinity }
  });

  const withdrawPeriodQuery = useReadContract({
    ...creditVaultContract,
    functionName: "withdrawPeriod",
    chainId: DEFAULT_CHAIN_ID,
    query: { enabled: !!clubAddress, staleTime: Infinity }
  });

  const vaultWithdrawFeeBpsQuery = useReadContract({
    ...creditVaultContract,
    functionName: "withdrawFeeBps",
    chainId: DEFAULT_CHAIN_ID,
    query: { enabled: !!clubAddress, staleTime: Infinity }
  });

  const isTiersEnabledQuery = useReadContract({
    ...creditVaultContract,
    functionName: "isTiersEnabled",
    chainId: DEFAULT_CHAIN_ID,
    query: { enabled: !!clubAddress, staleTime: Infinity }
  });

  const ownerAddressQuery = useReadContract({
    ...creditVaultContract,
    functionName: "owner",
    chainId: DEFAULT_CHAIN_ID,
    query: { enabled: !!clubAddress, staleTime: Infinity }
  });

  const baseTrustQuery = useReadContract({
    ...creditVaultContract,
    functionName: "baseTrust",
    chainId: DEFAULT_CHAIN_ID,
    query: { enabled: !!clubAddress, staleTime: Infinity }
  });

  // Get staking address first
  const stakingAddress = stakingAddressQuery.data || zeroAddress;

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

  // Extract values
  const totalLockedStake = totalLockedStakeQuery.data || 0n;
  const stakedBalance = stakedBalanceQuery.data || 0n;
  const fixedBidPrice = fixedBidPriceQuery.data || 0n;
  const unionBalance = unionBalanceQuery.data || 0n;
  const callerPercent = callerPercentQuery.data || 0n;
  const winnerPercent = winnerPercentQuery.data || 0n;
  const unclaimedRewards = unclaimedRewardsQuery.data || 0n;
  const costToCall = costToCallQuery.data || 0n;
  const lastReward = lastRewardQuery.data || 0n;
  const rewardCooldown = rewardCooldownQuery.data || 0;
  const name = nameQuery.data || "";
  const symbol = symbolQuery.data || "";
  const memberNftAddress = memberNftAddressQuery.data || zeroAddress;
  const isTokenEnabled = isTokenEnabledQuery.data || false;
  const totalAssets = totalAssetsQuery.data || 0n;
  const decimals = decimalsQuery.data || 0;
  const lockupPeriod = lockupPeriodQuery.data || 0n;
  const lockupEnd = lockupEndQuery.data || 0n;
  const assetAddress = assetAddressQuery.data || zeroAddress;
  const isPublic = isPublicQuery.data || false;
  const vestingDurationInSeconds = vestingDurationQuery.data || 0n;
  const startingPercentTrust = startingPercentTrustQuery.data || 0n;
  const totalSupply = totalSupplyQuery.data || 0n;
  const creatorAddress = creatorAddressQuery.data || zeroAddress;
  const isActivated = isActivatedQuery.data || false;
  const rewardsManagerAddress = rewardsManagerAddressQuery.data || zeroAddress;
  const auctionAddress = auctionAddressQuery.data || zeroAddress;
  const image = imageQuery.data || "";
  const description = descriptionQuery.data || "";
  const feeRecipient = feeRecipientQuery.data || zeroAddress;
  const isClosedEndFund = isClosedEndFundQuery.data || false;
  const withdrawPeriod = withdrawPeriodQuery.data || 0n;
  const vaultWithdrawFeeBps = vaultWithdrawFeeBpsQuery.data || 0n;
  const isTiersEnabled = isTiersEnabledQuery.data || false;
  const ownerAddress = ownerAddressQuery.data || zeroAddress;
  const baseTrust = baseTrustQuery.data || 0n;
  const stakingWithdrawFeeBps = stakingWithdrawFeeBpsQuery.data || 0n;

  // Check loading states
  const queries = [
    totalLockedStakeQuery, stakedBalanceQuery, fixedBidPriceQuery, unionBalanceQuery,
    callerPercentQuery, winnerPercentQuery, unclaimedRewardsQuery, costToCallQuery,
    lastRewardQuery, rewardCooldownQuery, nameQuery, symbolQuery, memberNftAddressQuery,
    isTokenEnabledQuery, totalAssetsQuery, decimalsQuery, lockupPeriodQuery, lockupEndQuery,
    assetAddressQuery, isPublicQuery, vestingDurationQuery, startingPercentTrustQuery,
    totalSupplyQuery, creatorAddressQuery, isActivatedQuery, rewardsManagerAddressQuery,
    auctionAddressQuery, imageQuery, descriptionQuery, stakingAddressQuery, feeRecipientQuery,
    isClosedEndFundQuery, withdrawPeriodQuery, vaultWithdrawFeeBpsQuery, isTiersEnabledQuery,
    ownerAddressQuery, baseTrustQuery, stakingWithdrawFeeBpsQuery
  ];

  const isLoading = queries.some(q => q.isLoading);
  const isRefetching = queries.some(q => q.isRefetching);
  
  const refetch = async () => {
    await Promise.all(queries.map(q => q.refetch()));
  };

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

  return { data, isLoading, isRefetching, refetch };
};