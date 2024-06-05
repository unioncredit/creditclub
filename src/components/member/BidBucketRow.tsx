import "./BidBucketRow.scss";

import {
  Button,
  DaiIcon,
  WithdrawIcon,
  ArrowRightIcon,
  UnionIcon,
  // @ts-ignore
} from "@unioncredit/ui";

import { IconCube } from "@/components/shared/IconCube.tsx";
import { useModals } from "@/providers/ModalManagerProvider.tsx";
import { BID_BUCKET_MODAL } from "@/components/modals/BidBucketModal.tsx";
import { useCreditClub } from "@/providers/CreditClubDataProvider.tsx";
import { useMember } from "@/providers/ConnectedMemberProvider.tsx";
import { format } from "@/utils/format.ts";
import cn from "classnames";

export const BidBucketRow = () => {
  const { open } = useModals();
  const { data: creditClub } = useCreditClub();
  const { data: member } = useMember();

  const { memberBidPrice, bidBucketBalance } = creditClub;
  const { isMember } = member;

  return (
    <div className={cn("BidBucketRow flex justify-between mt-4 sm:flex-col", {
      "blur-sm pointer-events-none": !isMember,
    })}>
      <div className="BidBucketStat flex flex-1 justify-center items-center mr-2 sm:mr-0 sm:mb-2">
        <div className="BidBucketStat__dai">
          <p>Bid {format(memberBidPrice, 0)}</p>
          <DaiIcon />
        </div>
        <ArrowRightIcon />
        <div className="BidBucketStat__union">
          <p>{format(bidBucketBalance)}</p>
          <UnionIcon />
        </div>
      </div>

      <Button
        disabled={!isMember}
        onClick={() => open(BID_BUCKET_MODAL)}
        label={
          <span className="flex items-center">
            <IconCube color="#FFD8CC" icon={WithdrawIcon} width={24} height={24} />
            <p className="ml-2 text-md" style={{ color: "#FF7A4F" }}>Bid Bucket</p>
          </span>
        }
        color="secondary"
        variant="light"
      />
    </div>
  );
}