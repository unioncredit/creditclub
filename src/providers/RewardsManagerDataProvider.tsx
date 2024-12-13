import { useAccount, useReadContracts } from "wagmi";
import React, { createContext, useContext } from "react";
import { IRewardsManagerDataProviderContext } from "@/providers/types";
import { zeroAddress } from "viem";
import { useContract } from "@/hooks/useContract.ts";

const RewardsManagerDataContext = createContext({} as IRewardsManagerDataProviderContext);

export const useRewardsManager = () => useContext(RewardsManagerDataContext);

export const RewardsManagerProvider = ({ children }: { children: React.ReactNode; }) => {
  const { address = zeroAddress } = useAccount();

  const unionContract = useContract("union");
  const rewardsManagerContract = useContract("rewardsManager");
  const tokenContract = useContract("token");

  const result = useReadContracts({
    contracts: [
      {
        ...unionContract,
        functionName: "allowance",
        args: [address, rewardsManagerContract.address],
      },
      {
        ...rewardsManagerContract,
        functionName: "unionPer",
      },
      {
        ...rewardsManagerContract,
        functionName: "invitePrice",
      },
      {
        ...tokenContract,
        functionName: 'balanceOf',
        args: [rewardsManagerContract.address],
      },
    ],
    query: {
      enabled: address !== zeroAddress,
    }
  });

  const [
    allowance = 0n,
    unionPer = 0n,
    invitePrice = 0n,
    contractDaiBalance = 0n,
  ] = result.data?.map(d => d.result as never) || [];

  const data = {
    allowance,
    unionPer,
    invitePrice,
    contractDaiBalance,
  };

  return (
    <RewardsManagerDataContext.Provider value={{ ...result, data }}>
      {children}
    </RewardsManagerDataContext.Provider>
  );
};