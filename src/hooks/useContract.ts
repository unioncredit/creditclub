import { DEFAULT_CHAIN } from "@/constants.ts";
import { useAccount } from "wagmi";
import { base, optimism } from "viem/chains";
import {
  assetManagerContract as BaseAssetManagerContract,
  clubNftContract as BaseClubNftContract,
  clubPluginContract as BaseClubPluginContract,
  comptrollerContract as BaseComptrollerContract,
  rewardsManagerContract as BaseRewardsManagerContract,
  unionContract as BaseUnionContract,
  unionLensContract as BaseUnionLensContract,
  usdcContract as BaseTokenContract,
  userManagerContract as BaseUserManagerContract,
  uTokenContract as BaseUTokenContract,
} from "@/contracts/base.ts";
import {
  assetManagerContract as OptimismAssetManagerContract,
  clubNftContract as OptimismClubNftContract,
  clubPluginContract as OptimismClubPluginContract,
  comptrollerContract as OptimismComptrollerContract,
  rewardsManagerContract as OptimismRewardsManagerContract,
  unionContract as OptimismUnionContract,
  unionLensContract as OptimismUnionLensContract,
  daiContract as OptimismTokenContract,
  userManagerContract as OptimismUserManagerContract,
  uTokenContract as OptimismUTokenContract,
} from "@/contracts/optimism.ts";

type ContractName ="userManager"
  | "token"
  | "unionLens"
  | "uToken"
  | "clubPlugin"
  | "clubNft"
  | "comptroller"
  | "assetManager"
  | "union"
  | "rewardsManager"

export const useContract = (contract: ContractName) => {
  const { chain: connectedChain = DEFAULT_CHAIN } = useAccount();
  
  const contracts: Record<number, any> = {
    [base.id]: {
      userManager: BaseUserManagerContract,
      token: BaseTokenContract,
      unionLens: BaseUnionLensContract,
      uToken: BaseUTokenContract,
      clubPlugin: BaseClubPluginContract,
      clubNft: BaseClubNftContract,
      comptroller: BaseComptrollerContract,
      assetManager: BaseAssetManagerContract,
      union: BaseUnionContract,
      rewardsManager: BaseRewardsManagerContract,
    },
    [optimism.id]: {
      userManager: OptimismUserManagerContract,
      token: OptimismTokenContract,
      unionLens: OptimismUnionLensContract,
      uToken: OptimismUTokenContract,
      clubPlugin: OptimismClubPluginContract,
      clubNft: OptimismClubNftContract,
      comptroller: OptimismComptrollerContract,
      assetManager: OptimismAssetManagerContract,
      union: OptimismUnionContract,
      rewardsManager: OptimismRewardsManagerContract,
    }
  };

  return contracts[connectedChain.id]?.[contract] || {};
};