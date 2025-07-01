import { Address } from "viem";
import { useMemo } from "react";

import { auctionAbi } from "@/abis/auction";

export const useAuctionContract = (address: Address) => {
  return useMemo(() => ({
    address,
    abi: auctionAbi,
  }), [address]);
};