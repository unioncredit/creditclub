import { useAccount, useReadContracts } from "wagmi";
import React, { createContext, useContext } from "react";

import { IConnectedMemberContext } from "@/providers/types";
import {
  clubNftContract, userManagerContract,
} from "@/contracts/optimism";
import { zeroAddress } from "viem";
import { CREDITCLUB_SAFE_ADDRESS } from "@/constants.ts";

const ConnectedMemberContext = createContext({} as IConnectedMemberContext);

export const useMember = () => useContext(ConnectedMemberContext);

export const ConnectedMemberProvider = ({ children }: { children: React.ReactNode; }) => {
  const { address = zeroAddress } = useAccount();

  const result = useReadContracts({
    contracts: [
      {
        ...clubNftContract,
        functionName: 'balanceOf',
        args: [address],
      },
      {
        ...clubNftContract,
        functionName: 'tokenOfOwnerByIndex',
        args: [address, 0n],
      },
      {
        ...userManagerContract,
        functionName: 'getLockedStake',
        args: [CREDITCLUB_SAFE_ADDRESS, address],
      },
    ],
  });

  const [
    balanceOf = 0n,
    tokenId,
    owed = 0n,
  ] = result.data?.map(d => d.result as never) || [];

  const data = {
    isMember: balanceOf > 0n,
    tokenBalance: balanceOf,
    tokenId,
    owed,
  };

  return (
    <ConnectedMemberContext.Provider value={{ ...result, data }}>
      {children}
    </ConnectedMemberContext.Provider>
  )
}