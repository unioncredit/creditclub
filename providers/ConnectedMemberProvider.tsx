import { useAccount, useReadContracts } from "wagmi";
import React, { createContext, useContext } from "react";

import { IConnectedMemberContext } from "@/providers/types";
import { useContract } from "@/hooks/useContract";

const ConnectedMemberContext = createContext({} as IConnectedMemberContext);

export const useConnectedMember = () => useContext(ConnectedMemberContext);

export const ConnectedMemberProvider = ({ children }: { children: React.ReactNode; }) => {
  const { address } = useAccount();
  
  console.log('🔍 ConnectedMemberProvider Debug:', {
    address,
  });

  const tokenContract = useContract("token");
  
  console.log('🔍 Token contract:', {
    tokenContract,
    address: tokenContract?.address,
  });

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
  
  console.log('🔍 ConnectedMemberProvider data:', {
    tokenBalance: tokenBalance.toString(),
    isLoading: result.isLoading,
    error: result.error,
  });

  return (
    <ConnectedMemberContext.Provider value={{ ...result, data }}>
      {children}
    </ConnectedMemberContext.Provider>
  );
};