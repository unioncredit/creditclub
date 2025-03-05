import React from "react";
import { Address } from "viem";
import { useDisconnect } from "wagmi";
import { usePrivy } from "@privy-io/react-auth";
import {
  Modal,
  ModalOverlay,
  DisconnectWalletIcon,
  // @ts-ignore
} from "@unioncredit/ui";

import { useModals } from "@/providers/ModalManagerProvider";
import { Avatar } from "@/components/shared/Avatar";
import { PrimaryLabel } from "@/components/shared/PrimaryLabel";
import { RoundedButton } from "@/components/ui/RoundedButton";
import { AddressDisplay } from "@/components/shared/AddressDisplay";

export const ACCOUNT_MODAL = "account-modal";

export const AccountModal = ({
  address,
}: {
  address: Address;
}) => {
  const { close } = useModals();
  const { logout } = usePrivy();
  const { disconnect } = useDisconnect();

  const disconnectWallet = async () => {
    logout().then(() => disconnect());
  };

  return (
    <ModalOverlay onClick={close}>
      <Modal>
        <Modal.Header title="Your account" onClose={close} />
        <Modal.Body>
          <div className="flex flex-col items-center justify-center">
            <Avatar address={address} size={86} className="rounded-full overflow-hidden" />

            <p className="font-medium text-lg mt-2 mb-1"><PrimaryLabel address={address} /></p>
            <AddressDisplay address={address} className="ml-[16px]" />
          </div>

          <div className="flex gap-2 w-full mt-4 sm:flex-col">
            <RoundedButton
              size="large"
              variant="dark"
              className="flex-1 min-h-[48px]"
              onClick={() => disconnectWallet().then(close)}
            >
              <DisconnectWalletIcon width={24} className="fill" />
              Disconnect
            </RoundedButton>
          </div>
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
