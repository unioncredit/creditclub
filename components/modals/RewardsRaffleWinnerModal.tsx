import {
  Button,
  Modal,
  ModalOverlay,
  InfoBanner,
  LinkOutIcon,
  // @ts-ignore
} from "@unioncredit/ui";
import { Address, Hash, zeroAddress } from "viem";

import { useModals } from "@/providers/ModalManagerProvider";
import { StatGrid, StatGridRow } from "@/components/shared/StatGrid";
import { Avatar } from "@/components/shared/Avatar";
import { PrimaryLabel } from "@/components/shared/PrimaryLabel";
import { useRewards } from "@/hooks/useRewards";
import { useEventLog } from "@/hooks/useEventLog";
import { creditVaultAbi } from "@/abis/creditVault";
import { useClubData } from "@/hooks/useClubData";
import { usePrimaryLabel } from "@/hooks/usePrimaryLabel";
import { useAccount } from "wagmi";
import React from "react";

export const REWARDS_RAFFLE_WINNER_MODAL = "rewards-raffle-winner-modal";

export const RewardsRaffleWinnerModal = ({
  clubAddress,
  hash,
  winnerBalance,
  bidBucketBalance,
  callerBalance,
}: {
  clubAddress: Address;
  hash: Hash;
  winnerBalance: number;
  bidBucketBalance: number;
  callerBalance: number;
}) => {
  const { close } = useModals();
  const { address } = useAccount();
  const { data: clubData } = useClubData(clubAddress);

  const { symbol } = clubData;

  const {
    bidBucketPercentage,
    callerPercentage,
    winnerPercentage,
  } = useRewards(clubAddress);

  const { data: event } = useEventLog({
    hash,
    eventName: "FeelingLucky",
    abi: creditVaultAbi,
  });

  // @ts-ignore
  const winnerAddress = event?.args?.winner || zeroAddress;

  // @ts-ignore
  const amountWon = event?.args.amountToWinner || 0n;

  const { data: winnerName } = usePrimaryLabel({
    address: winnerAddress,
    shouldTruncate: true,
  });

  const { data: callerName } = usePrimaryLabel({
    address,
    shouldTruncate: true,
    defaultValue: "you",
  });

  const statRows: StatGridRow[] = [
    {
      name: `Winner [${winnerPercentage}%]`,
      value: `${winnerBalance.toFixed(2)} UNION to ${winnerName}`,
    },
    {
      name: `Vault  [${bidBucketPercentage}%]`,
      value: `${bidBucketBalance.toFixed(2)} UNION to $${symbol}`,
    },
    {
      name: `Caller [${callerPercentage}%]`,
      value: `${callerBalance.toFixed(2)} UNION to ${callerName}`
    },
  ];

  return (
    <ModalOverlay onClick={close}>
      <Modal>
        <Modal.Header title="Rewards Raffle Results" onClose={close} />
        <Modal.Body>
          <div className="flex">
            <div className="border pt-2 p-1 px-8 flex flex-col justify-center items-center gap-1 mb-4 mx-auto">
              <Avatar size={32} address={winnerAddress} className="border" />
              <h2 className="font-mono text-sm">
                <PrimaryLabel address={winnerAddress} shouldTruncate={false} />
              </h2>
              <p className="text-xl">
                {amountWon <= 0n ? "Loser" : "Winner"}
              </p>
            </div>
          </div>

          {amountWon <= 0n && (
            <InfoBanner
              align="left"
              variant="warning"
              className="font-mono text-xs p-3 bg-blue-50 text-blue-600 mb-4"
              label={`Sadly, ${winnerName} is currently not a member or overdue so they missed out on ${winnerBalance.toFixed(2)} of UNION.`}

            />
          )}

          <StatGrid title="Raffle Receipt" rows={statRows} className="text-sm" />

          <div className="flex items-center gap-2 w-full mt-4">
            <Button
              fluid
              color="secondary"
              variant="light"
              label="Close"
              onClick={close}
            />

            {hash && (
              <Button
                fluid
                color="secondary"
                variant="light"
                icon={LinkOutIcon}
                label="Etherscan"
                onClick={() => open(`https://basescan.org/tx/${hash}`)}
              />
            )}
          </div>
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
