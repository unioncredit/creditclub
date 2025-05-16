import { useCallback, useEffect, useState } from "react";

import { useCache } from "@/providers/CacheProvider";
import { fetchHolders, Holder } from "@/fetchers/fetchHolders";
import { Address } from "viem";

export const useHolders = (clubAddress: Address) => {
  const cacheKey = "useHolders";
  const { get, set } = useCache();
  const [data, setData] = useState<Holder[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    setData([]);
    const holders = await fetchHolders(clubAddress);

    set(cacheKey, holders);
    setData(holders);
    setLoading(false);
  }, [cacheKey]);

  useEffect(() => {
    if (get(cacheKey)) {
      setData(get(cacheKey));
      setLoading(false);
      return;
    }

    loadData();
  }, [cacheKey, loadData]);

  return { data, loading, refetch: loadData };
}
