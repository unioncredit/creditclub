// @ts-ignore
import { WalletIcon, CalendarIcon, Input, Usdc, Modal, ModalOverlay, SegmentedControl } from "@unioncredit/ui";
import { Address } from "viem";

import { PresalePanel } from "@/components/modals/panels/PresalePanel";
import { useClubData } from "@/hooks/useClubData";
import { useClubAuction } from "@/hooks/useClubAuction";
import { RefundPresalePanel } from "@/components/modals/panels/RefundPresalePanel";
import { useModals } from "@/providers/ModalManagerProvider";

export const PRESALE_MODAL = "presale-modal";

export const PresaleModal = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const { close } = useModals();
  const { data: clubData } = useClubData(clubAddress);
  const { data: auctionData } = useClubAuction(clubAddress);

  const { symbol: clubTokenSymbol } = clubData;

  const { isKilled, isFailed } = auctionData;

  return (
    <ModalOverlay onClick={close}>
      <Modal>
        <Modal.Header title={`$${clubTokenSymbol} Presale`} onClose={close} />
        <Modal.Body>
          {isKilled || isFailed ? (
            <RefundPresalePanel clubAddress={clubAddress} />
          ) : (
            <PresalePanel clubAddress={clubAddress} />
          )}
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
