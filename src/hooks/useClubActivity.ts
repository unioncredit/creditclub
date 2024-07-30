import { useEffect, useState } from "react";

import { useCache } from "@/providers/CacheProvider.tsx";
import { Address, zeroAddress } from "viem";
import { fetchClubEvents } from "@/fetchers/fetchClubEvents.ts";

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
      const clubEvents = await fetchClubEvents();

      set(cacheKey, clubEvents);
      setData(clubEvents);
      setLoading(false);
    }

    staker !== zeroAddress && loadData();
  }, [staker, cacheKey, get, set]);

  return { data, loading };
}
