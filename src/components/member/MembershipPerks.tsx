import "./MembershipPerks.scss";

import React from "react";
import {
  Text,
  Heading,
  Skeleton,
  // @ts-ignore
} from "@unioncredit/ui";

import { format, formattedNumber } from "@/utils/format.ts";
import { useMemberCredit } from "@/hooks/useMemberCredit.ts";
import { useVesting } from "@/hooks/useVesting.ts";
import { useNftInfo } from "@/hooks/useNftInfo.ts";
import { generateIpfsLink } from "@/utils/links.ts";

export const MembershipPerks = ({
  title = "BCC Membership",
  subtitle = "Perks",
  additionalPerks = [],
}: {
  title?: string | React.ReactNode;
  subtitle?: string;
  additionalPerks?: string[]
}) => {
  const { name, image } = useNftInfo();
  const { new: creditPerMember } = useMemberCredit();
  const { data: vestingData } = useVesting();
  const { startingPercentage, duration } = vestingData;

  return (
    <div className="MembershipPerks">
      <div className="MembershipPerks__image">
        {image ? (
          <img src={generateIpfsLink(image)} alt={name} />
        ) : (
          <Skeleton width="inherit" height="inherit" grey={200} shimmer />
        )}
      </div>
      <div className="MembershipPerks__content">
        <Heading level={3}>{title}</Heading>
        <Text weight="bold">{subtitle}:</Text>

        <ul>
          <li>Starting Credit: ${(formattedNumber(creditPerMember) * startingPercentage).toFixed(0)}</li>
          <li>Vesting: {duration} days</li>
          <li>Credit after Vest: ${format(creditPerMember, 0)}</li>

          {additionalPerks.map(perk => (
            <li>{perk}</li>
          ))}
        </ul>
      </div>
    </div>
  )
};