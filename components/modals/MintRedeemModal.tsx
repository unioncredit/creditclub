// @ts-ignore
import { Modal, ModalOverlay, SegmentedControl } from "@unioncredit/ui";
import { Address } from "viem";
import { useState } from "react";

import { useClubData } from "@/hooks/useClubData";
import { MintPanel } from "@/components/modals/panels/MintPanel";
import { useModals } from "@/providers/ModalManagerProvider";
import { RedeemPanel } from "@/components/modals/panels/RedeemPanel";

export const MINT_REDEEM_MODAL = "mint-redeem-modal";

export const MintRedeemModal = ({
  activeTab,
  clubAddress,
}: {
  activeTab: "mint" | "redeem";
  clubAddress: Address;
}) => {
  const [tab, setTab] = useState<"mint" | "redeem">(activeTab);

  const { close } = useModals();
  const { data: clubData } = useClubData(clubAddress);

  const { symbol: clubTokenSymbol, raiseOver } = clubData;

  const action = tab === "mint" ? "Mint" : "Redeem";

  return (
    <ModalOverlay onClick={close}>
      <Modal>
        <Modal.Header title={`${action} ${clubTokenSymbol}`} onClose={close} />
        <Modal.Body>
          <SegmentedControl
            value={tab}
            initialActive={0}
            onChange={(value: { id: "mint" | "redeem" }) => setTab(value.id)}
            items={[
              {
                id: "mint",
                label: "Mint",
                disabled: raiseOver,
              },
              {
                id: "redeem",
                label: "Redeem",
              },
            ]}
          />

          {tab === "mint" ? (
            <MintPanel clubAddress={clubAddress} />
          ) : (
            <RedeemPanel clubAddress={clubAddress} />
          )}
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
