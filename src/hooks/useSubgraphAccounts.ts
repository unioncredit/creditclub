import { IContact } from "@/providers/types.ts";
import { useEffect, useState } from "react";
import { fetchSubgraphAccounts, SubgraphAccount } from "@/fetchers/fetchSubgraphAccounts.ts";
import { Address } from "viem";
import { DEFAULT_CHAIN_ID } from "@/constants.ts";

export const useSubgraphAccounts = (contacts: IContact[]) => {
  const [subgraphData, setSubgraphData] = useState<Record<Address, SubgraphAccount>>({});

  useEffect(() => {
    (async function loadData() {
      const accounts = await fetchSubgraphAccounts(DEFAULT_CHAIN_ID);
      setSubgraphData(accounts);
    })()
  }, []);

  return contacts?.map((row) => {
    const data = subgraphData[row.address];

    return {
      ...row,
      unionWon: data?.unionWon || 0n,
      unionEarned: data?.unionEarned || 0n,
    }
  });
}
