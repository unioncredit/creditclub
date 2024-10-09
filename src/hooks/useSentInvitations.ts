import { useCallback, useEffect, useState } from "react";

import { Address } from "viem";
import { fetchInvitations, IInvitation } from "@/fetchers/fetchInvitations.ts";
import { useCache } from "@/providers/CacheProvider.tsx";

export const useSentInvitations = ({ sender }: { sender?: Address; }) => {
  const cacheKey = `useSentInvitations__${sender}`;
  const { get, set } = useCache();
  const [data, setData] = useState<IInvitation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!sender) return;
    setLoading(true);
    setData([]);
    const invitations = await fetchInvitations({
      sender: sender.toLowerCase(),
    });

    set(cacheKey, invitations);
    setData(invitations);
    setLoading(false);
  }, [cacheKey, sender]);

  useEffect(() => {
    if (get(cacheKey)) {
      setData(get(cacheKey));
      setLoading(false);
      return;
    }

    loadData();
  }, [cacheKey, sender, loadData]);

  return { data, loading, refetch: loadData };
}
