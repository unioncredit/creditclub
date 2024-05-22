import { useReadContracts } from "wagmi";
import React, { createContext, useContext } from "react";

import { CREDITCLUB_SAFE_ADDRESS } from "@/constants";
import { userManagerContract } from "@/contracts/optimism";
import { ICreditClubDataProviderReturnType } from "@/providers/types";

const CreditClubDataContext = createContext({} as ICreditClubDataProviderReturnType);

export const useCreditClubData = () => useContext(CreditClubDataContext);

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
    ],
  });

  const [
    totalLockedStaked = 0n,
    stakedBalance = 0n,
  ] = result.data?.map(d => d.result) || [];

  const data = {
    totalLockedStaked,
    stakedBalance,
  };

  return (
    <CreditClubDataContext.Provider value={{ ...result, data }}>
      {children}
    </CreditClubDataContext.Provider>
  );
};