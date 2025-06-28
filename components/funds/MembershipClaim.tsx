// @ts-ignore
import { AddressBookIcon } from "@unioncredit/ui";
import { useAccount } from "wagmi";
import React from "react";

import CheckIcon from "@/assets/check-icon.svg";
import { cn } from "@/lib/utils";
import { RoundedButton } from "@/components/ui/RoundedButton";
import { useModals } from "@/providers/ModalManagerProvider";
import { MINT_NFT_MODAL } from "@/components/modals/MintNftModal";
import { Address } from "viem";
import { useClubData } from "@/hooks/useClubData";
import { useGatingToken } from "@/hooks/useGatingToken";
import { useInvites } from "@/hooks/useInvites";
import { useClubContacts } from "@/hooks/useClubContacts";
import { useClubMemberNft } from "@/hooks/useClubMemberNft";
import { useIsQualified } from "@/hooks/useIsQualified";

export const MembershipClaim = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const { isConnected } = useAccount();
  const { open: openModal } = useModals();
  const { data: clubData } = useClubData(clubAddress);
  const { data: clubContacts } = useClubContacts(clubAddress);
  const { data: gatingTokenData } = useGatingToken(clubAddress);
  const { data: inviteData } = useInvites(clubAddress);
  const { data: memberNftdata } = useClubMemberNft(clubAddress);
  const { data: isQualified } = useIsQualified(clubAddress);

  const { name = "", image = "", isActivated = false } = clubData || {};
  const { maxMembers = 0n } = memberNftdata || {};

  const {
    memberInvitesEnabled = false,
    qualified: inviteQualified = false
  } = inviteData || {};

  const {
    enabled: tokenEnabled = false,
    qualified: tokenQualified = false,
    symbol = "",
    name: tokenName = ""
  } = gatingTokenData || {};

  const requirementRows = [
    {
      label: "Club activated",
      completed: isActivated,
    },
    ...(tokenEnabled ? [
      {
        label: `Holder of ${tokenName} (${symbol})`,
        completed: tokenQualified,
      },
    ] : []),
    ...(memberInvitesEnabled ? [
      {
        label: "Invited by member",
        completed: inviteQualified,
      },
    ] : []),
  ]

  return (
    <div className="p-4 border rounded-2xl">
      <header className="flex justify-between gap-2 border-b pb-4">
        <h2 className="text-lg text-stone-500 font-medium">Membership Claim</h2>

        <div className="flex items-center gap-1">
          <AddressBookIcon width={24} height={24} />
          <p className="text-sm text-blue-600">{Number(maxMembers || 0) - (clubContacts?.length || 0)} Remaining</p>
        </div>
      </header>

      {isConnected && (
        <div className={cn("mt-4 flex items-center justify-center gap-3 py-3 px-5 bg-slate-100 rounded-2xl border")}>
          <img
            src={image}
            alt="Fund Image"
            className={cn("rounded-xl border border-stone-200 w-[42px] h-[42px] min-w-[42px]", {
              "opacity-20": !isQualified,
            })}
          />
          <p className="text-lg">You are {!isQualified && "not"} qualified</p>
        </div>
      )}

      <h3 className="mt-4 font-light text-blue-600">Who can mint a membership?</h3>
      <ul className="mt-1.5">
        {requirementRows.map(({ label, completed }, index) => (
          <li key={index} className={cn("flex gap-1 items-center text-xs mt-1", {
            "font-medium": completed,
          })}>
            <CheckIcon width={24} height={24} className={cn("fill text-stone-400", {
              "text-green-600": completed,
            })} />
            {label}
          </li>
        ))}
      </ul>

      <RoundedButton
        size="large"
        variant="dark"
        className="mt-4 w-full"
        onClick={() => openModal(MINT_NFT_MODAL, { clubAddress })}
      >
        Claim Credit from {name}
      </RoundedButton>
    </div>
  )
};