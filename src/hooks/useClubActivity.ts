import { useEffect, useState } from "react";

import { useCache } from "@/providers/CacheProvider.tsx";
import { fetchUserTransactions } from "@/fetchers/fetchUserTransactions";
import { fetchUTokenTransactions } from "@/fetchers/fetchUTokenTransactions";
import { Address, zeroAddress } from "viem";

export const useClubActivity = ({ staker = zeroAddress }: { staker: Address; }) => {
  const cacheKey = `useTxHistory__${staker}`;
  const { get, set } = useCache();
  const [data, setData] = useState(get(cacheKey) || []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (get(cacheKey)) {
        setData(get(cacheKey));
        setLoading(false);
        return;
      }

      setData([]);
      const utokenTransactions = await fetchUTokenTransactions(staker);
      const userTransactions = await fetchUserTransactions(staker);

      const txHistory = [...utokenTransactions, ...userTransactions].sort(
        (a, b) => Number(b.timestamp) - Number(a.timestamp)
      );

      set(cacheKey, txHistory);
      setData(txHistory);
      setLoading(false);
    }

    staker !== zeroAddress && loadData();
  }, [staker, cacheKey, get, set]);

  return { data, loading };
}
