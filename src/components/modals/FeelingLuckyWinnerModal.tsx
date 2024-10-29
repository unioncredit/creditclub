import "./FeelingLuckyWinnerModal.scss";

import {
  Modal,
  ModalOverlay,
  Union,
  Heading,
  Text,
  ButtonRow,
  Button,
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
import { useNftInfo } from "@/hooks/useNftInfo.ts";
import { useAccount } from "wagmi";
import { usePrimaryLabel } from "@/hooks/usePrimaryLabel.ts";
import { FaCamera } from "react-icons/fa";
import { useEffect, useRef } from "react";
import { createFileName, useScreenshot } from "@/hooks/useScreenshot.ts";

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
  const ref = useRef(null);
  const { close } = useModals();
  const { name } = useNftInfo();
  const { address } = useAccount();
  const { image, takeScreenShot, clearImage } = useScreenshot();

  const getImage = () => {
    if (!ref.current) {
      return;
    }

    takeScreenShot(ref.current,
      {
        useCORS: true,
      },
      (style: HTMLStyleElement) => {
        style.sheet?.insertRule(".StatRow__cube { padding-bottom: 8px }");
        style.sheet?.insertRule(".StatRow__content { padding-bottom: 8px }");
        style.sheet?.insertRule(".StatRow__value { padding-bottom: 8px }");
        style.sheet?.insertRule(".StatRow__value > svg { height: 18px; width: 30px; top: 0; vertical-align: bottom; margin-left: 0; }");

        style.sheet?.insertRule(".RandomWinnerRow__content { padding-bottom: 8px }");
        style.sheet?.insertRule(".RandomWinnerRow__value { padding-bottom: 8px }");
        style.sheet?.insertRule(".RandomWinnerRow__value > svg { height: 18px; width: 30px; top: 0; vertical-align: bottom; margin-left: 0; }");
      },
    );
  };

  const download = (iImage: any, { name = "img", extension = "png" } = {}) => {
    const a = document.createElement("a");
    a.href = iImage;
    a.download = createFileName(extension, name);
    a.click();
  };

  useEffect(() => {
    if (image) {
      download(image, { name: "feeling-lucky", extension: "png" });
      clearImage();
    }
  }, [image]);

  const { data: receiverLabel } = usePrimaryLabel({ address });

  const { data: event, isFetched } = useEventLog({
    hash,
    eventName: "RoundCompleted",
    abi: clubPluginAbi,
  });

  // @ts-ignore
  const amountWon = event?.args.amountToWinner || 0n;

  const {
    winnerPercentage,
    bidBucketPercentage,
    callerPercentage,
  } = useRewards();

  return (
    <ModalOverlay onClick={close}>
      <Modal className="FeelingLuckyModal">
        <Modal.Header title={`${name} Random Raffle`} onClose={close} />
        <Modal.Body>
          <div style={{ padding: "12px" }} ref={ref}>
            {isFetched ? (
              <Heading mb="32px" level={2} size="large" align="center">
                The {amountWon > 0n ? "lucky" : "unlucky"} winner is...
              </Heading>
            ) : (
              <Heading mb="32px" level={2} size="large" align="center">
                Picking a winner...
              </Heading>
            )}

            {isFetched && (
              <>
                <RandomWinnerRow
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
              </>
            )}

            <Text m="48px 0 12px" size="medium" weight="medium">With the remainder being sent to:</Text>

            <StatRow
              percentage={amountWon <= 0 ? `${bidBucketPercentage + winnerPercentage}%` : `${bidBucketPercentage}%`}
              title="Bid Bucket"
              content="Helps to grow club stake"
              amount={bidBucketBalance.toFixed(2)}
              color="#3B82F6"
              token={<Union />}
            />
            <StatRow
              percentage={`${callerPercentage}%`}
              title="Caller"
              content={<><span className="underline">{receiverLabel}</span> receives</>}
              amount={callerBalance.toFixed(2)}
              color="#8B5CF6"
              token={<Union />}
            />
          </div>

          <ButtonRow mt="24px">
            <Button
              fluid
              className="ScreenshotButton"
              color="secondary"
              variant="light"
              size="small"
              label="Screenshot this!"
              icon={FaCamera}
              onClick={() => getImage()}
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
};
