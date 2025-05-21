import { Address } from "viem";

import { factoryAbi } from "@/abis/factory";

export const useFactoryContract = (address: Address) => {
  return {
    address,
    abi: factoryAbi,
  }
};