import { Address } from "viem";

import { rewardsManagerAbi } from "@/abis/rewardsManager";

export const useRewardsManagerContract = (address: Address) => {
  return {
    address,
    abi: rewardsManagerAbi,
  }
};