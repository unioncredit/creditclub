import "./FeelingLuckyModal.scss";

import {
  Button,
  Modal,
  ModalOverlay,
  InfoBanner,
  Union,
  Text,
  PlayIcon,
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
import { FEELING_LUCKY_WINNER_MODAL } from "@/components/modals/FeelingLuckyWinnerModal.tsx";

export const FEELING_LUCKY_MODAL = "feeling-lucky-modal";

export const FeelingLuckyModal = () => {
  const { open, close } = useModals();
  const { complete, hours, minutes, seconds } = useFeelingLuckyCountdown();
  const { data: creditClub, refetch: refetchCreditClubData } = useCreditClub();
  const { costToCall } = creditClub;

  const {
    bidBucketBalance,
    bidBucketPercentage,
    callerBalance,
    callerPercentage,
    winnerBalance,
    winnerPercentage,
  } = useRewards();

  const feelingLuckyButtonProps = useWrite({
    ...clubPluginContract,
    functionName: "feelingLucky",
    value: costToCall,
    disabled: !complete,
    onComplete: async (hash) => {
      const winner = winnerBalance;
      const bidBucket = bidBucketBalance;
      const caller = callerBalance;
      await refetchCreditClubData();

      open(FEELING_LUCKY_WINNER_MODAL, {
        hash,
        winnerBalance: winner,
        bidBucketBalance: bidBucket,
        callerBalance: caller,
      })
    }
  });

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
            label={
              complete
                ? `Trigger the Raffle (${format(costToCall, 5, false, false, false)} ETH)`
                : `Callable in ${hours}h:${minutes}m:${seconds}s`
            }
            color="primary"
            size="large"
            icon={complete ? DelegateIcon : PlayIcon}
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
