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

export type IClubEventType = keyof typeof ActivityTypes;

export interface IClubEvent {
  type: IClubEventType;
  amount: bigint;
  address: Address;
  hash: Hash;
}

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
        <span className="text-gray-500"> Borrowed</span>
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
        <span className="text-gray-500"> Bucket Won</span>{" · "}
        <span className="font-mono">{format(x.amount, TOKENS.UNION, 0)} UNION</span>
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
  const activity: IClubEvent[] = [
    {
      address: "0xDD470917C52a25179a6B5260eAA9609230Be4ce0",
      amount: 6830151353151351351351n,
      hash: "0x0",
      type: "ROUND_WON"
    },
    {
      address: "0xDD470917C52a25179a6B5260eAA9609230Be4ce0",
      amount: 1023151353151351351351n,
      hash: "0x0",
      type: "REPAID"
    },
    {
      address: "0x3dc32a01506982646D021d5C93Fd8Fc6290Ae8DC",
      amount: 86151353151351351351n,
      hash: "0x0",
      type: "REPAID"
    },
    {
      address: "0x3dc32a01506982646D021d5C93Fd8Fc6290Ae8DC",
      amount: 183151353151351351351n,
      hash: "0x0",
      type: "REPAID"
    }
  ];

  return (
    <div className="mt-6 text-left p-6 sm:p-4 border rounded-xl">
      <header className="pb-4 border-b">
        <h2 className="text-xl font-medium">Latest Club Activity</h2>
      </header>

      <div className="mt-4 flex flex-col gap-1.5">
        {activity.length <= 0 ? (
          <Card.Body>
            <EmptyState label="No activity to show" />
          </Card.Body>
        ) : (
          activity.slice(0, 4).map((tx: any) => (
            <ActivityRow token={TOKENS.DAI} {...tx} />
          ))
        )}
      </div>
    </div>
  );
};