import {
  Button,
  Modal,
  ModalOverlay,
  Usdc,
  Input,
  SegmentedControl,
  // @ts-ignore
} from "@unioncredit/ui";

import { useModals } from "@/providers/ModalManagerProvider";
import { SendReceivePanel } from "@/components/shared/SendReceivePanel";
import { useState } from "react";

export const MINT_REDEEM_MODAL = "mint-redeem-modal";

export const MintRedeemModal = ({
  activeTab,
}: {
  activeTab: "mint" | "redeem";
}) => {
  const [tab, setTab] = useState<"mint" | "redeem">(activeTab);

  const { close } = useModals();

  console.log({ tab });

  const action = tab === "mint" ? "Mint" : "Redeem";

  return (
    <ModalOverlay onClick={close}>
      <Modal>
        <Modal.Header title={`${action} {token} ({symbol})`} onClose={close} />
        <Modal.Body>
          <SegmentedControl
            value={tab}
            initialActive={0}
            onChange={(value: { id: "mint" | "redeem" }) => setTab(value.id)}
            items={[
              {
                id: "mint",
                label: "Mint",
              },
              {
                id: "redeem",
                label: "Redeem",
              },
            ]}
          />

          <Input
            type="number"
            name="amount"
            label={`${action} Amount`}
            rightLabel={`Max. 4,000.00 USDC`}
            rightLabelAction={() => alert(0)}
            suffix={<Usdc />}
            placeholder="0.0"
            className="mt-4"
          />

          <SendReceivePanel
            className="mt-4"
            leftPanel={{
              title: "What you send",
              value: "$100",
              icon: <Usdc />,
            }}
            rightPanel={{
              title: "What you receive",
              value: "$1,143.96",
            }}
          />

          <Button
            fluid
            className="mt-4"
            label={`${action} 2000 BC Tokens`}
            color="primary"
            size="large"
          />
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
