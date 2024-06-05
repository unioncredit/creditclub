import { useReadContracts } from "wagmi";
import React, { createContext, useContext } from "react";

import { CREDITCLUB_SAFE_ADDRESS } from "@/constants";
import {
  clubNftContract,
  clubPluginContract,
  comptrollerContract,
  daiContract,
  userManagerContract,
  uTokenContract,
} from "@/contracts/optimism";
import { ICreditClubDataProviderContext } from "@/providers/types";

const CreditClubDataContext = createContext({} as ICreditClubDataProviderContext);

export const useCreditClub = () => useContext(CreditClubDataContext);

export const CreditClubDataProvider = ({ children }: { children: React.ReactNode; }) => {
  const result = useReadContracts({
    contracts: [
      {
        ...userManagerContract,
        functionName: "getTotalLockedStake",
        args: [CREDITCLUB_SAFE_ADDRESS],
      },
      {
        ...userManagerContract,
        functionName: "getStakerBalance",
        args: [CREDITCLUB_SAFE_ADDRESS],
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
        args: [CREDITCLUB_SAFE_ADDRESS, daiContract.address],
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
      }
    ],
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
  };

  return (
    <CreditClubDataContext.Provider value={{ ...result, data }}>
      {children}
    </CreditClubDataContext.Provider>
  );
};