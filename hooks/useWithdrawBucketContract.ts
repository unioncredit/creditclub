import { Address } from "viem";
import { useMemo } from "react";

import { withdrawBucketAbi } from "@/abis/withdrawBucket";

export const useWithdrawBucketContract = (address: Address) => {
  return useMemo(() => ({
    address,
    abi: withdrawBucketAbi,
  }), [address]);
};