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
      functionName: "costToCall",
    },
    {
      ...creditVaultContract,
      functionName: "costToMint",
    },
    {
      ...creditVaultContract,
      functionName: "checkpoint",
    },
    {
      ...creditVaultContract,
      functionName: "cooldown",
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
      functionName: "memberNFT",
    },
    {
      ...creditVaultContract,
      functionName: "gatingToken",
    },
    {
      ...creditVaultContract,
      functionName: "gatingTokenType",
    },
    {
      ...creditVaultContract,
      functionName: "memberMax"
    },
    {
      ...creditVaultContract,
      functionName: "vaultTokenEnabled"
    },
    {
      ...creditVaultContract,
      functionName: "totalAssets"
    },
    {
      ...creditVaultContract,
      functionName: "initialRaise"
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
      functionName: "asset",
    },
    {
      ...creditVaultContract,
      functionName: "openRaise",
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
      functionName: "activationDate",
    },
    {
      ...creditVaultContract,
      functionName: "rewardManager",
    },
  ];

  const result = useReadContracts({
    contracts: contracts.map(c => ({
      ...c,
      chainId: DEFAULT_CHAIN_ID,
    })),
    query: {
      enabled: !!clubAddress,
    }
  });

  const [
    totalLockedStake = 0n,
    stakedBalance = 0n,
    fixedBidPrice = 0n,
    unionBalance = 0n,
    callerPercent = 0,
    winnerPercent = 0,
    unclaimedRewards = 0n,
    costToCall = 0n,
    costToMint = 0n,
    checkpoint = 0n,
    cooldown = 0,
    name = "",
    symbol = "",
    memberNftAddress = zeroAddress,
    gatingTokenAddress = zeroAddress,
    gatingTokenType = 0,
    memberMax = 0n,
    vaultTokenEnabled = false,
    totalAssets = 0n,
    initialRaise = 0n,
    decimals = 0,
    lockupPeriod = 0n,
    assetAddress = zeroAddress,
    openRaise = false,
    vestingDurationInSeconds = 0n,
    startingPercentTrust = 0n,
    totalSupply = 0n,
    creatorAddress = zeroAddress,
    activationDate = 0n,
    rewardsManagerAddress = zeroAddress,
  ] = result.data?.map(d => d.result as never) || [];

  const data = {
    totalLockedStake,
    stakedBalance,
    fixedBidPrice,
    unionBalance,
    callerPercent,
    winnerPercent,
    bidBucketPercent: TOTAL_PERCENT - callerPercent - winnerPercent,
    unclaimedRewards,
    costToCall,
    costToMint,
    checkpoint,
    cooldown,
    name,
    symbol,
    memberNftAddress,
    gatingTokenAddress,
    gatingTokenType,
    memberMax,
    vaultTokenEnabled,
    totalAssets,
    initialRaise,
    decimals,
    lockupPeriod,
    assetAddress,
    openRaise,
    vestingDurationInSeconds,
    startingPercentTrust,
    totalSupply,
    raiseOver: totalAssets >= initialRaise,
    creatorAddress,
    activationDate,
    rewardsManagerAddress,
    activated: activationDate > 0n,
  };

  return { ...result, data };
};