import { base, baseSepolia } from "viem/chains";

import { DEFAULT_CHAIN_ID } from "@/constants";

import {
  userManagerContract as BaseSepoliaUserManagerContract,
  usdcContract as BaseSepoliaUsdcContract,
  uTokenContract as BaseSepoliaUTokenContract,
  unionContract as BaseSepoliaUnionContract,
  comptrollerContract as BaseSepoliaComptrollerContract,
  unionLensContract as BaseSepoliaUnionLensContract,
} from "@/contracts/baseSepolia";

import {
  userManagerContract as BaseUserManagerContract,
  usdcContract as BaseUsdcContract,
  uTokenContract as BaseUTokenContract,
  unionContract as BaseUnionContract,
  comptrollerContract as BaseComptrollerContract,
  unionLensContract as BaseUnionLensContract,
} from "@/contracts/base";

type ContractName = "userManager"
  | "token"
  | "uToken"
  | "union"
  | "comptroller"
  | "unionLens";

export const useContract = (contract: ContractName) => {
  console.log('🔍 useContract called:', {
    contract,
    DEFAULT_CHAIN_ID,
  });
  
  const contracts: Record<number, any> = {
    [baseSepolia.id]: {
      userManager: BaseSepoliaUserManagerContract,
      token: BaseSepoliaUsdcContract,
      uToken: BaseSepoliaUTokenContract,
      union: BaseSepoliaUnionContract,
      comptroller: BaseSepoliaComptrollerContract,
      unionLens: BaseSepoliaUnionLensContract,
    },
    [base.id]: {
      userManager: BaseUserManagerContract,
      token: BaseUsdcContract,
      uToken: BaseUTokenContract,
      union: BaseUnionContract,
      comptroller: BaseComptrollerContract,
      unionLens: BaseUnionLensContract,
    }
  };

  const result = contracts[DEFAULT_CHAIN_ID]?.[contract] || {};
  
  console.log('🔍 useContract returning:', {
    contract,
    hasContract: !!result.address,
    address: result.address,
  });
  
  return result;
};