import { useReadContracts } from "wagmi";
import React, { createContext, useContext } from "react";
import { Address } from "viem";
import { userManagerAbi } from "@/abis/userManager";

const TestDataContext = createContext({} as any);

export const useTestData = () => useContext(TestDataContext);

export const TestProvider = ({ children }: { children: React.ReactNode; }) => {
  const contracts = [
    {
      address: "0xfd745A1e2A220C6aC327EC55d2Cb404CD939f56b" as Address,
      abi: userManagerAbi,
      functionName: "getTotalLockedStake",
      args: ["0x09760178c77Ee967DC1F36d29A6D17C481ecA728"],
    },
    {
      address: "0xfd745A1e2A220C6aC327EC55d2Cb404CD939f56b" as Address,
      abi: userManagerAbi,
      functionName: "getStakerBalance",
      args: ["0x09760178c77Ee967DC1F36d29A6D17C481ecA728"],
    },
  ];

  const result = useReadContracts({
    contracts,
    query: {
      enabled: true,
    }
  });

  const [
    totalLockedStake = 0n,
    stakedBalance = 0n,
    // @ts-ignore
  ] = result.data?.map(d => d.result as never) || [];

  const data = {
    totalLockedStake,
    stakedBalance,
  };

  console.log("render", result.data, { totalLockedStake, stakedBalance });

  return (
    <TestDataContext.Provider value={{ ...result, data }}>
      {children}
    </TestDataContext.Provider>
  );
};