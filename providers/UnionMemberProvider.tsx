import { useAccount, useReadContracts } from "wagmi";
import React, { createContext, useContext } from "react";

import { IUnionMemberContext } from "@/providers/types";
import { zeroAddress } from "viem";
import { calculateMinPayment } from "@/lib/utils";
import { useContract } from "@/hooks/useContract";
import { useToken } from "@/hooks/useToken";
import { DEFAULT_CHAIN_ID } from "@/constants";
import { base, baseSepolia } from "viem/chains";

const UnionMemberContext = createContext({} as IUnionMemberContext);

export const useUnionMember = () => useContext(UnionMemberContext);

export const UnionMemberProvider = ({ children }: { children: React.ReactNode; }) => {
  const { address = zeroAddress, chain } = useAccount();
  
  // Check if we're on a supported chain
  const isSupportedChain = chain?.id === base.id || chain?.id === baseSepolia.id;
  
  // Always use DEFAULT_CHAIN_ID for token since all contracts use DEFAULT_CHAIN_ID
  const { token } = useToken(DEFAULT_CHAIN_ID);

  const chainId = DEFAULT_CHAIN_ID;
  const uTokenContract = useContract("uToken");
  const userManagerContract = useContract("userManager");
  const tokenContract = useContract("token");
  const unionContract = useContract("union");

  const result = useReadContracts({
    contracts: [
      {
        ...uTokenContract,
        functionName: "checkIsOverdue",
        args: [address],
      },
      {
        ...userManagerContract,
        functionName: "getCreditLimit",
        args: [address],
      },
      {
        ...uTokenContract,
        functionName: "borrowBalanceView",
        args: [address],
      },
      {
        ...tokenContract,
        functionName: "balanceOf",
        args: [address],
      },
      {
        ...uTokenContract,
        functionName: "calculatingInterest",
        args: [address],
      },
      {
        ...unionContract,
        functionName: "balanceOf",
        args: [address],
      }
    ].map(c => ({ ...c, chainId })),
    query: {
      // Only enable queries if on supported chain and address is connected
      enabled: isSupportedChain && !!address && address !== zeroAddress,
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

  const safeBoolean = (value: any): boolean => {
    const extracted = extractResult(value);
    if (typeof extracted === 'boolean') return extracted;
    return Boolean(extracted);
  };

  const safeBigInt = (value: any): bigint => {
    const extracted = extractResult(value);
    if (typeof extracted === 'bigint') return extracted;
    if (typeof extracted === 'number') return BigInt(extracted);
    if (typeof extracted === 'string') return BigInt(extracted || 0);
    return 0n;
  };

  const resultData = result.data || [];
  const isOverdue = safeBoolean(resultData[0]);
  const creditLimit = safeBigInt(resultData[1]);
  const owed = safeBigInt(resultData[2]);
  const daiBalance = safeBigInt(resultData[3]);
  const interest = safeBigInt(resultData[4]);
  const unionBalance = safeBigInt(resultData[5]);

  const data = {
    isOverdue,
    creditLimit,
    owed,
    daiBalance,
    interest,
    unionBalance,
    minPayment: owed > 0 ? calculateMinPayment(interest, token) : 0n,
  };

  return (
    <UnionMemberContext.Provider value={{
      data,
      isLoading: result.isLoading,
      isRefetching: result.isRefetching,
      refetch: result.refetch,
    }}>
      {children}
    </UnionMemberContext.Provider>
  )
}