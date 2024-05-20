import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const Homepage = () => {
  const { address } = useAccount();

  return (
    <div className="flex flex-col items-center">
      <ConnectButton />
      <p className="mt-8">{address || "Not connected"}</p>
    </div>
  )
};