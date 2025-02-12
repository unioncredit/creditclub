import { baseSepolia } from "viem/chains";

import { DEFAULT_CHAIN_ID } from "@/constants";

import {
  userManagerContract as BaseSepoliaUserManagerContract,
  usdcContract as BaseSepoliaUsdcContract,
  uTokenContract as BaseSepoliaUTokenContract,
  unionContract as BaseSepoliaUnionContract,
  comptrollerContract as BaseSepoliaComptrollerContract,
  unionLensContract as BaseSepoliaUnionLensContract,
} from "@/contracts/baseSepolia";

type ContractName = "userManager"
  | "token"
  | "uToken"
  | "union"
  | "comptroller"
  | "unionLens";

export const useContract = (contract: ContractName) => {
  const contracts: Record<number, any> = {
    [baseSepolia.id]: {
      userManager: BaseSepoliaUserManagerContract,
      token: BaseSepoliaUsdcContract,
      uToken: BaseSepoliaUTokenContract,
      union: BaseSepoliaUnionContract,
      comptroller: BaseSepoliaComptrollerContract,
      unionLens: BaseSepoliaUnionLensContract,
    },
  };

  return contracts[DEFAULT_CHAIN_ID]?.[contract] || {};
};