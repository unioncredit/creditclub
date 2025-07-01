import {
  LinkOutIcon,
  ManageIcon,
  DelegateIcon,
  MarketingIcon,
  // @ts-ignore
} from "@unioncredit/ui";
import { Address } from "viem";
import React from "react";

import FarcasterIcon from "@/assets/socials/farcaster.svg";
import GithubIcon from "@/assets/socials/github.svg";
import LensIcon from "@/assets/socials/lens.svg";

import { Badge } from "@/components/ui/Badge";
import { truncateAddress } from "@/lib/format";
import { getEtherscanAddressLink } from "@/lib/links";
import { usePrimaryLabel } from "@/hooks/usePrimaryLabel";
import { useTalentSocials } from "@/hooks/useTalentSocials";

import { useClubData } from "@/hooks/useClubData";
import { useClubContacts } from "@/hooks/useClubContacts";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { RoundedButton } from "@/components/ui/RoundedButton";
import { useNativeShare } from "@/hooks/useNativeShare";
import { CLUB_PARAMETERS_MODAL } from "@/components/modals/ClubParametersModal";
import { useModals } from "@/providers/ModalManagerProvider";

const DISPLAYED_SOCIALS = ["farcaster", "github", "lens"];

const SocialIcons: Record<string, any> = {
  farcaster: FarcasterIcon,
  github: GithubIcon,
  lens: LensIcon,
};

export const ClubDetails = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const { open: openModal } = useModals();
  const { share, copied } = useNativeShare();
  const { copy: copyContractAddr, copied: copiedContractAddr } = useCopyToClipboard();
  const { copy: copyCreatorAddr, copied: copiedCreatorAddr } = useCopyToClipboard();
  const { data: clubData } = useClubData(clubAddress);
  const { data: clubContacts } = useClubContacts(clubAddress)
  const { data: socials } = useTalentSocials(clubData?.creatorAddress);
  const { data: deployerName } = usePrimaryLabel({
    address: clubData?.creatorAddress,
    shouldTruncate: true,
  });

  const { name = "", image = "", symbol = "", creatorAddress, description = "" } = clubData || {};

  const clubBadges = [
    {
      prefix: "CA",
      label: truncateAddress(clubAddress),
      url: getEtherscanAddressLink(clubAddress),
      value: clubAddress,
      copy: copyContractAddr,
      copied: copiedContractAddr,
    },
    {
      prefix: "BY",
      label: deployerName,
      url: getEtherscanAddressLink(creatorAddress),
      value: creatorAddress,
      copy: copyCreatorAddr,
      copied: copiedCreatorAddr,
    }
  ];

  const detailBadges = [
    ...(socials || []).filter(s => DISPLAYED_SOCIALS.includes(s.source)).map((social) => ({
      label: social.profile_display_name,
      url: social.profile_url,
      icon: SocialIcons[social.source],
    })),
    {
      label: `${clubContacts?.length || 0} Members`,
      icon: DelegateIcon,
      url: null,
    }
  ];

  return (
    <div>
      <div className="flex items-between pb-4 border-b border-gray-200 sm:items-start sm:flex-col">
        <div className="sm:flex sm:justify-between sm:w-full">
          <img
            src={image}
            alt="Fund Image"
            className="rounded-xl border border-stone-200 w-[58px] h-[58px] min-w-[58px]"
          />

          <RoundedButton
            size="pill"
            className="font-mono hidden sm:flex"
            onClick={() => share({
              url: String(process.env.NEXT_PUBLIC_URL || window.location.origin),
              title: `Join me in ${name}`,
              text: description,
            })}
          >
            <MarketingIcon width={16} />
            {copied ? "Copied!" : "Share"}
          </RoundedButton>
        </div>

        <div className="pl-3 w-full sm:pl-0">
          <div className="flex items-start justify-between w-full">
            <h1 className="font-sans text-2xl font-medium sm:mt-2">{name} ({symbol})</h1>

            <RoundedButton
              size="pill"
              className="font-mono sm:hidden"
              onClick={() => share({
                url: String(process.env.NEXT_PUBLIC_URL || window.location.origin),
                title: `Join me in ${name}`,
                text: description,
              })}
            >
              <MarketingIcon width={16} />
              {copied ? "Copied!" : "Share"}
            </RoundedButton>
          </div>

          <ul className="flex items-center gap-1 flex-wrap sm:mt-1">
            {clubBadges.map(({ prefix, label, url, value, copy, copied }, index) => (
              <li key={index} className="flex items-center gap-1">
                <span className="text-xs">{prefix} :</span>
                <Badge
                  className="whitespace-nowrap"
                >
                  <span
                    onClick={() => copy(value)}
                    className="cursor-pointer"
                  >
                    {copied ? "Copied!" : label}
                  </span>
                </Badge>
                <LinkOutIcon
                  width={16}
                  height={16}
                  onClick={() => open(url)}
                  className="cursor-pointer"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 gap-2">
        <button className="flex items-center gap-1 font-sans font-medium text-lg" onClick={() => openModal(CLUB_PARAMETERS_MODAL, { clubAddress })}>
          <ManageIcon width={24} height={24} />
          Details
        </button>

        <ul className="flex gap-1">
          {detailBadges.map(({ label, url, icon: Icon }, index) => (
            <li key={index} className="flex items-center gap-1">
              <Badge variant="outline" onClick={() => url && open(url)}>
                {Icon && <Icon width={16} height={16} className="mr-0.5" />}
                <span className="text-blue-600 font-sans font-normal">{label}</span>
              </Badge>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-stone-500 font-light mt-6">
        {description || "No description available"}
      </p>
    </div>
  )
};