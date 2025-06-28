import { useReadContracts } from "wagmi";
import React, { createContext, useContext } from "react";

import { IUnionDataContext } from "@/providers/types";
import { useContract } from "@/hooks/useContract";
import { DEFAULT_CHAIN_ID } from "@/constants";

const UnionDataContext = createContext({} as IUnionDataContext);

export const useUnionData = () => useContext(UnionDataContext);

export const UnionDataProvider = ({ children }: { children: React.ReactNode; }) => {
  const uTokenContract = useContract("uToken");

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
    ].map(c => ({
      ...c,
      chainId: DEFAULT_CHAIN_ID,
    })),
  });

  const [
    minBorrow = 0n,
    originationFee = 0n,
    overdueTime = 0n,
    borrowRatePerSecond = 0n,
  ] = result.data?.map(d => d.result as never) || [];

  const data = {
    minBorrow,
    originationFee,
    overdueTime,
    borrowRatePerSecond,
  };

  return (
    <UnionDataContext.Provider value={{ 
      data,
      isLoading: result.isLoading,
      isError: result.isError,
      isFetching: result.isFetching,
      isSuccess: result.isSuccess,
      refetch: result.refetch,
    }}>
      {children}
    </UnionDataContext.Provider>
  )
}