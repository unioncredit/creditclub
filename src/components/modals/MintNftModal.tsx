import "./MintNftModal.scss";

import {
  Text,
  Modal,
  ModalOverlay,
  InfoBanner,
  Dai,
  ArrowRightIcon,
  // @ts-ignore
} from "@unioncredit/ui";
import { useModals } from "@/providers/ModalManagerProvider.tsx";
import { StatRow } from "@/components/modals/StatRow.tsx";
import { format, formattedNumber } from "@/utils/format.ts";
import { useAccount } from "wagmi";
import { useMemberCredit } from "@/hooks/useMemberCredit.ts";
import { useVesting } from "@/hooks/useVesting.ts";
import { useNftInfo } from "@/hooks/useNftInfo.ts";
import { MintMemberNftMultichain } from "@/components/shared/MintMemberNftMultichain.tsx";

export const MINT_NFT_MODAL = "mint-nft-modal";

export const MintNftModal = () => {
  const { close } = useModals();
  const { isConnected } = useAccount();
  const { new: creditPerMember } = useMemberCredit();
  const { name } = useNftInfo();

  const { data: vestingData } = useVesting();
  const { startingPercentage, duration } = vestingData;

  return (
    <ModalOverlay onClick={close}>
      <Modal className="MintNftModal">
        <Modal.Header title={`Mint ${name} membership`} onClose={close} />

        <InfoBanner
          align="left"
          variant="warning"
          label="Your entry fee is added to the club stake to back yours and fellow members Credit."
        />

        <Modal.Body>
          <div>
            <StatRow
              title="Starting Credit Limit"
              content={`You start at ${startingPercentage * 100}% vested`}
              amount={(formattedNumber(creditPerMember) * startingPercentage).toFixed(2)}
              token={<Dai />}
            />

            <StatRow
              title="Full Membership"
              content={`Credit limit after ${duration} days`}
              amount={format(creditPerMember)}
              token={<Dai />}
            />

            <ArrowRightIcon className="ArrowRightIcon" />
          </div>

          <MintMemberNftMultichain />

          {!isConnected && (
            <Text color="red500" m="8px 0 0" weight="light">
              Your wallet must be connected to mint
            </Text>
          )}
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
};
