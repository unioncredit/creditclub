import { useCallback, useEffect, useState } from "react";
import { fetchClubEvents, IClubEvent } from "@/fetchers/fetchClubEvents";
import { Address, Hash } from "viem";

export const useClubActivity = (clubAddress: Address) => {
  const [data, setData] = useState<IClubEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const clubEvents = await fetchClubEvents(clubAddress);

    setData(clubEvents);
    setLoading(false);
  }, []);

  const refetch = (delay = 0) => {
    if (delay > 0) {
      // Create a proper IClubEvent object for loading state
      const loadingEvent: IClubEvent = {
        type: "LOADING",
        amount: 0n,
        address: "0x0" as Address,
        hash: "0x0" as Hash,
      };
      setData(d => [loadingEvent, ...d]);
      setTimeout(fetch, delay);
    } else {
      fetch();
    }
  }

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, refetch };
};