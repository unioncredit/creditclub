import { useSwitchChain } from "wagmi";

import { DEFAULT_CHAIN, DEFAULT_CHAIN_ID } from "@/constants";
import { RoundedButton } from "@/components/ui/RoundedButton";

export const WrongNetworkBanner = () => {
  const { switchChain } = useSwitchChain();

  return (
    <div className="mt-4 bg-yellow-50 py-2 px-3 border border-yellow-600 rounded-lg flex justify-center items-center gap-4">
      <p className="text-yellow-600 text-center">
        You must be connected to {DEFAULT_CHAIN.name} to interact with this club
      </p>

      <RoundedButton
        size="small"
        variant="light"
        className="text-xs border-primary h-[28px]"
        onClick={() => switchChain({ chainId: DEFAULT_CHAIN_ID })}
      >
        Switch
      </RoundedButton>
    </div>
  )
};