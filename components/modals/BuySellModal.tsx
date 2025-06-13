import { useState } from "react";
import { Address } from "viem";
import {
  Modal,
  ModalOverlay,
  SegmentedControl
  // @ts-ignore
} from "@unioncredit/ui";
import { useModals } from "@/providers/ModalManagerProvider";
import { useClubData } from "@/hooks/useClubData";
import { capitalize } from "@/lib/utils";
import { BuyPanel } from "@/components/modals/panels/BuyPanel";
import { SellPanel } from "@/components/modals/panels/SellPanel";

export const BUY_SELL_MODAL = "buy-sell-modal";

export const BuySellModal = ({
  initialTab,
  clubAddress,
}: {
  initialTab: "buy" | "sell";
  clubAddress: Address;
}) => {
  const [tab, setTab] = useState<"buy" | "sell">(initialTab);

  const { close } = useModals();
  const { data: clubData } = useClubData(clubAddress);

  const { symbol } = clubData;

  return (
    <ModalOverlay onClick={close}>
      <Modal className="BuySellModal">
        <Modal.Header title={`${capitalize(tab)} $${symbol}`} onClose={close} />
        <Modal.Body>
          <SegmentedControl
            value={tab}
            initialActive={0}
            onChange={(value: { id: "buy" | "sell" }) => setTab(value.id)}
            items={[
              {
                id: "buy",
                label: "Buy",
              },
              {
                id: "sell",
                label: "Sell",
              },
            ]}
          />

          {tab === "buy"
            ? <BuyPanel clubAddress={clubAddress} />
            : <SellPanel clubAddress={clubAddress} />
          }
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  )
};