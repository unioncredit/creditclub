import { Address, zeroAddress } from "viem";
import { useReadContracts } from "wagmi";

import { DEFAULT_CHAIN_ID, TOTAL_PERCENT } from "@/constants";
import { useContract } from "@/hooks/useContract";
import { useCreditVaultContract } from "@/hooks/useCreditVaultContract";
import { unionContract } from "@/contracts/base";

export const useClubData = (clubAddress: Address) => {
  const tokenContract = useContract("token");
  const userManagerContract = useContract("userManager");
  const comptrollerContract = useContract("comptroller");
  const creditVaultContract = useCreditVaultContract(clubAddress);

  const contracts = [
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
      functionName: "fixedBidPrice",
    },
    {
      ...unionContract,
      functionName: "balanceOf",
      args: [clubAddress],
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
      ...comptrollerContract,
      functionName: "calculateRewards",
      args: [clubAddress, tokenContract.address],
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
      functionName: "isTokenEnabled"
    },
    {
      ...creditVaultContract,
      functionName: "totalAssets"
    },
    {
      ...creditVaultContract,
      functionName: "decimals"
    },
    {
      ...creditVaultContract,
      functionName: "lockupPeriod"
    },
    {
      ...creditVaultContract,
      functionName: "lockupEnd"
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
      functionName: "startingPercentTrust"
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
      functionName: "withdrawFeeBps",
    },
    {
      ...creditVaultContract,
      functionName: "withdrawPeriod",
    },
    {
      ...creditVaultContract,
      functionName: "vaultWithdrawFeeBps",
    },
    {
      ...creditVaultContract,
      functionName: "stakingWithdrawFeeBps",
    },
    {
      ...creditVaultContract,
      functionName: "isTiersEnabled",
    },
    {
      ...creditVaultContract,
      functionName: "auth",
    },
  ];

  const result = useReadContracts({
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
    unionBalance = 0n,
    callerPercent = 0n,
    winnerPercent = 0n,
    unclaimedRewards = 0n,
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
    stakingAddress = zeroAddress,
    feeRecipient = zeroAddress,
    isClosedEndFund = false,
    withdrawFeeBps = 0n,
    withdrawPeriod = 0n,
    vaultWithdrawFeeBps = 0n,
    stakingWithdrawFeeBps = 0n,
    isTiersEnabled = false,
    authAddress = zeroAddress,
  ] = result.data?.map(d => d.result as never) || [];

  const data = {
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
    stakingAddress,
    feeRecipient,
    isClosedEndFund,
    withdrawFeeBps,
    withdrawPeriod,
    vaultWithdrawFeeBps,
    stakingWithdrawFeeBps,
    isTiersEnabled,
    authAddress,
  };

  return { ...result, data };
};