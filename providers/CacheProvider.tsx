import React, { createContext, useContext, useState } from "react";

export interface ICacheContext {
  get: (key: string) => any;
  set: (key: string, value: any) => void;
}

const CacheContext = createContext({} as ICacheContext);

export const useCache = () => useContext(CacheContext);

export const CacheProvider = ({ children }: { children: React.ReactNode }) => {
  const [cacheItems, setCache] = useState<Record<string, any>>({});

  const set = (key: string, value: any) => {
    setCache((c) => ({ ...c, [key]: value }));
  };

  const get = (key: string) => {
    return cacheItems[key];
  };

  return (
    <CacheContext.Provider value={{ get, set }}>
      {children}
    </CacheContext.Provider>
  );
}
