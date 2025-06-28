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
import { useClubAuth } from "@/hooks/useClubAuth";
import { useRewardsManagerContract } from "@/hooks/useRewardsManagerContract";

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
  const { data: assetToken } = useErc20Token(clubData?.assetAddress);
  const { data: prorataData } = useProrata(clubAddress);
  const { data: authData } = useClubAuth(clubAddress);
  const rewardsManagerContract = useRewardsManagerContract();





  // Helper function to render loading placeholder
  const LoadingPlaceholder = ({ text = "Loading..." }: { text?: string }) => (
    <span className="text-gray-400 italic">{text}</span>
  );

  const { enabled: invitesEnabled } = inviteData || {};
  const {
    vestingDurationInSeconds,
    startingPercentTrust,
    creatorAddress,
    memberNftAddress,
    stakingAddress,
    fixedBidPrice,
    lockupPeriod,
    withdrawPeriod,
    vaultWithdrawFeeBps,
    stakingWithdrawFeeBps,
    feeRecipient,
    isClosedEndFund,
    isPublic,
    isTokenEnabled,
    isTiersEnabled,
    costToCall,
    rewardCooldown,
    name: clubName,
    symbol: clubSymbol,
    image: clubImage,
    description: clubDescription,
    ownerAddress
  } = clubData || {};
  const {
    name: membershipName,
    gatingTokenAddress,
    gatingTokenAmount,
    membershipCost,
    inviteCost,
    maxMembers,
    minMembers,
    isSoulBound
  } = memberNftData || {};
  const {
    minTarget,
    maxTarget,
    period,
    vaultRatio,
    assetRatio
  } = auctionData || {};
  const {
    creditManagerAddress = zeroAddress,
    managerAddress = zeroAddress,
    feeManagerAddress = zeroAddress
  } = authData || {};

  const { decimals: assetDecimals = 18 } = assetToken || {};

  // Organize parameters into sections
  const sections = [
    {
      title: "Club Info & Metadata",
      parameters: [
        { label: "Club Name", value: clubData ? (clubName || "None") : <LoadingPlaceholder /> },
        { label: "Club Symbol", value: clubData ? (clubSymbol || "None") : <LoadingPlaceholder /> },
        { label: "Club Image", value: clubData ? (clubImage ? (
          <div className="flex items-center gap-2">
            <img src={clubImage} alt="Club" className="w-8 h-8 rounded object-cover" />
            <Link href={clubImage} target="_blank" rel="noopener" className="text-blue-600 hover:underline">
              View Image
            </Link>
          </div>
        ) : "None") : <LoadingPlaceholder /> },
        { label: "Description", value: clubData ? (clubDescription || "None") : <LoadingPlaceholder /> },
        { label: "Membership Name", value: memberNftData ? (membershipName || "None") : <LoadingPlaceholder /> },
      ]
    },
    {
      title: "Ownership & Authorization",
      parameters: [
        { label: "Vault Owner", value: clubData ? (ownerAddress === zeroAddress ? "None" : (
          <Link href={getEtherscanAddressLink(ownerAddress)} target="_blank" rel="noopener">
            {truncateAddress(ownerAddress)}
          </Link>
        )) : <LoadingPlaceholder /> },
        { label: "Club Creator", value: clubData ? (creatorAddress === zeroAddress ? "None" : (
          <Link href={getEtherscanAddressLink(creatorAddress)} target="_blank" rel="noopener">
            {truncateAddress(creatorAddress)}
          </Link>
        )) : <LoadingPlaceholder /> },
      ]
    },
    {
      title: "Management Roles",
      parameters: [
        { label: "Credit Manager", value: authData ? (creditManagerAddress === zeroAddress ? "None" : (
          <Link href={getEtherscanAddressLink(creditManagerAddress)} target="_blank" rel="noopener">
            {truncateAddress(creditManagerAddress)}
          </Link>
        )) : <LoadingPlaceholder /> },
        { label: "General Manager", value: authData ? (managerAddress === zeroAddress ? "None" : (
          <Link href={getEtherscanAddressLink(managerAddress)} target="_blank" rel="noopener">
            {truncateAddress(managerAddress)}
          </Link>
        )) : <LoadingPlaceholder /> },
        { label: "Fee Manager", value: authData ? (feeManagerAddress === zeroAddress ? "None" : (
          <Link href={getEtherscanAddressLink(feeManagerAddress)} target="_blank" rel="noopener">
            {truncateAddress(feeManagerAddress)}
          </Link>
        )) : <LoadingPlaceholder /> },
      ]
    },
    {
      title: "Fundraising & Financial",
      parameters: [
        { label: "Raise Min Target", value: auctionData && assetToken ? `$${formatDecimals(minTarget, assetDecimals, 0)}` : <LoadingPlaceholder /> },
        { label: "Raise Max Target", value: auctionData && assetToken ? `$${formatDecimals(maxTarget, assetDecimals, 0)}` : <LoadingPlaceholder /> },
        { label: "Raise Period", value: auctionData ? formatDuration(Number(period)) : <LoadingPlaceholder /> },
        { label: "Vault Ratio", value: auctionData ? `${Number(vaultRatio) / 100}%` : <LoadingPlaceholder /> },
        { label: "Asset Ratio", value: auctionData ? `${Number(assetRatio) / 100}%` : <LoadingPlaceholder /> },
        { label: "Fixed Bid Price", value: clubData && assetToken ? `$${formatDecimals(fixedBidPrice, assetDecimals, 2)}` : <LoadingPlaceholder /> },
      ]
    },
    {
      title: "Membership & Access",
      parameters: [
        { label: "Max Members", value: memberNftData ? Number(maxMembers) : <LoadingPlaceholder /> },
        { label: "Min Members", value: memberNftData ? Number(minMembers) : <LoadingPlaceholder /> },
        { label: "Membership Cost", value: memberNftData && assetToken ? `$${formatDecimals(membershipCost, assetDecimals, 4)}` : <LoadingPlaceholder /> },
        { label: "Invite Cost", value: memberNftData ? `${formatDecimals(inviteCost, 18, 4)} UNION` : <LoadingPlaceholder /> },
        { label: "Member ProRata", value: prorataData?.formatted?.prorataAmount ? prorataData.formatted.prorataAmount : <LoadingPlaceholder /> },
      ]
    },
    {
      title: "Time & Vesting",
      parameters: [
        { label: "Vesting Duration", value: clubData ? formatDuration(Number(vestingDurationInSeconds)) : <LoadingPlaceholder /> },
        { label: "Withdraw Period", value: clubData ? (Number(withdrawPeriod) === 0 ? "Instant" : formatDuration(Number(withdrawPeriod))) : <LoadingPlaceholder /> },
        { label: "Lockup Period", value: clubData ? formatDuration(Number(lockupPeriod)) : <LoadingPlaceholder /> },
        { label: "Starting Trust Percentage", value: clubData ? (Number(startingPercentTrust) / Number(WAD_1E18)) * 100 + "%" : <LoadingPlaceholder /> },
      ]
    },
    {
      title: "Fees & Recipients",
      parameters: [
        { label: "Vault Withdraw Fee", value: clubData ? `${((Number(vaultWithdrawFeeBps) || 0) / 10000 * 100).toFixed(2)}%` : <LoadingPlaceholder /> },
        { label: "Staking Withdraw Fee", value: clubData ? `${((Number(stakingWithdrawFeeBps) || 0) / 10000 * 100).toFixed(2)}%` : <LoadingPlaceholder /> },
        { label: "Feeling Lucky Cost", value: clubData ? `${formatDecimals(costToCall, 18, 5, false, false, false)} ETH` : <LoadingPlaceholder /> },
        { label: "Reward Cooldown", value: clubData ? formatDuration(Number(rewardCooldown)) : <LoadingPlaceholder /> },
        { label: "Fee Recipient", value: clubData ? (feeRecipient === zeroAddress ? "None" : (
          <Link href={getEtherscanAddressLink(feeRecipient)} target="_blank" rel="noopener">
            {truncateAddress(feeRecipient)}
          </Link>
        )) : <LoadingPlaceholder /> },
      ]
    },
    {
      title: "Gating & Access Control",
      parameters: [
        { label: "Gating Token", value: memberNftData ? (gatingTokenAddress === zeroAddress ? "None" : (
          <Link href={getEtherscanAddressLink(gatingTokenAddress)} target="_blank" rel="noopener">
            {truncateAddress(gatingTokenAddress)}
          </Link>
        )) : <LoadingPlaceholder /> },
        { label: "Gating Token Amount", value: memberNftData ? Number(gatingTokenAmount) : <LoadingPlaceholder /> },
      ]
    },
    {
      title: "Configuration Flags",
      parameters: [
        { label: "Closed End Fund", value: clubData ? (isClosedEndFund ? "True" : "False") : <LoadingPlaceholder /> },
        { label: "Invites Enabled", value: inviteData ? (invitesEnabled ? "True" : "False") : <LoadingPlaceholder /> },
        { label: "Soul Bound", value: memberNftData ? (isSoulBound ? "True" : "False") : <LoadingPlaceholder /> },
        { label: "Public", value: clubData ? (isPublic ? "True" : "False") : <LoadingPlaceholder /> },
        { label: "Token Enabled", value: clubData ? (isTokenEnabled ? "True" : "False") : <LoadingPlaceholder /> },
        { label: "Tiers Enabled", value: clubData ? (isTiersEnabled ? "True" : "False") : <LoadingPlaceholder /> },
      ]
    },
    {
      title: "Contract Addresses",
      parameters: [
        { label: "CreditVault", value: <AddressDisplay address={clubAddress} className="font-mono" /> },
        { label: "Reward Manager", value: <AddressDisplay address={rewardsManagerContract.address} className="font-mono" /> },
        { label: "Membership NFT", value: <AddressDisplay address={memberNftAddress} className="font-mono" /> },
        { label: "Staking Contract", value: <AddressDisplay address={stakingAddress} className="font-mono" /> },
      ]
    }
  ];

  return (
    <ModalOverlay onClick={close}>
      <Modal className="ClubParametersModal">
        <Modal.Header title="Club Parameters" onClose={close} />
        <Modal.Body>
          <div className="space-y-6">
            {sections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b-2 border-gray-200">
                  {section.title}
                </h3>
                <div className="space-y-2">
                  {section.parameters.map((param, paramIndex) => (
                    <div key={paramIndex} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">{param.label}:</span>
                      <span className="text-gray-900">{param.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
};
