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

  const [
    isOverdue = false,
    creditLimit = 0n,
    owed = 0n,
    daiBalance = 0n,
    interest = 0n,
    unionBalance = 0n,
  ] = result.data?.map(d => d.result as never) || [];

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
    <UnionMemberContext.Provider value={{ ...result, data }}>
      {children}
    </UnionMemberContext.Provider>
  )
}