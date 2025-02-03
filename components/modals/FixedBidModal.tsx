import {
  Button,
  Modal,
  ModalOverlay,
  InfoBanner,
  Usdc,
  // @ts-ignore
} from "@unioncredit/ui";

import { useModals } from "@/providers/ModalManagerProvider";
import { SendReceivePanel } from "@/components/shared/SendReceivePanel";

export const FIXED_BID_MODAL = "fixed-bid-modal";

export const FixedBidModal = () => {
  const { close } = useModals();

  return (
    <ModalOverlay onClick={close}>
      <Modal>
        <Modal.Header title="Club Rewards Fixed Bid" onClose={close} />
        <Modal.Body>
          <InfoBanner
            align="left"
            variant="warning"
            label="Buying the UNION from the club helps the club grow its stake :)"
            className="text-sm p-3 bg-blue-50 text-blue-600 absolute top-[80px] left-0 right-0"
          />

          <SendReceivePanel
            className="mt-14"
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
            label="Pay {amount} {asset}"
            color="primary"
            size="large"
          />
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
