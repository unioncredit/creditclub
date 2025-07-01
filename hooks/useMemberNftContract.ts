import { Address } from "viem";
import { useMemo } from "react";

import { memberNftAbi } from "@/abis/memberNft";

export const useMemberNftContract = (address: Address) => {
  return useMemo(() => ({
    address,
    abi: memberNftAbi,
  }), [address]);
};