import "./BidBucketModal.scss";

import {
  Modal,
  ModalOverlay,
  InfoBanner,
  Union,
  Dai,
  CheckIcon,
  ArrowRightIcon,
  // @ts-ignore
} from "@unioncredit/ui";
import { useModals } from "@/providers/ModalManagerProvider.tsx";
import { StatRow } from "@/components/modals/StatRow.tsx";
import { useCreditClub } from "@/providers/CreditClubDataProvider.tsx";
import { useMember } from "@/providers/ConnectedMemberProvider.tsx";
import { format } from "@/utils/format.ts";
import { ApprovalButton } from "@/components/shared/ApprovalButton.tsx";
import { useAccount } from "wagmi";
import { clubPluginContract, daiContract } from "@/contracts/optimism.ts";

export const BID_BUCKET_MODAL = "bid-bucket-modal";

export const BidBucketModal = () => {
  const { close } = useModals();
  const { address } = useAccount();
  const { data: creditClub, refetch } = useCreditClub();
  const { data: member } = useMember();

  const { publicBidPrice, memberBidPrice, bidBucketBalance } = creditClub;
  const { isMember } = member;

  const bidPrice = isMember ? memberBidPrice : publicBidPrice;

  return (
    <ModalOverlay onClick={close}>
      <Modal className="BidBucketModal">
        <Modal.Header title="Bid Bucket" onClose={close} />

        <Modal.Body>
          <InfoBanner
            mb="12px"
            align="left"
            variant="warning"
            label="The Bid Bucket is UNION tokens set aside that anyone can bid on in exchange for adding DAI to the clubs total stake. Members can bid 100 DAI and the public can bid 200 DAI"
          />

          <div className="mb-4">
            <StatRow
              title="Your Bid"
              content="What you send"
              amount={format(bidPrice, 0)}
              token={<Dai />}
            />

            <ArrowRightIcon className="ArrowRightIcon" />

            <StatRow
              title="Bid Bucket"
              content="What you receive"
              amount={format(bidBucketBalance)}
              token={<Union />}
            />
          </div>

          <ApprovalButton
            owner={address}
            amount={bidPrice}
            spender={clubPluginContract.address}
            tokenContract={daiContract}
            actionProps={{
              ...clubPluginContract,
              functionName: "fixedBid",
              label: "Place Bid",
              icon: CheckIcon,
              onComplete: async () => {
                close();
                await refetch();
              }
            }}
          />
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
};
