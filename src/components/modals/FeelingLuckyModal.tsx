import "./FeelingLuckyModal.scss";

import {
  Button,
  Modal,
  ModalOverlay,
  InfoBanner,
  Union,
  Text,
  DelegateIcon,
  // @ts-ignore
} from "@unioncredit/ui";
import { useModals } from "@/providers/ModalManagerProvider";
import { StatRow } from "@/components/modals/StatRow";
import { useRewards } from "@/hooks/useRewards";
import { useWrite } from "@/hooks/useWrite.ts";
import { clubPluginContract } from "@/contracts/optimism.ts";
import { useCreditClub } from "@/providers/CreditClubDataProvider.tsx";
import { format } from "@/utils/format.ts";
import { useFeelingLuckyCountdown } from "@/hooks/useFeelingLuckyCountdown.ts";

export const FEELING_LUCKY_MODAL = "feeling-lucky-modal";

export const FeelingLuckyModal = () => {
  const { close } = useModals();
  const { complete } = useFeelingLuckyCountdown();
  const { data: creditClub } = useCreditClub();
  const { costToCall } = creditClub;

  const feelingLuckyButtonProps = useWrite({
    ...clubPluginContract,
    functionName: "feelingLucky",
    value: costToCall,
    disabled: !complete,
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
            label={`Trigger the Raffle (${format(costToCall, 5, false, false, false)} ETH)`}
            color="primary"
            size="large"
            icon={DelegateIcon}
            className="FeelingLuckyButton"
          />

          {!complete && (
            <Text color="red500" m="8px 0 0" weight="light">
              You must wait for the cooldown to finish
            </Text>
          )}
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
