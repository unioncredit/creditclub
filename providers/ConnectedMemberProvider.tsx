import { useAccount, useReadContracts } from "wagmi";
import React, { createContext, useContext } from "react";

import { IConnectedMemberContext } from "@/providers/types";
import { useContract } from "@/hooks/useContract";

const ConnectedMemberContext = createContext({} as IConnectedMemberContext);

export const useConnectedMember = () => useContext(ConnectedMemberContext);

export const ConnectedMemberProvider = ({ children }: { children: React.ReactNode; }) => {
  const { address } = useAccount();

  const tokenContract = useContract("token");

  const contracts = [
    {
      ...tokenContract,
      functionName: "balanceOf",
      args: [address],
    },
  ];

  const result = useReadContracts({
    contracts,
    query: {
      enabled: !!address,
    }
  });

  const [
    tokenBalance = 0n,
    // @ts-ignore
  ] = result.data?.map(d => d.result as never) || [];

  const data = {
    tokenBalance,
  };

  return (
    <ConnectedMemberContext.Provider value={{ 
      data,
      isLoading: result.isLoading,
      isRefetching: result.isRefetching,
      refetch: result.refetch,
    }}>
      {children}
    </ConnectedMemberContext.Provider>
  );
};