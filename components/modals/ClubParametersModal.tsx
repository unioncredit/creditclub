import React from "react";
import { Address, zeroAddress } from "viem";
// @ts-ignore
import { Modal, ModalOverlay, } from "@unioncredit/ui";

import { useModals } from "@/providers/ModalManagerProvider";
import { useClubData } from "@/hooks/useClubData";
import { formatDuration } from "@/lib/utils";
import { useInvites } from "@/hooks/useInvites";
import { truncateAddress, formatDecimals } from "@/lib/format";
import Link from "next/link";
import { getEtherscanAddressLink } from "@/lib/links";
import { WAD_1E18 } from "@/constants";
import { AddressDisplay } from "@/components/shared/AddressDisplay";
import { useClubMemberNft } from "@/hooks/useClubMemberNft";
import { useClubAuction } from "@/hooks/useClubAuction";
import { useErc20Token } from "@/hooks/useErc20Token";
import { useProrata } from "@/hooks/useProrata";

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
  const { data: auctionData } = useClubAuction(clubAddress);
  const { data: assetToken } = useErc20Token(clubData.assetAddress);
  const { data: prorataData } = useProrata(clubAddress);

  const { enabled: invitesEnabled } = inviteData;
  const {
    vestingDurationInSeconds,
    startingPercentTrust,
    creatorAddress,
    rewardsManagerAddress,
    memberNftAddress,
    stakingAddress,
    fixedBidPrice,
    lockupPeriod,
    withdrawFeeBps,
    feeRecipient,
    isClosedEndFund,
    isPublic,
    isTokenEnabled
  } = clubData;
  const {
    gatingTokenAddress,
    gatingTokenAmount,
    membershipCost,
    inviteCost,
    maxMembers,
    minMembers,
    isSoulBound
  } = memberNftData;
  const {
    minTarget,
    maxTarget,
    period,
    vaultRatio,
    assetRatio
  } = auctionData;
  const { decimals: assetDecimals } = assetToken;

  const parameters = [
    {
      label: "Raise Min Target",
      value: `$${formatDecimals(minTarget, assetDecimals, 0)}`,
    },
    {
      label: "Raise Max Target", 
      value: `$${formatDecimals(maxTarget, assetDecimals, 0)}`,
    },
    {
      label: "Raise Period",
      value: formatDuration(Number(period)),
    },
    {
      label: "Vault Ratio",
      value: `${Number(vaultRatio) / 100}%`,
    },
    {
      label: "Asset Ratio",
      value: `${Number(assetRatio) / 100}%`,
    },
    {
      label: "Withdraw Period",
      value: formatDuration(Number(lockupPeriod)),
    },
    {
      label: "Lockup Period",
      value: formatDuration(Number(lockupPeriod)),
    },
    {
      label: "Fixed Bid Price",
      value: `$${formatDecimals(fixedBidPrice, assetDecimals, 2)}`,
    },
    {
      label: "Membership Cost",
      value: `$${formatDecimals(membershipCost, assetDecimals, 2)}`,
    },
    {
      label: "Invite Cost",
      value: `${formatDecimals(inviteCost, 18, 0)} UNION`,
    },
    {
      label: "Withdraw Fee",
      value: `${Number(withdrawFeeBps) / 100}%`,
    },
    {
      label: "Fee Recipient",
      value: feeRecipient === zeroAddress ? "None" : (
        <Link href={getEtherscanAddressLink(feeRecipient)} target="_blank" rel="noopener">
          {truncateAddress(feeRecipient)}
        </Link>
      ),
    },
    {
      label: "Max Members",
      value: Number(maxMembers),
    },
    {
      label: "Min Members",
      value: Number(minMembers),
    },
    {
      label: "Vesting Duration",
      value: formatDuration(Number(vestingDurationInSeconds)),
    },
    {
      label: "Starting Trust Percentage",
      value: (Number(startingPercentTrust) / Number(WAD_1E18)) * 100 + "%",
    },
    {
      label: "Gating Token",
      value: gatingTokenAddress === zeroAddress
        ? "None"
        : (
          <Link href={getEtherscanAddressLink(gatingTokenAddress)} target="_blank" rel="noopener">
            {truncateAddress(gatingTokenAddress)}
          </Link>
        ),
    },
    {
      label: "Gating Token Amount",
      value: Number(gatingTokenAmount),
    },
    {
      label: "Closed End Fund",
      value: isClosedEndFund ? "True" : "False",
    },
    {
      label: "Invites Enabled",
      value: invitesEnabled ? "True" : "False",
    },
    {
      label: "Soul Bound",
      value: isSoulBound ? "True" : "False",
    },
    {
      label: "Public",
      value: isPublic ? "True" : "False",
    },
    {
      label: "Token Enabled",
      value: isTokenEnabled ? "True" : "False",
    },
    {
      label: "Member ProRata",
      value: prorataData.formatted.prorataAmount,
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
            {parameters.map(({ label, value }, index) => (
              <li key={index} className="flex justify-between items-center">
                <span className="text-stone-600">{label}</span>
                <span className="text-black font-medium">{value}</span>
              </li>
            ))}
          </ul>

          <h2 className="underline font-semibold mt-6">Club contracts</h2>
          <ul className="mt-4 flex flex-col gap-2">
            {contracts.map(({ label, address }, index) => (
              <li key={index} className="flex justify-between items-center">
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
