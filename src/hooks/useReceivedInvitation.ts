import { Address } from "viem";
import { useCallback, useEffect, useState } from "react";

import { fetchInvitations, IInvitation } from "@/fetchers/fetchInvitations.ts";
import { useCache } from "@/providers/CacheProvider.tsx";
import { DEFAULT_CHAIN_ID } from "@/constants.ts";

export const useReceivedInvitation = ({ receiver }: { receiver?: Address; }) => {
  const cacheKey = `useReceivedInvitation__${receiver}`;
  const { get, set } = useCache();
  const [data, setData] = useState<IInvitation | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!receiver) return;
    setLoading(true);
    setData(null);
    const invitations = await fetchInvitations(DEFAULT_CHAIN_ID, {
      receiver: receiver.toLowerCase(),
    });

    const result = invitations.length > 0 ? invitations[0] : null;

    set(cacheKey, result);
    setData(result);
    setLoading(false);
  }, [cacheKey, receiver]);

  useEffect(() => {
    if (get(cacheKey)) {
      console.log("using cached data");
      setData(get(cacheKey));
      setLoading(false);
      return;
    }

    loadData();
  }, [cacheKey, receiver, loadData]);

  return { data, loading, refetch: loadData };
}
