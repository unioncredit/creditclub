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
import { Address, Hash } from "viem";

import { format } from "@/lib/format";
import { ActivityTypes, IToken, TOKENS } from "@/constants";
import { AddressLink } from "@/components/shared/AddressLink";
import { IClubEvent, IClubEventType } from "@/fetchers/fetchClubEvents";
import { useToken } from "@/hooks/useToken";
import { useClubActivity } from "@/hooks/useClubActivity";
import React from "react";

// prettier-ignore
const texts = {
  [ActivityTypes.LOADING]: () => (
    <Skeleton width={320} height={28} shimmer />
  ),
  [ActivityTypes.JOINED_CLUB]: (x: IClubEvent) => (
    <>
      <AddressLink address={x.address} /> ·
      <a href={`https://basescan.org/tx/${x.hash}`} target="_blank" rel="noopener">
        <span className="text-gray-500"> Joined the club!</span>
      </a>
    </>
  ),
  [ActivityTypes.INVITATION_EVENT]: (x: IClubEvent) => (
    <>
      <AddressLink address={x.address} /> ·
      <a href={`https://basescan.org/tx/${x.hash}`} target="_blank" rel="noopener">
        <span className="text-gray-500"> Invited to club!</span>
      </a>
    </>
  ),
  [ActivityTypes.BORROWED]: (x: IClubEvent, token: IToken) => (
    <>
      <AddressLink address={x.address} /> ·
      <a href={`https://basescan.org/tx/${x.hash}`} target="_blank" rel="noopener">
        <span className="text-gray-500"> Borrowed</span>{" · "}
        <span className="font-mono">{format(x.amount, token, 0)} {token}</span>
      </a>
    </>
  ),
  [ActivityTypes.REPAID]: (x: IClubEvent, token: IToken) => (
    <>
      <AddressLink address={x.address} /> ·
      <a href={`https://basescan.org/tx/${x.hash}`} target="_blank" rel="noopener">
        <span className="text-gray-500"> Repaid</span>{" · "}
        <span className="font-mono">{format(x.amount, token, 0)} {token}</span>
      </a>
    </>
  ),
  [ActivityTypes.UPDATED_TRUST]: (x: IClubEvent, token: IToken) => (
    <>
      <AddressLink address={x.address} /> ·
      <a href={`https://basescan.org/tx/${x.hash}`} target="_blank" rel="noopener">
        <span className="text-gray-500"> Updated trust</span>{" · "}
        <span className="font-mono">{format(x.amount, token, 0)} {token}</span>
      </a>
    </>
  ),
  [ActivityTypes.ROUND_WON]: (x: IClubEvent) => (
    <>
      <AddressLink address={x.address} /> ·
      <a href={`https://basescan.org/tx/${x.hash}`} target="_blank" rel="noopener">
        <span className="text-gray-500"> Won</span>{" · "}
        <span className="font-mono">{format(x.amount, TOKENS.UNION, 0)} UNION</span>
      </a>
    </>
  ),
  [ActivityTypes.BID_PLACED]: (x: IClubEvent) => (
    <>
      <AddressLink address={x.address} /> ·
      <a href={`https://basescan.org/tx/${x.hash}`} target="_blank" rel="noopener">
        <span className="text-gray-500"> $1 Bid Placed</span>{" · "}
        <span className="font-mono">{format(x.amount, TOKENS.UNION, 0)} UNION</span>
      </a>
    </>
  ),
  [ActivityTypes.MINT]: (x: IClubEvent) => (
    <>
      <AddressLink address={x.address} /> ·
      <a href={`https://basescan.org/tx/${x.hash}`} target="_blank" rel="noopener">
        <span className="text-gray-500"> Minted</span>{" · "}
        <span className="font-mono">{format(x.amount, TOKENS.UNION, 0)} $BUILDERS</span>
      </a>
    </>
  ),
  [ActivityTypes.REDEEM]: (x: IClubEvent) => (
    <>
      <AddressLink address={x.address} /> ·
      <a href={`https://basescan.org/tx/${x.hash}`} target="_blank" rel="noopener">
        <span className="text-gray-500"> Redeemed</span>{" · "}
        <span className="font-mono">{format(x.amount, TOKENS.USDC, 0)} $USDC</span>
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
    [ActivityTypes.MINT]: WithdrawIcon,
    [ActivityTypes.REDEEM]: DepositIcon,
  };

  // @ts-ignore
  const text = texts[type]({ type, amount, address, hash }, token);
  const Icon = icons[type];

  return (
    <div className="flex items-center gap-1">
      {Icon && <Icon width={24} height={24} className="fill text-blue-600" />}
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
    <div className="mt-6 text-left p-4 sm:p-4 border rounded-xl">
      <header className="pb-4 border-b">
        <h2 className="text-lg text-stone-500 font-medium">Latest Club Activity</h2>
      </header>

      <div className="mt-4 flex flex-col gap-1.5">
      {activity.length <= 0 ? (
          <Card.Body>
            <EmptyState label="No activity to show" />
          </Card.Body>
        ) : (
          activity.slice(0, 4).map((tx: any, index) => (
            <ActivityRow key={index} token={token} {...tx} />
          ))
        )}
      </div>
    </div>
  );
};