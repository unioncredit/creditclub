import { useReadContracts } from "wagmi";
import React, { createContext, useContext } from "react";

import {
  assetManagerContract, daiContract,
  uTokenContract,
} from "@/contracts/optimism";
import { IUnionDataProviderContext } from "@/providers/types";

const UnionDataContext = createContext({} as IUnionDataProviderContext);

export const useUnionData = () => useContext(UnionDataContext);

export const UnionDataProvider = ({ children }: { children: React.ReactNode; }) => {
  const result = useReadContracts({
    contracts: [
      {
        ...uTokenContract,
        functionName: "minBorrow",
      },
      {
        ...uTokenContract,
        functionName: "originationFee",
      },
      {
        ...uTokenContract,
        functionName: "overdueTime",
      },
      {
        ...uTokenContract,
        functionName: "borrowRatePerSecond",
      },
      {
        ...assetManagerContract,
        functionName: "getLoanableAmount",
        args: [daiContract.address]
      }
    ],
  });

  const [
    minBorrow = 0n,
    originationFee = 0n,
    overdueTime = 0n,
    borrowRatePerSecond = 0n,
    getLoanableAmount = 0n,
  ] = result.data?.map(d => d.result as never) || [];

  const data = {
    minBorrow,
    originationFee,
    overdueTime,
    borrowRatePerSecond,
    getLoanableAmount,
  };

  return (
    <UnionDataContext.Provider value={{ ...result, data }}>
      {children}
    </UnionDataContext.Provider>
  );
};