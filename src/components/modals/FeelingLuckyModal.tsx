import "./FeelingLuckyModal.scss";

import {
  Button,
  Modal,
  ModalOverlay,
  InfoBanner,
  Union,
  DelegateIcon,
  // @ts-ignore
} from "@unioncredit/ui";
import { useModals } from "@/providers/ModalManagerProvider";
import { StatRow } from "@/components/modals/StatRow";
import { useRewards } from "@/hooks/useRewards";
import { useWrite } from "@/hooks/useWrite.ts";
import { clubPluginContract } from "@/contracts/optimism.ts";
import { useCreditClub } from "@/providers/CreditClubDataProvider.tsx";

export const FEELING_LUCKY_MODAL = "feeling-lucky-modal";

export const FeelingLuckyModal = () => {
  const { close } = useModals();
  const { data: creditClub } = useCreditClub();
  const { costToCall } = creditClub;

  const feelingLuckyButtonProps = useWrite({
    ...clubPluginContract,
    functionName: "feelingLucky",
    value: costToCall,
  });

  const {
    bidBucketBalance,
    bidBucketPercentage,
    callerBalance,
    callerPercentage,
    winnerBalance,
    winnerPercentage,
  } = useRewards();

  return (
    <ModalOverlay onClick={close}>
      <Modal className="FeelingLuckyModal">
        <Modal.Header title="Feeling Lucky Distribution" onClose={close} />
        <Modal.Body>
          <StatRow
            percentage={`${winnerPercentage}%`}
            title="Random Trustee"
            content="Registered & Not Overdue"
            amount={winnerBalance.toFixed(2)}
            color="#F59E0B"
            token={<Union />}
          />
          <StatRow
            percentage={`${bidBucketPercentage}%`}
            title="Bid Bucket"
            content="Saved for a rainy day"
            amount={bidBucketBalance.toFixed(2)}
            color="#3B82F6"
            token={<Union />}
          />
          <StatRow
            percentage={`${callerPercentage}%`}
            title="Caller"
            content="In Exchange for calling"
            amount={callerBalance.toFixed(2)}
            color="#8B5CF6"
            token={<Union />}
          />

          <InfoBanner
            align="left"
            variant="warning"
            label="You will pay ~$1 worth of ETH and distribute UNION in the above ratio."
          />

          <Button
            {...feelingLuckyButtonProps}
            fluid
            mt="12px"
            label="Trigger the Raffle (0.00042 ETH)"
            color="primary"
            size="large"
            icon={DelegateIcon}
          />
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
