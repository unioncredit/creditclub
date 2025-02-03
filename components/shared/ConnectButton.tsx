import { usePrivy } from "@privy-io/react-auth";
import { useAccount, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/Button";

export const ConnectButton = () => {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connectOrCreateWallet, logout } = usePrivy();

  const disconnectWallet = async () => {
    logout().then(() => disconnect());
  };

  return (
    <Button
      variant="shadow"
      onClick={isConnected ? disconnectWallet : connectOrCreateWallet}
    >
      {isConnected ? "Disconnect" : "Connect wallet"}
    </Button>
  )
};