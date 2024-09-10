import { useAccount, useReadContracts } from "wagmi";
import React, { createContext, useContext } from "react";

import { IUnionMemberContext } from "@/providers/types";
import {
  daiContract,
  userManagerContract, uTokenContract,
} from "@/contracts/optimism";
import { zeroAddress } from "viem";
import { calculateMinPayment } from "@/utils/numbers.ts";

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
      {
        ...daiContract,
        functionName: "balanceOf",
        args: [address],
      },
      {
        ...uTokenContract,
        functionName: "calculatingInterest",
        args: [address],
      },
    ],
  });

  const [
    isOverdue = false,
    creditLimit = 0n,
    owed = 0n,
    daiBalance = 0n,
    interest = 0n,
  ] = result.data?.map(d => d.result as never) || [];

  const data = {
    isOverdue,
    creditLimit,
    owed,
    daiBalance,
    interest,
    minPayment: owed > 0 ? calculateMinPayment(interest) : 0n,
  };

  return (
    <UnionMemberContext.Provider value={{ ...result, data }}>
      {children}
    </UnionMemberContext.Provider>
  )
}