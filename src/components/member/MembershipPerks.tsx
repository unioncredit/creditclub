import "./MembershipPerks.scss";

import React from "react";
import {
  Text,
  Heading,
  // @ts-ignore
} from "@unioncredit/ui";

import NftImage from "@/assets/nft-prevew.svg";

import { format, formattedNumber } from "@/utils/format.ts";
import { useMemberCredit } from "@/hooks/useMemberCredit.ts";
import { useVesting } from "@/hooks/useVesting.ts";

export const MembershipPerks = ({
  title = "BCC Membership",
  subtitle = "Perks",
  additionalPerks = [],
}: {
  title?: string | React.ReactNode;
  subtitle?: string;
  additionalPerks?: string[]
}) => {
  const { new: creditPerMember } = useMemberCredit();
  const { data: vestingData } = useVesting();
  const { startingPercentage, duration } = vestingData;

  return (
    <div className="MembershipPerks">
      <div className="MembershipPerks__image">
        <NftImage />
      </div>
      <div className="MembershipPerks__content">
        <Heading level={3}>{title}</Heading>
        <Text weight="bold">{subtitle}:</Text>

        <ul>
          <li>Initial Credit: ${(formattedNumber(creditPerMember) * startingPercentage).toFixed(0)}</li>
          <li>Vesting: {duration} days</li>
          <li>Credit after vest: ${format(creditPerMember, 0)}</li>

          {additionalPerks.map(perk => (
            <li>{perk}</li>
          ))}
        </ul>
      </div>
    </div>
  )
};