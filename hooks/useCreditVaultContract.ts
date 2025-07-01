import { Address } from "viem";
import { creditVaultAbi } from "@/abis/creditVault";
import { useMemo } from "react";

export const useCreditVaultContract = (address: Address) => {
  return useMemo(() => ({
    address,
    abi: creditVaultAbi,
  }), [address]);
};