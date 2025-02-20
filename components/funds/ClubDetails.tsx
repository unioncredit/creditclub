import {
  LinkOutIcon,
  ManageIcon,
  DelegateIcon,
  // @ts-ignore
} from "@unioncredit/ui";
import { Address } from "viem";

import BlackBear from "@/assets/black-bear.svg";
import FarcasterIcon from "@/assets/socials/farcaster.svg";
import GithubIcon from "@/assets/socials/github.svg";
import LensIcon from "@/assets/socials/lens.svg";

import { IconCube } from "@/components/shared/IconCube";
import { Badge } from "@/components/ui/Badge";
import { truncateAddress } from "@/lib/format";
import { getEtherscanAddressLink } from "@/lib/links";
import { usePrimaryLabel } from "@/hooks/usePrimaryLabel";
import { useTalentSocials } from "@/hooks/useTalentSocials";
import React from "react";
import { useClubData } from "@/hooks/useClubData";
import { useClubContacts } from "@/hooks/useClubContacts";

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
  const { data: clubData } = useClubData(clubAddress);
  const { data: clubContacts } = useClubContacts(clubAddress)
  const { data: socials } = useTalentSocials(clubData.creatorAddress);
  const { data: deployerName } = usePrimaryLabel({
    address: clubData.creatorAddress,
    shouldTruncate: true,
  });

  const { name, symbol, creatorAddress } = clubData;

  const clubBadges = [
    {
      label: `CA:${truncateAddress(clubAddress)}`,
      url: getEtherscanAddressLink(clubAddress),
    },
    {
      label: `BY:${deployerName}`,
      url: getEtherscanAddressLink(creatorAddress),
    }
  ];

  const detailBadges = [
    ...socials.filter(s => DISPLAYED_SOCIALS.includes(s.source)).map((social) => ({
      label: social.profile_display_name,
      url: social.profile_url,
      icon: SocialIcons[social.source],
    })),
    {
      label: `${clubContacts.length} Members`,
      icon: DelegateIcon,
      url: null,
    }
  ];

  return (
    <div>
      <div className="flex items-between pb-4 border-b border-gray-200">
        <IconCube width={42} height={42} icon={BlackBear} color="#F4F4F6" />

        <div className="pl-3">
          <h1 className="font-sans text-2xl font-medium">{name} ({symbol})</h1>

          <ul className="flex gap-1">
            {clubBadges.map(({ label, url }, index) => (
              <li key={index}>
                <Badge
                  onClick={() => open(url)}
                  className="whitespace-nowrap"
                >
                  {label}
                  <LinkOutIcon width={16} height={16} className="ml-0.5" />
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 gap-2">
        <p className="flex items-center gap-1 font-sans font-medium text-lg">
          <ManageIcon width={24} height={24} />
          Details
        </p>

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
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
      </p>
    </div>
  )
};