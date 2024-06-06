import { useAccount } from "wagmi";
import { supportedChains } from "@/constants.ts";

export const useIsSupportedNetwork = () => {
  const { chain } = useAccount();

  return chain && supportedChains.includes(chain);
}