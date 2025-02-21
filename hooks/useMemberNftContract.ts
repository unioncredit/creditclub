import { Address } from "viem";

import { memberNftAbi } from "@/abis/memberNft";

export const useMemberNftContract = (address: Address) => {
  return {
    address,
    abi: memberNftAbi,
  }
};