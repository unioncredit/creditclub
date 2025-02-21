import {
  Button,
  Modal,
  ModalOverlay,
  InfoBanner,
  Union,
  PlayIcon,
  // @ts-ignore
} from "@unioncredit/ui";
import { Address } from "viem";

import { useModals } from "@/providers/ModalManagerProvider";
import { StatRow } from "@/components/shared/StatRow";
import { useRewards } from "@/hooks/useRewards";
import { useWrite } from "@/hooks/useWrite";
import { useCreditVaultContract } from "@/hooks/useCreditVaultContract";
import { useClubData } from "@/hooks/useClubData";
import { useRaffleCooldown } from "@/hooks/useRaffleCooldown";
import { format } from "@/lib/format";
import { TOKENS } from "@/constants";

export const REWARDS_RAFFLE_MODAL = "feeling-lucky-modal";

export const RewardsRaffleModal = ({
  clubAddress
}: {
  clubAddress: Address;
}) => {
  const { close } = useModals();
  const { data: clubData } = useClubData(clubAddress);
  const { complete, hours, minutes, seconds } = useRaffleCooldown(clubAddress);
  const {
    bidBucketBalance,
    bidBucketPercentage,
    callerBalance,
    callerPercentage,
    winnerBalance,
    winnerPercentage,
  } = useRewards(clubAddress);

  const { costToCall } = clubData;

  const creditVaultContract = useCreditVaultContract(clubAddress);

  const triggerRaffleButtonProps = useWrite({
    ...creditVaultContract,
    functionName: "feelingLucky",
    value: costToCall,
    disabled: !complete,
    icon: PlayIcon,
  });

  return (
    <ModalOverlay onClick={close}>
      <Modal>
        <Modal.Header title="Rewards Raffle" onClose={close} />
        <Modal.Body>
          <InfoBanner
            align="left"
            variant="warning"
            label="Calling feeling lucky distributes unclaimed UNION in the below ratios & moves LP fees into the vault."
            className="font-mono text-xs p-3 bg-blue-50 text-blue-600 absolute top-[80px] left-0 right-0"
          />

          <StatRow
            percentage={`${winnerPercentage}%`}
            title="Random Trustee"
            content="Registered & Not Overdue"
            amount={winnerBalance.toFixed(2)}
            color="#F4F4F6"
            token={<Union />}
            className="mt-12 sm:mt-16"
          />
          <StatRow
            percentage={`${bidBucketPercentage}%`}
            title="Credit Vault"
            content="Saved for a rainy day"
            amount={bidBucketBalance.toFixed(2)}
            color="#F4F4F6"
            token={<Union />}
            className="mt-2"
          />
          <StatRow
            percentage={`${callerPercentage}%`}
            title="Caller Reward"
            content="This goes to you"
            amount={callerBalance.toFixed(2)}
            color="#F4F4F6"
            token={<Union />}
            className="mt-2"
          />

          <Button
            label={
              complete
                ? `Trigger the Raffle (${format(costToCall, TOKENS.UNION, 5, false, false, false)} ETH)`
                : `Callable in ${hours}h:${minutes}m:${seconds}s`
            }
            fluid
            className="mt-4"
            color="primary"
            size="large"
            {...triggerRaffleButtonProps}
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
