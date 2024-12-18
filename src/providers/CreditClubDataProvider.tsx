import { useAccount, useReadContracts } from "wagmi";
import React, { createContext, useContext } from "react";

import { CREDITCLUB_SAFE_ADDRESS, DEFAULT_CHAIN } from "@/constants";
import { ICreditClubDataProviderContext } from "@/providers/types";
import { useContract } from "@/hooks/useContract.ts";

const CreditClubDataContext = createContext({} as ICreditClubDataProviderContext);

export const useClubData = () => useContext(CreditClubDataContext);

export const CreditClubDataProvider = ({ children }: { children: React.ReactNode; }) => {
  const { chain: connectedChain = DEFAULT_CHAIN } = useAccount();

  const chainId = connectedChain.id;
  const safeAddress = CREDITCLUB_SAFE_ADDRESS[chainId];

  const userManagerContract = useContract("userManager");
  const clubPluginContract = useContract("clubPlugin");
  const uTokenContract = useContract("uToken");
  const comptrollerContract = useContract("comptroller");
  const tokenContract = useContract("token");
  const clubNftContract = useContract("clubNft");

  const contracts = [
    {
      ...userManagerContract,
      functionName: "getTotalLockedStake",
      args: [safeAddress],
    },
    {
      ...userManagerContract,
      functionName: "getStakerBalance",
      args: [safeAddress],
    },
    {
      ...clubPluginContract,
      functionName: "costToCall"
    },
    {
      ...clubPluginContract,
      functionName: "costToMint"
    },
    {
      ...clubPluginContract,
      functionName: "proRataAmount"
    },
    {
      ...clubPluginContract,
      functionName: "memberBidPrice"
    },
    {
      ...clubPluginContract,
      functionName: "publicBidPrice"
    },
    {
      ...clubPluginContract,
      functionName: "bidBucketBalance"
    },
    {
      ...clubPluginContract,
      functionName: "bidBucketPercent",
    },
    {
      ...clubPluginContract,
      functionName: "callerPercent",
    },
    {
      ...clubPluginContract,
      functionName: "winnerPercent",
    },
    {
      ...clubPluginContract,
      functionName: "percentageFull",
    },
    {
      ...uTokenContract,
      functionName: "overdueTime",
    },
    {
      ...comptrollerContract,
      functionName: "calculateRewards",
      args: [safeAddress, tokenContract.address],
    },
    {
      ...clubNftContract,
      functionName: "totalSupply",
    },
    {
      ...clubPluginContract,
      functionName: "checkpoint",
    },
    {
      ...clubPluginContract,
      functionName: "cooldown",
    },
    {
      ...clubNftContract,
      functionName: "contractURI",
    },
    {
      ...uTokenContract,
      functionName: "borrowRatePerSecond",
    },
    {
      ...clubPluginContract,
      functionName: "vestingDuration",
    },
    {
      ...clubPluginContract,
      functionName: "startingPercentTrust",
    }
  ];

  const result = useReadContracts({
    query: {
      enabled: !!connectedChain,
    },
    contracts: contracts.map(c => ({
      ...c, chainId,
    })),
  });

  const [
    totalLockedStake = 0n,
    stakedBalance = 0n,
    costToCall = 0n,
    costToMint = 0n,
    proRataAmount = 0n,
    memberBidPrice = 0n,
    publicBidPrice = 0n,
    bidBucketBalance = 0n,
    bidBucketPercent = 0,
    callerPercent = 0,
    winnerPercent = 0,
    percentageFull = 0,
    overdueTime = 0n,
    unclaimedRewards = 0n,
    totalSupply = 0n,
    checkpoint = 0n,
    cooldown = 0,
    contractURI= "",
    borrowRatePerSecond = 0n,
    vestingDuration = 0n,
    startingPercentTrust = 0n,
  ] = result.data?.map(d => d.result as never) || [];

  const totalPercent = bidBucketPercent + callerPercent + winnerPercent

  const data = {
    totalLockedStake,
    stakedBalance,
    costToCall,
    costToMint,
    proRataAmount,
    memberBidPrice,
    publicBidPrice,
    bidBucketBalance,
    bidBucketPercent,
    callerPercent,
    winnerPercent,
    totalPercent,
    percentageFull,
    overdueTime,
    unclaimedRewards,
    totalSupply,
    checkpoint,
    cooldown,
    contractURI,
    borrowRatePerSecond,
    vestingDuration,
    startingPercentTrust
  };

  return (
    <CreditClubDataContext.Provider value={{ ...result, data }}>
      {children}
    </CreditClubDataContext.Provider>
  );
};