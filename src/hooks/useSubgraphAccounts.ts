import { IContact } from "@/providers/types.ts";
import { useEffect, useState } from "react";
import { fetchSubgraphAccounts, SubgraphAccount } from "@/fetchers/fetchSubgraphAccounts.ts";
import { Address } from "viem";
import { useAccount } from "wagmi";

export const useSubgraphAccounts = (contacts: IContact[]) => {
  const [subgraphData, setSubgraphData] = useState<Record<Address, SubgraphAccount>>({});

  const { chain: connectedChain } = useAccount();

  useEffect(() => {
    if (connectedChain?.id) {
      (async function loadData() {
        const accounts = await fetchSubgraphAccounts(connectedChain.id);
        setSubgraphData(accounts);
      })()
    }
  }, [connectedChain?.id]);

  return contacts?.map((row) => {
    const data = subgraphData[row.address];

    return {
      ...row,
      unionWon: data?.unionWon || 0n,
      unionEarned: data?.unionEarned || 0n,
    }
  });
}
