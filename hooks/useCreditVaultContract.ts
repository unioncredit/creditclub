import { Address } from "viem";
import { creditVaultAbi } from "@/abis/creditVault";

export const useCreditVaultContract = (address: Address) => {
  return {
    address,
    abi: creditVaultAbi
  }
};