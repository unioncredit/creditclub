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
        functionName: "overdueTime",
      },
    ].map(c => ({
      ...c,
      chainId: DEFAULT_CHAIN_ID,
    })),
  });

  const [
    overdueTime = 0n,
  ] = result.data?.map(d => d.result as never) || [];

  const data = {
    overdueTime,
  };

  return (
    <UnionDataContext.Provider value={{ ...result, data }}>
      {children}
    </UnionDataContext.Provider>
  )
}