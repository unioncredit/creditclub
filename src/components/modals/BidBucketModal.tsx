import "./BidBucketModal.scss";

import {
  Text,
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
import { useClubData } from "@/providers/CreditClubDataProvider.tsx";
import { useClubMember } from "@/providers/CreditClubMemberProvider.tsx";
import { format } from "@/utils/format.ts";
import { ApprovalButton } from "@/components/shared/ApprovalButton.tsx";
import { useAccount } from "wagmi";
import { clubPluginContract, daiContract } from "@/contracts/optimism.ts";
import { MIN_REQUIRED_BID_BUCKET_BALANCE } from "@/constants.ts";

export const BID_BUCKET_MODAL = "bid-bucket-modal";

export const BidBucketModal = () => {
  const { close } = useModals();
  const { address } = useAccount();
  const { data: creditClub, refetch } = useClubData();
  const { data: member } = useClubMember();

  const { publicBidPrice, memberBidPrice, bidBucketBalance } = creditClub;
  const { isMember } = member;

  const bidPrice = isMember ? memberBidPrice : publicBidPrice;
  const canBid = bidBucketBalance > MIN_REQUIRED_BID_BUCKET_BALANCE;

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
              disabled: !canBid,
              onComplete: async () => {
                close();
                await refetch();
              }
            }}
          />

          {!canBid && (
            <Text color="red500" m="8px 0 0" weight="light">
              The bid bucket balance must be greater than {format(MIN_REQUIRED_BID_BUCKET_BALANCE, 0)} to bid.
            </Text>
          )}
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
};
