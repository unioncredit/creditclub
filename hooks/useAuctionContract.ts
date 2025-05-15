import { Address } from "viem";

import { auctionAbi } from "@/abis/auction";

export const useAuctionContract = (address: Address) => {
  return {
    address,
    abi: auctionAbi,
  }
};