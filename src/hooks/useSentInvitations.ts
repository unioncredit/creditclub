import { useCallback, useEffect, useState } from "react";

import { Address, zeroAddress } from "viem";
import { fetchInvitations, IInvitation } from "@/fetchers/fetchInvitations.ts";
import { useCache } from "@/providers/CacheProvider.tsx";
import { useAccount } from "wagmi";
import { DEFAULT_CHAIN } from "@/constants.ts";

export const useSentInvitations = ({ sender }: { sender?: Address; }) => {
  const cacheKey = `useSentInvitations__${sender}`;
  const { get, set } = useCache();
  const [data, setData] = useState<IInvitation[]>([]);
  const [loading, setLoading] = useState(true);

  const { chain: connectedChain = DEFAULT_CHAIN } = useAccount();

  const loadData = useCallback(async () => {
    if (!sender || !connectedChain?.id) return;
    setLoading(true);
    setData([]);
    const invitations = await fetchInvitations(connectedChain.id, {
      sender: sender.toLowerCase(),
    });

    set(cacheKey, invitations);
    setData(invitations);
    setLoading(false);
  }, [cacheKey, sender, connectedChain?.id]);

  const addInvite = (receiver: Address | null) => {
    if (!receiver) return;

    const invite: IInvitation = {
      id: "",
      sender: zeroAddress,
      receiver,
      timestamp: Date.now() / 1000,
      block: 0n,
    }

    const newData = [invite, ...data];
    set(cacheKey, newData);
    setData(newData);
  }

  useEffect(() => {
    if (get(cacheKey)) {
      setData(get(cacheKey));
      setLoading(false);
      return;
    }

    loadData();
  }, [cacheKey, sender, loadData]);

  return { data, loading, refetch: loadData, addInvite };
}
