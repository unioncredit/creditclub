import { useCallback, useEffect, useState } from "react";
import { fetchClubEvents, IClubEvent } from "@/fetchers/fetchClubEvents";
import { DEFAULT_CHAIN_ID } from "@/constants";

export const useClubActivity = () => {
  const [data, setData] = useState<IClubEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const clubEvents = await fetchClubEvents();

    setData(clubEvents);
    setLoading(false);
  }, []);

  const refetch = (delay = 0) => {
    if (delay > 0) {
      // @ts-ignore
      setData(d => [{ type: "LOADING" }, ...d]);
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