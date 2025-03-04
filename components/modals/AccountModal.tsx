import React from "react";
import { Address } from "viem";
import {
  Modal,
  ModalOverlay,
  CopyIcon,
  DisconnectWalletIcon,
  // @ts-ignore
} from "@unioncredit/ui";

import { useModals } from "@/providers/ModalManagerProvider";
import { useBalance, useDisconnect } from "wagmi";
import { usePrivy } from "@privy-io/react-auth";
import { Avatar } from "@/components/shared/Avatar";
import { PrimaryLabel } from "@/components/shared/PrimaryLabel";
import { formatDecimals } from "@/lib/format";
import { RoundedButton } from "@/components/ui/RoundedButton";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

export const ACCOUNT_MODAL = "account-modal";

export const AccountModal = ({
  address,
}: {
  address: Address;
}) => {
  const { close } = useModals();
  const { logout } = usePrivy();
  const { disconnect } = useDisconnect();
  const { copy, copied } = useCopyToClipboard();

  const disconnectWallet = async () => {
    logout().then(() => disconnect());
  };

  const { data: balance } = useBalance({
    address,
  });

  const { value = 0n } = balance || {};

  return (
    <ModalOverlay onClick={close}>
      <Modal>
        <Modal.Header title="Your account" onClose={close} />
        <Modal.Body>
          <div className="flex flex-col items-center justify-center">
            <Avatar address={address} size={86} className="rounded-full overflow-hidden" />

            <p className="font-medium text-lg mt-2"><PrimaryLabel address={address} /></p>
            <p className="text-sm text-stone-500">{formatDecimals(value, 18, 2)} ETH</p>
          </div>

          <div className="flex gap-2 w-full mt-4 sm:flex-col">
            <RoundedButton
              size="large"
              variant="dark"
              className="flex-1 min-h-[48px]"
              onClick={() => copy(address)}
            >
              {copied ? (
                "Copied!"
              ) : (
                <>
                  <CopyIcon width={24} className="fill" />
                  Copy address
                </>
              )}
            </RoundedButton>
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
