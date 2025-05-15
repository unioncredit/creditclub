import { Address } from "viem";

import { stakingAbi } from "@/abis/staking";

export const useStakingContract = (address: Address) => {
  return {
    address,
    abi: stakingAbi,
  }
};