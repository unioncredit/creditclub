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

  // Helper function to safely extract contract result values
  const extractResult = (contractResult: any): any => {
    if (contractResult?.status === 'success' && contractResult?.result !== undefined) {
      return contractResult.result;
    }
    if (contractResult?.result !== undefined) {
      return contractResult.result;
    }
    return null;
  };

  const safeBigInt = (value: any): bigint => {
    const extracted = extractResult(value);
    if (typeof extracted === 'bigint') return extracted;
    if (typeof extracted === 'number') return BigInt(extracted);
    if (typeof extracted === 'string') return BigInt(extracted || 0);
    return 0n;
  };

  const resultData = result.data || [];
  const minBorrow = safeBigInt(resultData[0]);
  const originationFee = safeBigInt(resultData[1]);
  const overdueTime = safeBigInt(resultData[2]);
  const borrowRatePerSecond = safeBigInt(resultData[3]);

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
      isRefetching: result.isRefetching,
      refetch: result.refetch,
    }}>
      {children}
    </UnionDataContext.Provider>
  )
}