import "./ClubActivity.scss";

import {
  Card,
  EmptyState,
  ConfettiIcon,
  WithdrawIcon,
  DepositIcon,
  IncreaseVouchIcon,
  VouchIcon,
  // @ts-ignore
} from "@unioncredit/ui";

import { useClubActivity } from "@/hooks/useClubActivity.ts";
import { CREDITCLUB_SAFE_ADDRESS, TransactionTypes } from "@/constants.ts";
import { AddressLink } from "@/components/shared/AddressLink.tsx";
import { Address, Hash } from "viem";
import { format } from "@/utils/format.ts";

// prettier-ignore
const texts = {
  [TransactionTypes.JOINED_CLUB]: (x: any) => (
    <>
      <AddressLink address={x.address} /> ·
      <a href={`https://optimistic.etherscan.io/tx/${x.hash}`} target="_blank" rel="noopener">
        <span className="text-gray-500">was invited!</span>
      </a>
    </>
  ),
  [TransactionTypes.INVITATION_EVENT]: (x: any) => (
    <>
      <AddressLink address={x.address} /> ·
      <a href={`https://optimistic.etherscan.io/tx/${x.hash}`} target="_blank" rel="noopener">
        <span className="text-gray-500">Joined the club!</span>
      </a>
    </>
  ),
  [TransactionTypes.BORROWED]: (x: any) => (
    <>
      <AddressLink address={x.address} /> ·
      <a href={`https://optimistic.etherscan.io/tx/${x.hash}`} target="_blank" rel="noopener">
        <span className="text-gray-500">Borrowed</span> {format(x.amount, 0)} DAI
      </a>
    </>
  ),
  [TransactionTypes.REPAID]: (x: any) => (
    <>
      <AddressLink address={x.address} /> ·
      <a href={`https://optimistic.etherscan.io/tx/${x.hash}`} target="_blank" rel="noopener">
        <span className="text-gray-500">Repaid</span> {format(x.amount, 0)} DAI
      </a>
    </>
  ),
  [TransactionTypes.UPDATED_TRUST]: (x: any) => (
    <>
      <AddressLink address={x.address} /> ·
      <a href={`https://optimistic.etherscan.io/tx/${x.hash}`} target="_blank" rel="noopener">
        <span className="text-gray-500">Updated trust</span> {format(x.amount, 0)} DAI
      </a>
    </>
  ),
  [TransactionTypes.ROUND_WON]: (x: any) => (
    <>
      <AddressLink address={x.address} /> ·
      <a href={`https://optimistic.etherscan.io/tx/${x.hash}`} target="_blank" rel="noopener">
        <span className="text-gray-500">Won</span> {format(x.amount, 0)} UNION
      </a>
    </>
  ),
};

const ActivityRow = ({
  amount,
  type,
  address,
  hash,
}: {
  type: "trust";
  amount: bigint;
  address: Address;
  hash: Hash;
}) => {
  const icons = {
    [TransactionTypes.JOINED_CLUB]: ConfettiIcon,
    [TransactionTypes.BORROWED]: WithdrawIcon,
    [TransactionTypes.REPAID]: DepositIcon,
    [TransactionTypes.UPDATED_TRUST]: IncreaseVouchIcon,
    [TransactionTypes.ROUND_WON]: ConfettiIcon,
    [TransactionTypes.INVITATION_EVENT]: VouchIcon,
  };

  const Icon = icons[type];
  const text = texts[type]({ type, amount, address, hash });

  return (
    <div className="ActivityRow">
      <Icon />
      <p className="text-lg font-medium text-gray-800">
        {/* @ts-ignore */}
        {text}
      </p>
    </div>
  );
};

export const ClubActivity = () => {
  const { data: activity } = useClubActivity({ staker: CREDITCLUB_SAFE_ADDRESS });

  return (
    <div className="ClubActivity mt-6 text-left p-6 justify-self-end sm:p-4">
      <header className="ClubActivity__header">
        <h2 className="text-xl font-bold">Latest Club Activity</h2>
      </header>

      <div className="ClubActivity__rows sm:mt-6">
        {activity.length <= 0 ? (
          <Card.Body>
            <EmptyState label="No activity to show" />
          </Card.Body>
        ) : (
          activity.slice(0, 4).map((tx: any) => (
            <ActivityRow {...tx} />
          ))
        )}
      </div>
    </div>
  );
};