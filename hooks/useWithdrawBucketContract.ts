import { Address } from "viem";

import { withdrawBucketAbi } from "@/abis/withdrawBucket";

export const useWithdrawBucketContract = (address: Address) => {
  return {
    address,
    abi: withdrawBucketAbi,
  }
};