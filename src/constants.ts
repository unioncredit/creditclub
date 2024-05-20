import { Chain, optimism } from "viem/chains";

export const supportedChains: readonly [Chain, ...Chain[]] = [optimism];

const RPCS: Record<number, string> = {
  [optimism.id]: "https://opt-mainnet.g.alchemy.com/v2",
};

export const RPC_URL = (chainId: number) =>
  `${RPCS[chainId]}/${import.meta.env.VITE_ALCHEMY_API_KEY}`;
