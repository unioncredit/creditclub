// @ts-ignore
import { ChevronIcon, WalletIcon } from "@unioncredit/ui";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount } from "wagmi";

import { RoundedButton } from "@/components/ui/RoundedButton";
import { Avatar } from "@/components/shared/Avatar";
import { useModals } from "@/providers/ModalManagerProvider";
import { ACCOUNT_MODAL } from "@/components/modals/AccountModal";

export const ConnectButton = () => {
  const { open: openModal } = useModals();
  const { address, isConnected } = useAccount();
  const { connectOrCreateWallet } = usePrivy();

  return (
    <RoundedButton
      variant="dark"
      onClick={
        isConnected
          ? () => openModal(ACCOUNT_MODAL, { address })
          : connectOrCreateWallet
      }
      icon={!isConnected && <WalletIcon width={24} className="fill fill-white" />}
    >
      {!address ? (
        "Connect"
      ) : (
        <>
          <Avatar address={address} size={28} className="rounded-full overflow-hidden" />
          <ChevronIcon width={24} className="fill text-slate-200 -mr-2" />
        </>
      )}
    </RoundedButton>
  )
};