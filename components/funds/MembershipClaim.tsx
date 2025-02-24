// @ts-ignore
import { AddressBookIcon } from "@unioncredit/ui";

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
import { useAccount } from "wagmi";
import { createIpfsImageUrl } from "@/lib/links";
import Image from "next/image";
import React from "react";
import { useClubMemberNft } from "@/hooks/useClubMemberNft";

export const MembershipClaim = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const { isConnected} = useAccount();
  const { open: openModal } = useModals();
  const { data: clubData } = useClubData(clubAddress);
  const { data: clubContacts } = useClubContacts(clubAddress);
  const { data: gatingTokenData } = useGatingToken(clubAddress);
  const { data: inviteData } = useInvites(clubAddress);
  const { data: memberNftdata } = useClubMemberNft(clubAddress);

  const { name, memberMax } = clubData;
  const { image: nftIpfsUrl } = memberNftdata;

  const {
    enabled: inviteEnabled,
    qualified: inviteQualified
  } = inviteData;

  const {
    enabled: tokenEnabled,
    qualified: tokenQualified,
    symbol,
    name: tokenName
  } = gatingTokenData;

  const isQualfified = (tokenEnabled && tokenQualified) || (inviteEnabled && inviteQualified);

  const requirementRows = [
    ...(tokenEnabled ? [
      {
        label: `Holder of ${tokenName} (${symbol})`,
        completed: tokenQualified,
      },
    ] : []),
    ...(inviteEnabled ? [
      {
        label: "Invited by a member or creator",
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
          <p className="text-sm text-blue-600">{Number(memberMax) - clubContacts.length} Remaining</p>
        </div>
      </header>

      {isConnected && (
        <div className={cn("mt-4 flex items-center justify-center gap-3 py-3 px-5 bg-stone-100 rounded-2xl border", {
          "border-green-600": isQualfified,
        })}>
          <Image
            width={48}
            height={48}
            src={createIpfsImageUrl(nftIpfsUrl)}
            alt="Fund Image"
            className={cn("rounded-xl border border-stone-200 min-w-[42px]", {
              "opacity-20": !isQualfified,
            })}
          />
          <p className="text-lg">You are {!isQualfified && "not"} qualified</p>
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