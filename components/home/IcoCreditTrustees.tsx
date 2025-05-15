import { Address } from "viem";
import { useAccount } from "wagmi";

import { StatGrid, type StatGridRow } from "@/components/shared/StatGrid";
import { useClubContacts } from "@/hooks/useClubContacts";
import { useNewMemberData } from "@/hooks/useNewMemberData";
import { useToken } from "@/hooks/useToken";
import { format } from "@/lib/format";
import { useIsQualified } from "@/hooks/useIsQualified";
import { useClubMemberNft } from "@/hooks/useClubMemberNft";

export const IcoCreditTrustees = ({
  clubAddress,
  className,
}: {
  clubAddress: Address;
  className?: string;
}) => {
  const { token } = useToken();
  const { address, isConnected } = useAccount();
  const { data: clubContacts } = useClubContacts(clubAddress);
  const { data: newMemberData } = useNewMemberData(address, clubAddress);
  const { data: isQualified } = useIsQualified(clubAddress);
  const { data: memberNftData } = useClubMemberNft(clubAddress);

  const { initialTrustAmount } = newMemberData;
  const { membershipCost, maxMembers } = memberNftData;

  const rows: StatGridRow[] = [
    {
      name: "Who can mint?",
      value: "Top 1000 builder score"
    },
    {
      name: "Trustees",
      value: `${clubContacts.length} claimed of ${maxMembers} available`
    },
    {
      name: "Cost to mint",
      value: `$${format(membershipCost, token)}`
    },
    {
      name: "Starting credit",
      value: isConnected ? `$${format(initialTrustAmount, token)}` : "Connect Wallet"
    },
    {
      name: "Do you qualify?",
      value: isConnected
        ? isQualified ? "Yes" : "No"
        : "Connect Wallet"
    },
  ];

  return <StatGrid title="Builder Credit Trustees" rows={rows} className={className} />
};