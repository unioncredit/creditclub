import { useAccount, useReadContracts } from "wagmi";
import React, { createContext, useContext } from "react";

import { IUnionMemberContext } from "@/providers/types";
import {
  userManagerContract, uTokenContract,
} from "@/contracts/optimism";
import { zeroAddress } from "viem";

const UnionMemberContext = createContext({} as IUnionMemberContext);

export const useUnionMember = () => useContext(UnionMemberContext);

export const UnionMemberProvider = ({ children }: { children: React.ReactNode; }) => {
  const { address = zeroAddress } = useAccount();

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
    ],
  });

  const [
    isOverdue = false,
    creditLimit = 0n,
    owed = 0n,
  ] = result.data?.map(d => d.result as never) || [];

  const data = {
    isOverdue,
    creditLimit,
    owed,
  };

  return (
    <UnionMemberContext.Provider value={{ ...result, data }}>
      {children}
    </UnionMemberContext.Provider>
  )
}