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

export const CLUB_PARAMETERS_MODAL = "club-parameters-modal";

export const ClubParametersModal = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const { close } = useModals();
  const { data: clubData, isLoading: clubDataLoading, error: clubDataError } = useClubData(clubAddress);
  const { data: memberNftData, isLoading: memberNftLoading, error: memberNftError } = useClubMemberNft(clubAddress);
  const { data: inviteData } = useInvites(clubAddress);
  const { data: auctionData, isLoading: auctionLoading, error: auctionError } = useClubAuction(clubAddress);
  const { data: assetToken, isLoading: assetTokenLoading, error: assetTokenError } = useErc20Token(clubData?.assetAddress);
  const { data: prorataData, isLoading: prorataLoading, error: prorataError } = useProrata(clubAddress);
  const { data: authData, isLoading: authLoading, error: authError } = useClubAuth(clubAddress);

  // Debug logging
  console.log('ClubParametersModal Debug:', {
    clubData: !!clubData,
    memberNftData: !!memberNftData,
    inviteData: !!inviteData,
    auctionData: !!auctionData,
    assetToken: !!assetToken,
    prorataData: !!prorataData,
    authData: !!authData,
    clubDataLoading,
    memberNftLoading,
    auctionLoading,
    assetTokenLoading,
    prorataLoading,
    authLoading,
    errors: {
      clubDataError,
      memberNftError,
      auctionError,
      assetTokenError,
      prorataError,
      authError
    }
  });

  // Helper function to render loading placeholder
  const LoadingPlaceholder = ({ text = "Loading..." }: { text?: string }) => (
    <span className="text-gray-400 italic">{text}</span>
  );

  const { enabled: invitesEnabled } = inviteData || {};
  const {
    vestingDurationInSeconds,
    startingPercentTrust,
    creatorAddress,
    rewardsManagerAddress,
    memberNftAddress,
    stakingAddress,
    fixedBidPrice,
    lockupPeriod,
    withdrawPeriod,
    withdrawFeeBps,
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
    authAddress
  } = clubData || {};
  const {
    name: membershipName,
    description: clubDescription,
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

  // All parameters in a simple list format
  const parameters = [
    // Club Info & Metadata
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
    { label: "Description", value: memberNftData ? (clubDescription || "None") : <LoadingPlaceholder /> },
    { label: "Membership Name", value: memberNftData ? (membershipName || "None") : <LoadingPlaceholder /> },

    // Authorization & Roles
    { label: "Auth Contract", value: clubData ? (authAddress === zeroAddress ? "None" : (
      <Link href={getEtherscanAddressLink(authAddress)} target="_blank" rel="noopener">
        {truncateAddress(authAddress)}
      </Link>
    )) : <LoadingPlaceholder /> },
    { label: "Credit Manager", value: authData ? (creditManagerAddress === zeroAddress ? "None" : (
      <Link href={getEtherscanAddressLink(creditManagerAddress)} target="_blank" rel="noopener">
        {truncateAddress(creditManagerAddress)}
      </Link>
    )) : <LoadingPlaceholder /> },
    { label: "Manager", value: authData ? (managerAddress === zeroAddress ? "None" : (
      <Link href={getEtherscanAddressLink(managerAddress)} target="_blank" rel="noopener">
        {truncateAddress(managerAddress)}
      </Link>
    )) : <LoadingPlaceholder /> },
    { label: "Fee Manager", value: authData ? (feeManagerAddress === zeroAddress ? "None" : (
      <Link href={getEtherscanAddressLink(feeManagerAddress)} target="_blank" rel="noopener">
        {truncateAddress(feeManagerAddress)}
      </Link>
    )) : <LoadingPlaceholder /> },
    { label: "Creator", value: clubData ? (creatorAddress === zeroAddress ? "None" : (
      <Link href={getEtherscanAddressLink(creatorAddress)} target="_blank" rel="noopener">
        {truncateAddress(creatorAddress)}
      </Link>
    )) : <LoadingPlaceholder /> },

    // Fundraising & Financial
    { label: "Raise Min Target", value: auctionData && assetToken ? `$${formatDecimals(minTarget, assetDecimals, 0)}` : <LoadingPlaceholder /> },
    { label: "Raise Max Target", value: auctionData && assetToken ? `$${formatDecimals(maxTarget, assetDecimals, 0)}` : <LoadingPlaceholder /> },
    { label: "Raise Period", value: auctionData ? formatDuration(Number(period)) : <LoadingPlaceholder /> },
    { label: "Vault Ratio", value: auctionData ? `${Number(vaultRatio) / 100}%` : <LoadingPlaceholder /> },
    { label: "Asset Ratio", value: auctionData ? `${Number(assetRatio) / 100}%` : <LoadingPlaceholder /> },
    { label: "Fixed Bid Price", value: clubData && assetToken ? `$${formatDecimals(fixedBidPrice, assetDecimals, 2)}` : <LoadingPlaceholder /> },

    // Membership & Access
    { label: "Max Members", value: memberNftData ? Number(maxMembers) : <LoadingPlaceholder /> },
    { label: "Min Members", value: memberNftData ? Number(minMembers) : <LoadingPlaceholder /> },
    { label: "Membership Cost", value: memberNftData && assetToken ? `$${formatDecimals(membershipCost, assetDecimals, 2)}` : <LoadingPlaceholder /> },
    { label: "Invite Cost", value: memberNftData ? `${formatDecimals(inviteCost, 18, 0)} UNION` : <LoadingPlaceholder /> },
    { label: "Member ProRata", value: prorataData?.formatted?.prorataAmount || <LoadingPlaceholder /> },

    // Time & Vesting
    { label: "Vesting Duration", value: clubData ? formatDuration(Number(vestingDurationInSeconds)) : <LoadingPlaceholder /> },
    { label: "Withdraw Period", value: clubData ? formatDuration(Number(withdrawPeriod)) : <LoadingPlaceholder /> },
    { label: "Lockup Period", value: clubData ? formatDuration(Number(lockupPeriod)) : <LoadingPlaceholder /> },
    { label: "Starting Trust Percentage", value: clubData ? (Number(startingPercentTrust) / Number(WAD_1E18)) * 100 + "%" : <LoadingPlaceholder /> },

    // Fees & Recipients
    { label: "Withdraw Fee", value: clubData ? `${Number(withdrawFeeBps) / 100}%` : <LoadingPlaceholder /> },
    { label: "Vault Withdraw Fee", value: clubData ? `${Number(vaultWithdrawFeeBps) / 100}%` : <LoadingPlaceholder /> },
    { label: "Staking Withdraw Fee", value: clubData ? `${Number(stakingWithdrawFeeBps) / 100}%` : <LoadingPlaceholder /> },
    { label: "Feeling Lucky Cost", value: clubData && assetToken ? `$${formatDecimals(costToCall, assetDecimals, 2)}` : <LoadingPlaceholder /> },
    { label: "Reward Cooldown", value: clubData ? formatDuration(Number(rewardCooldown)) : <LoadingPlaceholder /> },
    { label: "Fee Recipient", value: clubData ? (feeRecipient === zeroAddress ? "None" : (
      <Link href={getEtherscanAddressLink(feeRecipient)} target="_blank" rel="noopener">
        {truncateAddress(feeRecipient)}
      </Link>
    )) : <LoadingPlaceholder /> },

    // Gating & Access Control
    { label: "Gating Token", value: memberNftData ? (gatingTokenAddress === zeroAddress ? "None" : (
      <Link href={getEtherscanAddressLink(gatingTokenAddress)} target="_blank" rel="noopener">
        {truncateAddress(gatingTokenAddress)}
      </Link>
    )) : <LoadingPlaceholder /> },
    { label: "Gating Token Amount", value: memberNftData ? Number(gatingTokenAmount) : <LoadingPlaceholder /> },

    // Configuration Flags
    { label: "Closed End Fund", value: clubData ? (isClosedEndFund ? "True" : "False") : <LoadingPlaceholder /> },
    { label: "Invites Enabled", value: inviteData ? (invitesEnabled ? "True" : "False") : <LoadingPlaceholder /> },
    { label: "Soul Bound", value: memberNftData ? (isSoulBound ? "True" : "False") : <LoadingPlaceholder /> },
    { label: "Public", value: clubData ? (isPublic ? "True" : "False") : <LoadingPlaceholder /> },
    { label: "Token Enabled", value: clubData ? (isTokenEnabled ? "True" : "False") : <LoadingPlaceholder /> },
    { label: "Tiers Enabled", value: clubData ? (isTiersEnabled ? "True" : "False") : <LoadingPlaceholder /> },

    // Contract Addresses
    { label: "CreditVault", value: <AddressDisplay address={clubAddress} className="font-mono" /> },
    { label: "Reward Manager", value: <AddressDisplay address={rewardsManagerAddress} className="font-mono" /> },
    { label: "Membership NFT", value: <AddressDisplay address={memberNftAddress} className="font-mono" /> },
    { label: "Staking Contract", value: <AddressDisplay address={stakingAddress} className="font-mono" /> },
  ];

  return (
    <>
      <ModalOverlay onClick={close} />
      <Modal className="ClubParametersModal">
        <Modal.Header title="Club Parameters" onClose={close} />
        <Modal.Body>
          <div className="space-y-4">
            {parameters.map((param, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-medium text-gray-700">{param.label}:</span>
                <span className="text-gray-900">{param.value}</span>
              </div>
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
