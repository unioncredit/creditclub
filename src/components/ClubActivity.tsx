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

const ActivityRow = ({
  type,
  children,
}: {
  type: "borrow" | "repay" | "transfer" | "win",
  children: React.ReactNode,
}) => {
  const icons = {
    "borrow": BorrowIcon,
    "repay": RepayIcon,
    "transfer": WithdrawIcon,
    "win": ConfettiIcon,
  };

  const Icon = icons[type];

  return (
    <div className="ActivityRow">
      <Icon />
      <p className="text-lg font-medium text-gray-800">{children}</p>
    </div>
  );
};

export const ClubActivity = () => {
  return (
    <div className="ClubActivity mt-6 text-left p-6 justify-self-end">
      <h2 className="text-xl font-bold">Latest Club Activity</h2>

      <div className="ClubActivity__rows mt-12">
        <Card.Body>
          <EmptyState label="No activity to show" />
        </Card.Body>
        {/*<ActivityRow type="repay">*/}
        {/*  sashbear.eth <span className="text-gray-500">Repaid</span> 244.44 DAI*/}
        {/*</ActivityRow>*/}
        {/*<ActivityRow type="borrow">*/}
        {/*  sashbear.eth <span className="text-gray-500">Borrowed</span> 242.12 DAI*/}
        {/*</ActivityRow>*/}
        {/*<ActivityRow type="transfer">*/}
        {/*  sashbear.eth <span className="text-gray-500">Transferred to</span> 0xb3...342a*/}
        {/*</ActivityRow>*/}
        {/*<ActivityRow type="win">*/}
        {/*  <span className="text-gray-500">Won by</span> sashbear.eth · 0xb3...342a*/}
        {/*</ActivityRow>*/}
      </div>
    </div>
  );
};