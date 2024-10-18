import "./MembershipPerks.scss";

import {
  Text,
  Heading,
  // @ts-ignore
} from "@unioncredit/ui";

import NftImage from "@/assets/nft-prevew.svg";

import { format, formattedNumber } from "@/utils/format.ts";
import { useMemberCredit } from "@/hooks/useMemberCredit.ts";
import { useVesting } from "@/hooks/useVesting.ts";

export const MembershipPerks = () => {
  const { new: creditPerMember } = useMemberCredit();
  const { data: vestingData } = useVesting();
  const { startingPercentage, duration } = vestingData;

  return (
    <div className="MembershipPerks">
      <div className="MembershipPerks__image">
        <NftImage />
      </div>
      <div className="MembershipPerks__content">
        <Heading level={3}>BCC Membership</Heading>
        <Text weight="bold">Perks:</Text>

        <ul>
          <li>Initial Credit: ${(formattedNumber(creditPerMember) * startingPercentage).toFixed(0)}</li>
          <li>Vesting: {duration} days</li>
          <li>Credit after vest: ${format(creditPerMember, 0)}</li>
        </ul>
      </div>
    </div>
  )
};