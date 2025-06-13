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
  const { data: clubData } = useClubData(clubAddress);
  const { data: memberNftData } = useClubMemberNft(clubAddress);
  const { data: inviteData } = useInvites(clubAddress);
  const { data: auctionData } = useClubAuction(clubAddress);
  const { data: assetToken } = useErc20Token(clubData.assetAddress);
  const { data: prorataData } = useProrata(clubAddress);
  const { data: authData } = useClubAuth(clubAddress);

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
  } = clubData;
  const {
    name: membershipName,
    description: clubDescription,
    image: membershipImage,
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
  const {
    creditManagerAddress,
    managerAddress,
    feeManagerAddress
  } = authData;
  const { decimals: assetDecimals } = assetToken;

  // Club Info & Metadata
  const clubInfoParams = [
    {
      label: "Club Name",
      value: clubName,
    },
    {
      label: "Club Symbol", 
      value: clubSymbol,
    },
    {
      label: "Club Image",
      value: clubImage ? (
        <div className="flex items-center gap-2">
          <img src={clubImage} alt="Club" className="w-8 h-8 rounded object-cover" />
          <Link href={clubImage} target="_blank" rel="noopener" className="text-blue-600 hover:underline">
            View Image
          </Link>
        </div>
      ) : "None",
    },
    {
      label: "Description",
      value: clubDescription || "None",
    },
    {
      label: "Membership Name",
      value: membershipName,
    },
  ];

  // Authorization & Roles
  const authParams = [
    {
      label: "Auth Contract",
      value: authAddress === zeroAddress ? "None" : (
        <Link href={getEtherscanAddressLink(authAddress)} target="_blank" rel="noopener">
          {truncateAddress(authAddress)}
        </Link>
      ),
    },
    {
      label: "Credit Manager",
      value: creditManagerAddress === zeroAddress ? "None" : (
        <Link href={getEtherscanAddressLink(creditManagerAddress)} target="_blank" rel="noopener">
          {truncateAddress(creditManagerAddress)}
        </Link>
      ),
    },
    {
      label: "Manager",
      value: managerAddress === zeroAddress ? "None" : (
        <Link href={getEtherscanAddressLink(managerAddress)} target="_blank" rel="noopener">
          {truncateAddress(managerAddress)}
        </Link>
      ),
    },
    {
      label: "Fee Manager",
      value: feeManagerAddress === zeroAddress ? "None" : (
        <Link href={getEtherscanAddressLink(feeManagerAddress)} target="_blank" rel="noopener">
          {truncateAddress(feeManagerAddress)}
        </Link>
      ),
    },
    {
      label: "Creator",
      value: creatorAddress === zeroAddress ? "None" : (
        <Link href={getEtherscanAddressLink(creatorAddress)} target="_blank" rel="noopener">
          {truncateAddress(creatorAddress)}
        </Link>
      ),
    },
  ];

  // Fundraising & Financial Parameters
  const fundraisingParams = [
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
      label: "Fixed Bid Price",
      value: `$${formatDecimals(fixedBidPrice, assetDecimals, 2)}`,
    },
  ];

  // Membership & Access Parameters
  const membershipParams = [
    {
      label: "Max Members",
      value: Number(maxMembers),
    },
    {
      label: "Min Members",
      value: Number(minMembers),
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
      label: "Member ProRata",
      value: prorataData.formatted.prorataAmount,
    },
  ];

  // Time & Vesting Parameters
  const timeParams = [
    {
      label: "Vesting Duration",
      value: formatDuration(Number(vestingDurationInSeconds)),
    },
    {
      label: "Withdraw Period",
      value: formatDuration(Number(withdrawPeriod)),
    },
    {
      label: "Lockup Period",
      value: formatDuration(Number(lockupPeriod)),
    },
    {
      label: "Starting Trust Percentage",
      value: (Number(startingPercentTrust) / Number(WAD_1E18)) * 100 + "%",
    },
  ];

  // Fee & Financial Settings
  const feeParams = [
    {
      label: "Withdraw Fee",
      value: `${Number(withdrawFeeBps) / 100}%`,
    },
    {
      label: "Vault Withdraw Fee",
      value: `${Number(vaultWithdrawFeeBps) / 100}%`,
    },
    {
      label: "Staking Withdraw Fee",
      value: `${Number(stakingWithdrawFeeBps) / 100}%`,
    },
    {
      label: "Feeling Lucky Cost",
      value: `$${formatDecimals(costToCall, assetDecimals, 2)}`,
    },
    {
      label: "Reward Cooldown",
      value: formatDuration(Number(rewardCooldown)),
    },
    {
      label: "Fee Recipient",
      value: feeRecipient === zeroAddress ? "None" : (
        <Link href={getEtherscanAddressLink(feeRecipient)} target="_blank" rel="noopener">
          {truncateAddress(feeRecipient)}
        </Link>
      ),
    },
  ];

  // Gating & Access Control
  const gatingParams = [
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
  ];

  // Configuration Flags
  const configParams = [
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
      label: "Tiers Enabled",
      value: isTiersEnabled ? "True" : "False",
    },
  ];

  const contracts = [
    {
      label: "CreditVault",
      address: <AddressDisplay address={clubAddress} className="font-mono" />
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

  const renderParameterSection = (title: string, params: any[]) => (
    <div className="ClubParametersModal__section">
      <h3 className="ClubParametersModal__section-title">{title}</h3>
      <div className="ClubParametersModal__params">
        {params.map((param, index) => (
          <div key={index} className="ClubParametersModal__param">
            <span className="ClubParametersModal__param-label">{param.label}:</span>
            <span className="ClubParametersModal__param-value">{param.value}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <ModalOverlay onClick={close} />
      <Modal className="ClubParametersModal">
        <Modal.Header title="Club Parameters" onClose={close} />
        <Modal.Body>
          <div className="ClubParametersModal__content">
            {renderParameterSection("Club Info & Metadata", clubInfoParams)}
            {renderParameterSection("Authorization & Roles", authParams)}
            {renderParameterSection("Fundraising & Financial", fundraisingParams)}
            {renderParameterSection("Membership & Access", membershipParams)}
            {renderParameterSection("Time & Vesting", timeParams)}
            {renderParameterSection("Fees & Recipients", feeParams)}
            {renderParameterSection("Gating & Access Control", gatingParams)}
            {renderParameterSection("Configuration Flags", configParams)}
            
            <div className="ClubParametersModal__section">
              <h3 className="ClubParametersModal__section-title">Contract Addresses</h3>
              <div className="ClubParametersModal__contracts">
                {contracts.map((contract, index) => (
                  <div key={index} className="ClubParametersModal__contract">
                    <span className="ClubParametersModal__contract-label">{contract.label}:</span>
                    <span className="ClubParametersModal__contract-address">{contract.address}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
