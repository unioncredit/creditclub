import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

import { IClubActivityContext } from "@/providers/types.ts";
import { fetchClubEvents, IClubEvent } from "@/fetchers/fetchClubEvents.ts";
import { useAccount } from "wagmi";

const ClubActivityContext = createContext({} as IClubActivityContext);

export const useClubActivity = () => useContext(ClubActivityContext);

export const ClubActivityProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<IClubEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const { chain: connectedChain } = useAccount();

  const fetch = useCallback(async () => {
    if (connectedChain) {
      setLoading(true);
      const clubEvents = await fetchClubEvents(connectedChain.id);

      setData(clubEvents);
      setLoading(false);
    }
  }, [connectedChain]);

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

  return (
    <ClubActivityContext.Provider value={{ data, loading, refetch }}>
      {children}
    </ClubActivityContext.Provider>
  );
}
