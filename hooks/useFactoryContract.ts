import { Address } from "viem";
import { useMemo } from "react";

import { factoryAbi } from "@/abis/factory";

export const useFactoryContract = (address: Address) => {
  return useMemo(() => ({
    address,
    abi: factoryAbi,
  }), [address]);
};