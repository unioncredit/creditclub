import { useQuery } from "@tanstack/react-query";
import { Address, zeroAddress } from "viem";

import { TokenPricingResponse } from "@/pages/api/[address]/token";

export const useTokenPriceData = (address: Address) => {
  return useQuery<TokenPricingResponse>({
    enabled: !!address && address !== zeroAddress,
    staleTime: 120_000,
    queryKey: ["useTokenPriceData", address],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/${address}/token`);

      if (response.status === 200 || response.status === 304) {
        return response.json();
      }

      return {
        address: zeroAddress,
        name: "",
        symbol: "",
        decimals: 0,
        price: 0,
        fdv: 0,
        volume_24h: 0,
        market_cap: 0,
      };
    },
    initialDataUpdatedAt: -1,
    initialData: {
      address: zeroAddress,
      name: "",
      symbol: "",
      decimals: 0,
      price: 0,
      fdv: 0,
      volume_24h: 0,
      market_cap: 0,
    },
  });
};