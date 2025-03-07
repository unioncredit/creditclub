// @ts-ignore
import { ChevronIcon, WalletIcon } from "@unioncredit/ui";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount } from "wagmi";

import { RoundedButton } from "@/components/ui/RoundedButton";
import { Avatar } from "@/components/shared/Avatar";
import { useModals } from "@/providers/ModalManagerProvider";
import { ACCOUNT_MODAL } from "@/components/modals/AccountModal";
import { PrimaryLabel } from "@/components/shared/PrimaryLabel";

export const ConnectButton = () => {
  const { open: openModal } = useModals();
  const { address, isConnected } = useAccount();
  const { connectWallet } = usePrivy();

  return (
    <RoundedButton
      variant={isConnected ? "light" : "dark"}
      className={isConnected ? "px-3 text-sm gap-2" : undefined}
      onClick={
        isConnected
          ? () => openModal(ACCOUNT_MODAL, { address })
          : connectWallet
      }
      icon={!isConnected && <WalletIcon width={24} className="fill fill-white" />}
    >
      {!address ? (
        "Connect"
      ) : (
        <>
          <Avatar address={address} size={28} className="rounded-full overflow-hidden" />
          <PrimaryLabel address={address} />
        </>
      )}
    </RoundedButton>
  )
};