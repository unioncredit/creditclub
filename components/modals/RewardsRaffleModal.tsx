import {
  Button,
  Modal,
  ModalOverlay,
  InfoBanner,
  Union,
  PlayIcon,
  // @ts-ignore
} from "@unioncredit/ui";

import { useModals } from "@/providers/ModalManagerProvider";
import { StatRow } from "@/components/shared/StatRow";

export const REWARDS_RAFFLE_MODAL = "feeling-lucky-modal";

export const RewardsRaffleModal = () => {
  const { close } = useModals();

  return (
    <ModalOverlay onClick={close}>
      <Modal>
        <Modal.Header title="Rewards Raffle" onClose={close} />
        <Modal.Body>
          <InfoBanner
            align="left"
            variant="warning"
            label="Calling feeling lucky distributes unclaimed UNION in the below ratios & moves LP fees into the vault."
            className="text-xs p-3 bg-blue-50 text-blue-600 absolute top-[80px] left-0 right-0"
          />

          <StatRow
            percentage="50%"
            title="Random Trustee"
            content="Registered & Not Overdue"
            amount="1,000"
            color="#F4F4F6"
            token={<Union />}
            className="mt-12"
          />
          <StatRow
            percentage="50%"
            title="Random Trustee"
            content="Registered & Not Overdue"
            amount="1,000"
            color="#F4F4F6"
            token={<Union />}
            className="mt-2"
          />
          <StatRow
            percentage="50%"
            title="Random Trustee"
            content="Registered & Not Overdue"
            amount="1,000"
            color="#F4F4F6"
            token={<Union />}
            className="mt-2"
          />

          <Button
            fluid
            className="mt-4"
            label="Trigger the raffle"
            color="primary"
            size="large"
            icon={PlayIcon}
          />

          {/*{!complete && (*/}
          {/*  <Text color="red500" m="8px 0 0" weight="light">*/}
          {/*    You must wait for the cooldown to finish*/}
          {/*  </Text>*/}
          {/*)}*/}
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
