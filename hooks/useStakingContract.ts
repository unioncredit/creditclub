import { Address } from "viem";
import { useMemo } from "react";

import { stakingAbi } from "@/abis/staking";

export const useStakingContract = (address: Address) => {
  return useMemo(() => ({
    address,
    abi: stakingAbi,
  }), [address]);
};