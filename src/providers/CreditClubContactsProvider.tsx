import { chunk } from "lodash";
import { useAccount, useReadContracts } from "wagmi";
import React, { createContext, useContext } from "react";

import { CREDITCLUB_SAFE_ADDRESS, DEFAULT_CHAIN } from "@/constants";
import { ICreditClubContactsProviderReturnType } from "@/providers/types";
import useRelatedAddresses from "@/hooks/useRelatedAddresses";
import { usePopulateEns } from "@/hooks/usePopulateEns.ts";
import { usePopulateFnames } from "@/hooks/usePopulateFnames.ts";
import { useSubgraphAccounts } from "@/hooks/useSubgraphAccounts.ts";
import { useContract } from "@/hooks/useContract.ts";

const CreditClubContactsContext = createContext({} as ICreditClubContactsProviderReturnType);

export const useContacts = () => useContext(CreditClubContactsContext);

export const CreditClubContactsProvider = ({ children }: { children: React.ReactNode; }) => {
  const { chain: connectedChain = DEFAULT_CHAIN } = useAccount();

  const chainId = connectedChain.id;
  const safeAddress = CREDITCLUB_SAFE_ADDRESS[chainId];
  const unionLensContract = useContract("unionLens");
  const userManagerContract = useContract("userManager");
  const uTokenContract = useContract("uToken");
  const tokenContract = useContract("token");

  const {
    borrowerAddresses,
    refetch: refetchAddresses,
  } = useRelatedAddresses(safeAddress);

  const contracts = borrowerAddresses.reduce((curr, borrower) => ([
    ...curr,
    {
      ...unionLensContract,
      functionName: "getRelatedInfo",
      args: [tokenContract.address, safeAddress, borrower],
    },
    {
      ...userManagerContract,
      functionName: "checkIsMember",
      args: [borrower],
    },
    {
      ...uTokenContract,
      functionName: "checkIsOverdue",
      args: [borrower],
    },
    {
      ...uTokenContract,
      functionName: "getLastRepay",
      args: [borrower],
    },
  ]), [] as any[]);

  const result = useReadContracts(({
    contracts,
  }));

  const results = result.data?.map(d => d.result) || [];
  const chunked = chunk(results, 4) as any[];

  const data = chunked.map((d, i) => ({
    address: borrowerAddresses[i],
    locking: d[0].voucher.locked,
    trust: d[0].voucher.trust,
    vouch: d[0].voucher.vouch,
    isMember: d[1],
    isOverdue: d[2],
    lastRepay: d[3],
    unionWon: 0n,
    unionEarned: 0n,
  }));

  const refetch = async () => {
    await refetchAddresses();
    await result.refetch();
  };

  const ensPopulated = usePopulateEns(data);
  const fnamePopulated = usePopulateFnames(ensPopulated);
  const subgraphPopulated = useSubgraphAccounts(fnamePopulated);

  return (
    <CreditClubContactsContext.Provider value={{ ...result, refetch, data: subgraphPopulated }}>
      {children}
    </CreditClubContactsContext.Provider>
  )
}