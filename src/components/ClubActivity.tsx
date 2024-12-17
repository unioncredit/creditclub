import "./ClubActivity.scss";

import {
  Card,
  EmptyState,
  ConfettiIcon,
  WithdrawIcon,
  DepositIcon,
  IncreaseVouchIcon,
  VouchIcon,
  Skeleton,
  WalletIcon,
  // @ts-ignore
} from "@unioncredit/ui";

import { ActivityTypes, IToken, TOKENS } from "@/constants.ts";
import { AddressLink } from "@/components/shared/AddressLink.tsx";
import { Address, Hash } from "viem";
import { format } from "@/utils/format.ts";
import { useClubActivity } from "@/providers/ClubActivityProvider.tsx";
import { IClubEvent, IClubEventType } from "@/fetchers/fetchClubEvents.ts";
import { useToken } from "@/hooks/useToken.ts";

// prettier-ignore
const texts = {
  [ActivityTypes.LOADING]: () => (
    <Skeleton width={320} height={28} shimmer />
  ),
  [ActivityTypes.JOINED_CLUB]: (x: IClubEvent) => (
    <>
      <AddressLink address={x.address} /> ·
      <a href={`https://optimistic.etherscan.io/tx/${x.hash}`} target="_blank" rel="noopener">
        <span className="text-gray-500"> Joined the club!</span>
      </a>
    </>
  ),
  [ActivityTypes.INVITATION_EVENT]: (x: IClubEvent) => (
    <>
      <AddressLink address={x.address} /> ·
      <a href={`https://optimistic.etherscan.io/tx/${x.hash}`} target="_blank" rel="noopener">
        <span className="text-gray-500"> Invited to club!</span>
      </a>
    </>
  ),
  [ActivityTypes.BORROWED]: (x: IClubEvent, token: IToken) => (
    <>
      <AddressLink address={x.address} /> ·
      <a href={`https://optimistic.etherscan.io/tx/${x.hash}`} target="_blank" rel="noopener">
        <span className="text-gray-500"> Borrowed</span> {format(x.amount, token, 0)} {token}
      </a>
    </>
  ),
  [ActivityTypes.REPAID]: (x: IClubEvent, token: IToken) => (
    <>
      <AddressLink address={x.address} /> ·
      <a href={`https://optimistic.etherscan.io/tx/${x.hash}`} target="_blank" rel="noopener">
        <span className="text-gray-500"> Repaid</span> {format(x.amount, token, 0)} {token}
      </a>
    </>
  ),
  [ActivityTypes.UPDATED_TRUST]: (x: IClubEvent, token: IToken) => (
    <>
      <AddressLink address={x.address} /> ·
      <a href={`https://optimistic.etherscan.io/tx/${x.hash}`} target="_blank" rel="noopener">
        <span className="text-gray-500"> Updated trust</span> {format(x.amount, token, 0)} {token}
      </a>
    </>
  ),
  [ActivityTypes.ROUND_WON]: (x: IClubEvent) => (
    <>
      <AddressLink address={x.address} /> ·
      <a href={`https://optimistic.etherscan.io/tx/${x.hash}`} target="_blank" rel="noopener">
        <span className="text-gray-500"> Won</span> {format(x.amount, TOKENS.UNION, 0)} UNION
      </a>
    </>
  ),
  [ActivityTypes.BID_PLACED]: (x: IClubEvent) => (
    <>
      <AddressLink address={x.address} /> ·
      <a href={`https://optimistic.etherscan.io/tx/${x.hash}`} target="_blank" rel="noopener">
        <span className="text-gray-500"> Bucket Won</span> {format(x.amount, TOKENS.UNION, 0)} UNION
      </a>
    </>
  ),
};

const ActivityRow = ({
  token,
  amount,
  type,
  address,
  hash,
}: {
  token: IToken;
  type: IClubEventType;
  amount: bigint;
  address: Address;
  hash: Hash;
}) => {
  const icons = {
    [ActivityTypes.LOADING]: null,
    [ActivityTypes.JOINED_CLUB]: ConfettiIcon,
    [ActivityTypes.BORROWED]: WithdrawIcon,
    [ActivityTypes.REPAID]: DepositIcon,
    [ActivityTypes.UPDATED_TRUST]: IncreaseVouchIcon,
    [ActivityTypes.ROUND_WON]: ConfettiIcon,
    [ActivityTypes.INVITATION_EVENT]: VouchIcon,
    [ActivityTypes.BID_PLACED]: WalletIcon,
  };

  const Icon = icons[type];
  const text = texts[type]({ type, amount, address, hash }, token);

  return (
    <div className="ActivityRow">
      {Icon && <Icon />}
      <p className="text-lg font-medium text-gray-800">
        {/* @ts-ignore */}
        {text}
      </p>
    </div>
  );
};

export const ClubActivity = () => {
  const { token } = useToken();
  const { data: activity } = useClubActivity();

  return (
    <div className="ClubActivity mt-6 text-left p-6 sm:p-4">
      <header className="ClubActivity__header">
        <h2 className="text-xl font-medium">Latest Club Activity</h2>
      </header>

      <div className="ClubActivity__rows sm:mt-6">
        {activity.length <= 0 ? (
          <Card.Body>
            <EmptyState label="No activity to show" />
          </Card.Body>
        ) : (
          activity.slice(0, 4).map((tx: any) => (
            <ActivityRow token={token} {...tx} />
          ))
        )}
      </div>
    </div>
  );
};