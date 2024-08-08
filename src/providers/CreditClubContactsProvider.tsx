import { chunk } from "lodash";
import { useReadContracts } from "wagmi";
import React, { createContext, useContext } from "react";

import { CREDITCLUB_SAFE_ADDRESS } from "@/constants";
import { ICreditClubContactsProviderReturnType } from "@/providers/types";
import useRelatedAddresses from "@/hooks/useRelatedAddresses";
import { daiContract, unionLensContract, userManagerContract, uTokenContract } from "@/contracts/optimism";
import { usePopulateEns } from "@/hooks/usePopulateEns.ts";
import { usePopulateFnames } from "@/hooks/usePopulateFnames.ts";
import { useSubgraphAccounts } from "@/hooks/useSubgraphAccounts.ts";

const CreditClubContactsContext = createContext({} as ICreditClubContactsProviderReturnType);

export const useContacts = () => useContext(CreditClubContactsContext);

export const CreditClubContactsProvider = ({ children }: { children: React.ReactNode; }) => {
  const {
    borrowerAddresses,
    refetch: refetchAddresses,
  } = useRelatedAddresses(CREDITCLUB_SAFE_ADDRESS);

  const contracts = borrowerAddresses.reduce((curr, borrower) => ([
    ...curr,
    {
      ...unionLensContract,
      functionName: "getRelatedInfo",
      args: [daiContract.address, CREDITCLUB_SAFE_ADDRESS, borrower],
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

  const subgraphPopulated = useSubgraphAccounts(data);
  const ensPopulated = usePopulateEns(subgraphPopulated);
  const fnamePopulated = usePopulateFnames(ensPopulated);

  return (
    <CreditClubContactsContext.Provider value={{ ...result, refetch, data: fnamePopulated }}>
      {children}
    </CreditClubContactsContext.Provider>
  )
}