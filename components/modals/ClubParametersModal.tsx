import React from "react";
import { Address, zeroAddress } from "viem";
// @ts-ignore
import { Modal, ModalOverlay, } from "@unioncredit/ui";

import { useModals } from "@/providers/ModalManagerProvider";
import { useClubData } from "@/hooks/useClubData";
import { formatDuration } from "@/lib/utils";
import { useInvites } from "@/hooks/useInvites";
import { truncateAddress } from "@/lib/format";
import Link from "next/link";
import { getEtherscanAddressLink } from "@/lib/links";
import { WAD_1E18 } from "@/constants";
import { AddressDisplay } from "@/components/shared/AddressDisplay";
import { useClubMemberNft } from "@/hooks/useClubMemberNft";

export const CLUB_PARAMETERS_MODAL = "club-parameters-modal";

export const ClubParametersModal = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const { close } = useModals();
  const { data: clubData } = useClubData(clubAddress);
  const { data: memberNftData } = useClubMemberNft(clubAddress);
  const { data: inviteData } = useInvites(clubAddress);

  const { enabled: invitesEnabled } = inviteData;
  const {
    vestingDurationInSeconds,
    startingPercentTrust,
    creatorAddress,
    rewardsManagerAddress,
    memberNftAddress,
    stakingAddress
  } = clubData;
  const {
    gatingTokenAddress
  } = memberNftData;

  const parameters = [
    {
      label: "Vesting period",
      value: formatDuration(Number(vestingDurationInSeconds)),
    },
    {
      label: "Invites",
      value: invitesEnabled ? "Enabled" : "Disabled",
    },
    {
      label: "Gating token",
      value: gatingTokenAddress === zeroAddress
        ? "N/A"
        : (
          <Link href={getEtherscanAddressLink(gatingTokenAddress)} target="_blank" rel="noopener">
            {truncateAddress(gatingTokenAddress)}
          </Link>
        ),
    },
    {
      label: "Starting percentage",
      value: (Number(startingPercentTrust) / Number(WAD_1E18)) * 100 + "%",
    },
  ];

  const contracts = [
    {
      label: "CreditVault",
      address: <AddressDisplay address={clubAddress} className="font-mono" />
    },
    {
      label: "Creator",
      address: <AddressDisplay address={creatorAddress} className="font-mono" />
    },
    {
      label: "Reward Manager",
      address: <AddressDisplay address={rewardsManagerAddress} className="font-mono" />
    },
    {
      label: "Membership NFT",
      address: <AddressDisplay address={memberNftAddress} className="font-mono" />
    },
    {
      label: "Staking Contract",
      address: <AddressDisplay address={stakingAddress} className="font-mono" />
    }
  ];

  return (
    <ModalOverlay onClick={close}>
      <Modal>
        <Modal.Header title="Club parameters" onClose={close} />
        <Modal.Body>
          <h2 className="underline font-semibold">Club parameters</h2>
          <ul className="mt-4 flex flex-col gap-2">
            {parameters.map(({ label, value }) => (
              <li className="flex justify-between items-center">
                <span className="text-stone-600">{label}</span>
                <span className="text-black font-medium">{value}</span>
              </li>
            ))}
          </ul>

          <h2 className="underline font-semibold mt-6">Club contracts</h2>
          <ul className="mt-4 flex flex-col gap-2">
            {contracts.map(({ label, address }) => (
              <li className="flex justify-between items-center">
                <span className="text-stone-600">{label}</span>
                <span className="text-black font-medium">{address}</span>
              </li>
            ))}
          </ul>
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
