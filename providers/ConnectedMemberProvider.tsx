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
  const tokenBalance = safeBigInt(resultData[0]);

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