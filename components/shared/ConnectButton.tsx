// @ts-ignore
import { WalletIcon } from "@unioncredit/ui";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount, useDisconnect } from "wagmi";

import { RoundedButton } from "@/components/ui/RoundedButton";

export const ConnectButton = () => {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connectOrCreateWallet, logout } = usePrivy();

  const disconnectWallet = async () => {
    logout().then(() => disconnect());
  };

  return (
    <RoundedButton
      variant="dark"
      onClick={isConnected ? disconnectWallet : connectOrCreateWallet}
      icon={!isConnected && <WalletIcon width={24} className="fill fill-white" />}
    >
      {isConnected ? "Disconnect" : "Connect"}
    </RoundedButton>
  )
};