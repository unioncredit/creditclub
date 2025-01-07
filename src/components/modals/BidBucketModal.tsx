import "./BidBucketModal.scss";

import {
  Text,
  Modal,
  ModalOverlay,
  InfoBanner,
  Union,
  Usdc,
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
import { MIN_REQUIRED_BID_BUCKET_BALANCE, TOKENS } from "@/constants.ts";
import { useUnionMember } from "@/providers/UnionMemberProvider.tsx";
import { useContract } from "@/hooks/useContract.ts";
import { useToken } from "@/hooks/useToken.ts";

export const BID_BUCKET_MODAL = "bid-bucket-modal";

export const BidBucketModal = () => {
  const { close } = useModals();
  const { token } = useToken();
  const { address } = useAccount();
  const { data: creditClub, refetch } = useClubData();
  const { data: member } = useClubMember();
  const { data: unionMember } = useUnionMember();

  const clubPluginContract = useContract("clubPlugin");
  const tokenContract = useContract("token");

  const { publicBidPrice, memberBidPrice, bidBucketBalance } = creditClub;
  const { isMember } = member;
  const { daiBalance } = unionMember;

  const bidPrice = isMember ? memberBidPrice : publicBidPrice;
  const isMinimumRequired = bidBucketBalance > MIN_REQUIRED_BID_BUCKET_BALANCE;
  const canBid = daiBalance > bidPrice;

  return (
    <ModalOverlay onClick={close}>
      <Modal className="BidBucketModal">
        <Modal.Header title="Bid Bucket" onClose={close} />

        <Modal.Body>
          <InfoBanner
            mb="12px"
            align="left"
            variant="warning"
            label={`The Bid Bucket is UNION tokens set aside that anyone can bid on in exchange for adding ${token} to the clubs total stake. Members can bid 100 ${token} and the public can bid 200 ${token}`}
          />

          <div className="mb-4">
            <StatRow
              title="Your Bid"
              content="What you send"
              amount={format(bidPrice, token, 0)}
              token={<Usdc />}
            />

            <ArrowRightIcon className="ArrowRightIcon" />

            <StatRow
              title="Bid Bucket"
              content="What you receive"
              amount={format(bidBucketBalance, TOKENS.UNION)}
              token={<Union />}
            />
          </div>

          <ApprovalButton
            owner={address}
            amount={bidPrice}
            disabled={daiBalance < bidPrice}
            spender={clubPluginContract.address}
            tokenContract={tokenContract}
            actionProps={{
              ...clubPluginContract,
              functionName: "fixedBid",
              label: canBid ? "Place Bid" : "Insufficient funds",
              icon: canBid && CheckIcon,
              disabled: !isMinimumRequired || !canBid,
              onComplete: async () => {
                close();
                await refetch();
              }
            }}
          />

          {!isMinimumRequired && (
            <Text color="red500" m="8px 0 0" weight="light">
              The bid bucket balance must be greater than {format(MIN_REQUIRED_BID_BUCKET_BALANCE, TOKENS.UNION, 0)} to bid.
            </Text>
          )}
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
};
