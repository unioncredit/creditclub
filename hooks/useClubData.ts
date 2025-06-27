import { Address, zeroAddress } from "viem";
import { useReadContracts } from "wagmi";

import { DEFAULT_CHAIN_ID, TOTAL_PERCENT } from "@/constants";
import { useContract } from "@/hooks/useContract";
import { useCreditVaultContract } from "@/hooks/useCreditVaultContract";
import { useStakingContract } from "@/hooks/useStakingContract";
import { unionContract } from "@/contracts/base";

export const useClubData = (clubAddress: Address) => {
  const tokenContract = useContract("token");
  const userManagerContract = useContract("userManager");
  const comptrollerContract = useContract("comptroller");
  const creditVaultContract = useCreditVaultContract(clubAddress);

  // Split into smaller contract groups to avoid TypeScript depth issues
  const contractsGroup1 = [
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
  ];

  const contractsGroup2 = [
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
  ];

  const contractsGroup3 = [
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
      functionName: "description",
    },
    {
      ...creditVaultContract,
      functionName: "staking",
    },
  ];

  const contractsGroup4 = [
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
  ];

  const result1 = useReadContracts({
    // @ts-ignore
    contracts: contractsGroup1.map(c => ({
      ...c,
      chainId: DEFAULT_CHAIN_ID,
    })),
    query: {
      enabled: !!clubAddress,
      staleTime: Infinity,
    }
  });

  const result2 = useReadContracts({
    // @ts-ignore
    contracts: contractsGroup2.map(c => ({
      ...c,
      chainId: DEFAULT_CHAIN_ID,
    })),
    query: {
      enabled: !!clubAddress,
      staleTime: Infinity,
    }
  });

  const result3 = useReadContracts({
    // @ts-ignore
    contracts: contractsGroup3.map(c => ({
      ...c,
      chainId: DEFAULT_CHAIN_ID,
    })),
    query: {
      enabled: !!clubAddress,
      staleTime: Infinity,
    }
  });

  const result4 = useReadContracts({
    // @ts-ignore
    contracts: contractsGroup4.map(c => ({
      ...c,
      chainId: DEFAULT_CHAIN_ID,
    })),
    query: {
      enabled: !!clubAddress,
      staleTime: Infinity,
    }
  });

  // Extract results from each group
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
  ] = result1.data?.map(d => d.result as never) || [];

  const [
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
  ] = result2.data?.map(d => d.result as never) || [];

  const [
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
  ] = result3.data?.map(d => d.result as never) || [];

  const [
    feeRecipient = zeroAddress,
    isClosedEndFund = false,
    withdrawPeriod = 0n,
    vaultWithdrawFeeBps = 0n,
    isTiersEnabled = false,
    ownerAddress = zeroAddress,
    baseTrust = 0n,
  ] = result4.data?.map(d => d.result as never) || [];

  // Get staking withdraw fee from staking contract
  const stakingContract = useStakingContract(stakingAddress);
  const stakingResult = useReadContracts({
    // @ts-ignore
    contracts: [
      {
        ...stakingContract,
        functionName: "withdrawFeeBps",
      }
    ].map(c => ({
      ...c,
      chainId: DEFAULT_CHAIN_ID,
    })),
    query: {
      enabled: !!stakingAddress && stakingAddress !== zeroAddress,
      staleTime: Infinity,
    }
  });

  const stakingWithdrawFeeBps = stakingResult.data?.[0]?.result as bigint || 0n;

  const isLoading = result1.isLoading || result2.isLoading || result3.isLoading || result4.isLoading || stakingResult.isLoading;
  const isRefetching = result1.isRefetching || result2.isRefetching || result3.isRefetching || result4.isRefetching || stakingResult.isRefetching;
  
  const refetch = async () => {
    await Promise.all([
      result1.refetch(),
      result2.refetch(),
      result3.refetch(),
      result4.refetch(),
      stakingResult.refetch(),
    ]);
  };

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