import { Chain, optimism } from "viem/chains";
import { Address } from "viem";

export const supportedChains: readonly [Chain, ...Chain[]] = [optimism];

const RPCS: Record<number, string> = {
  [optimism.id]: "https://opt-mainnet.g.alchemy.com/v2",
};

export const RPC_URL = (chainId: number) =>
  `${RPCS[chainId]}/${import.meta.env.VITE_ALCHEMY_API_KEY}`;

export const CREDITCLUB_SAFE_ADDRESS: Address = "0x87349040756ed552f3ba7e2fcc3d11ec66475156";
