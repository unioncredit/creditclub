import "./ClubActivity.scss";

import React from "react";
import {
  Card,
  EmptyState,
  BorrowIcon,
  RepayIcon,
  ConfettiIcon,
  WithdrawIcon,
} from "@unioncredit/ui";
import { useClubActivity } from "@/hooks/useClubActivity.ts";
import { CREDITCLUB_SAFE_ADDRESS, TransactionTypes } from "@/constants.ts";
import { AddressLink } from "@/components/shared/AddressLink.tsx";
import { Address } from "viem";

// prettier-ignore
const texts = {
  [TransactionTypes.TRUST]:     (x: any) => <><AddressLink address={x.borrower} /> · <span className="text-gray-500">Joined the club!</span></>,

  // [TransactionTypes.CANCEL]:    (x: any) => <>Cancel vouch <Address address={x.borrower} /></>,
  // [TransactionTypes.BORROW]:    () => <>Borrow</>,
  // [TransactionTypes.REPAY]:     () => <>Repayment</>,
  // [TransactionTypes.TRUSTED]:   (x) => <>Trusted by <Address address={x.staker} /></>,
};

const types = {
  [TransactionTypes.TRUST]: "win",
};

const ActivityRow = ({
 amount,
 type,
 staker,
 borrower
}: {
  type: "trust";
  amount: bigint;
  staker: Address;
  borrower: Address;
}) => {
  const icons = {
    [TransactionTypes.TRUST]: ConfettiIcon,
  };

  const Icon = icons[type];
  const text = texts[type]({ amount, staker, borrower });

  return (
    <div className="ActivityRow">
      <Icon />
      <p className="text-lg font-medium text-gray-800">
        {text}
      </p>
    </div>
  );
};

export const ClubActivity = () => {
  const { data: activity } = useClubActivity({ staker: CREDITCLUB_SAFE_ADDRESS });

  return (
    <div className="ClubActivity mt-6 text-left p-6 justify-self-end">
      <h2 className="text-xl font-bold">Latest Club Activity</h2>

      <div className="ClubActivity__rows mt-12">
        {activity.length <= 0 ? (
          <Card.Body>
            <EmptyState label="No activity to show" />
          </Card.Body>
        ) : (
          activity.map((tx: any) => (
            <ActivityRow {...tx}>
              {texts[tx.type]}
            </ActivityRow>
          ))
        )}
        {/*<ActivityRow type="repay">*/}
        {/*  sashbear.eth <span className="text-gray-500">Repaid</span> 244.44 DAI*/}
        {/*</ActivityRow>*/}
        {/*<ActivityRow type="borrow">*/}
        {/*  sashbear.eth <span className="text-gray-500">Borrowed</span> 242.12 DAI*/}
        {/*</ActivityRow>*/}
        {/*<ActivityRow type="transfer">*/}
        {/*  sashbear.eth <span className="text-gray-500">Transferred to</span> 0xb3...342a*/}
        {/*</ActivityRow>*/}
      </div>
    </div>
  );
};