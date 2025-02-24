import {
  LinkOutIcon,
  ManageIcon,
  DelegateIcon,
  // @ts-ignore
} from "@unioncredit/ui";
import { Address } from "viem";
import React from "react";
import Image from "next/image";

import FarcasterIcon from "@/assets/socials/farcaster.svg";
import GithubIcon from "@/assets/socials/github.svg";
import LensIcon from "@/assets/socials/lens.svg";

import { Badge } from "@/components/ui/Badge";
import { truncateAddress } from "@/lib/format";
import { createIpfsImageUrl, getEtherscanAddressLink } from "@/lib/links";
import { usePrimaryLabel } from "@/hooks/usePrimaryLabel";
import { useTalentSocials } from "@/hooks/useTalentSocials";

import { useClubData } from "@/hooks/useClubData";
import { useClubContacts } from "@/hooks/useClubContacts";
import { useClubMemberNft } from "@/hooks/useClubMemberNft";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

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
  const { copy: copyContractAddr, copied: copiedContractAddr } = useCopyToClipboard();
  const { copy: copyCreatorAddr, copied: copiedCreatorAddr } = useCopyToClipboard();
  const { data: clubData } = useClubData(clubAddress);
  const { data: clubContacts } = useClubContacts(clubAddress)
  const { data: clubMemberNftData } = useClubMemberNft(clubAddress);
  const { data: socials } = useTalentSocials(clubData.creatorAddress);
  const { data: deployerName } = usePrimaryLabel({
    address: clubData.creatorAddress,
    shouldTruncate: true,
  });

  const { name, symbol, creatorAddress } = clubData;
  const { description, image: nftIpfsUrl } = clubMemberNftData;

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
      <div className="flex items-between pb-4 border-b border-gray-200 sm:items-start">
        <Image
          width={58}
          height={58}
          src={createIpfsImageUrl(nftIpfsUrl)}
          alt="Fund Image"
          className="rounded-xl border border-stone-200 min-w-[42px]"
        />

        <div className="pl-3">
          <h1 className="font-sans text-2xl font-medium">{name} ({symbol})</h1>

          <ul className="flex gap-1 flex-wrap">
            {clubBadges.map(({ prefix, label, url, value, copy, copied }, index) => (
              <li key={index}>
                <Badge
                  className="whitespace-nowrap"
                >
                  {prefix}:
                  <span
                    onClick={() => copy(value)}
                    className="cursor-pointer hover:underline"
                  >
                    {copied ? "Copied!" : label}
                  </span>

                  <LinkOutIcon
                    width={16}
                    height={16}
                    onClick={() => open(url)}
                    className="ml-0.5 cursor-pointer" />
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
        {description}
      </p>
    </div>
  )
};