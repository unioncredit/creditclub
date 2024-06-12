import "./FeelingLuckyWinnerModal.scss";

import {
  Modal,
  ModalOverlay,
  Union,
  Heading,
  Text,
  ButtonRow,
  Button,
  CopyIcon,
  LinkOutIcon,
  InfoBanner,
  // @ts-ignore
} from "@unioncredit/ui";
import { useModals } from "@/providers/ModalManagerProvider";
import { StatRow } from "@/components/modals/StatRow";
import { useRewards } from "@/hooks/useRewards";
import { RandomWinnerRow } from "@/components/modals/RandomWinnerRow.tsx";
import { zeroAddress } from "viem";
import { clubPluginAbi } from "@/abis/clubPlugin.ts";
import { useEventLog } from "@/hooks/useEventLog.ts";

export const FEELING_LUCKY_WINNER_MODAL = "feeling-lucky-winner-modal";

export const FeelingLuckyWinnerModal = ({
  hash,
  winnerBalance,
  bidBucketBalance,
  callerBalance,
}: {
  hash: `0x${string}`;
  winnerBalance: number;
  bidBucketBalance: number;
  callerBalance: number;
}) => {
  const { close } = useModals();

  const event = useEventLog({
    hash,
    eventName: "RoundCompleted",
    abi: clubPluginAbi,
  })

  // @ts-ignore
  const amountWon = event?.args.amountToWinner || 0n;

  const {
    bidBucketPercentage,
    callerPercentage,
  } = useRewards();

  return (
    <ModalOverlay onClick={close}>
      <Modal className="FeelingLuckyModal">
        <Modal.Header title="BCC Club Random Raffle" onClose={close} />
        <Modal.Body>
          <Heading mb="32px" level={2} size="large" align="center">
            The {amountWon > 0n ? "lucky" : "unlucky"} winner is...
          </Heading>

          <RandomWinnerRow
            title="Random Trustee"
            amount={amountWon <= 0n ? 0 : winnerBalance}
            // @ts-ignore
            address={event?.args?.winner || zeroAddress}
          />

          {amountWon <= 0n && (
            <InfoBanner
              align="center"
              variant="warning"
              label="Sadly, the winner is in default or not registered so they get 0."
            />
          )}

          <Text m="48px 0 12px" size="medium">With the remainder being sent to:</Text>

          <StatRow
            percentage={`${bidBucketPercentage}%`}
            title="Bid Bucket"
            content="Accrues to help grow club stake"
            amount={bidBucketBalance.toFixed(2)}
            color="#3B82F6"
            token={<Union />}
          />
          <StatRow
            percentage={`${callerPercentage}%`}
            title="Caller"
            content="For calling the tx you receive"
            amount={callerBalance.toFixed(2)}
            color="#8B5CF6"
            token={<Union />}
          />

          <ButtonRow mt="24px">
            <Button
              fluid
              color="secondary"
              variant="light"
              size="small"
              label="Screenshot this!"
              icon={CopyIcon}
              style={{ pointerEvents: "none" }}
            />
            <Button
              fluid
              size="small"
              label="Etherscan"
              icon={LinkOutIcon}
              onClick={() => open(`https://optimistic.etherscan.io/tx/${hash}`)}
            />
          </ButtonRow>
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
