import { useAccount } from "wagmi";

import { DEFAULT_CHAIN_ID } from "@/constants";

export const useSupportedNetwork = () => {
  const { chain: connectedChain } = useAccount();

  return {
    data: connectedChain?.id === DEFAULT_CHAIN_ID,
  }
};