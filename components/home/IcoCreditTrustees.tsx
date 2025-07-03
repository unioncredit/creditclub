import { Address } from "viem";
import { useAccount } from "wagmi";

import { StatGrid, type StatGridRow } from "@/components/shared/StatGrid";
import { useClubContacts } from "@/hooks/useClubContacts";
import { useNewMemberData } from "@/hooks/useNewMemberData";
import { useToken } from "@/hooks/useToken";
import { format, formatDecimals } from "@/lib/format";
import { useIsQualified } from "@/hooks/useIsQualified";
import { useClubMemberNft } from "@/hooks/useClubMemberNft";
import { useClubData } from "@/hooks/useClubData";
import { useErc20Token } from "@/hooks/useErc20Token";

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
  const { data: clubData } = useClubData(clubAddress);
  const { data: assetToken } = useErc20Token(clubData?.assetAddress);

  const initialTrustAmount: bigint = newMemberData?.initialTrustAmount ?? 0n;
  const membershipCost: bigint = memberNftData?.membershipCost ?? 0n;
  const maxMembers: bigint = memberNftData?.maxMembers ?? 0n;
  const assetTokenDecimals: number = assetToken?.decimals ?? 18;

  const rows: StatGridRow[] = [
    {
      name: "Who can mint?",
      value: "Top 1000 builder score"
    },
    {
      name: "Trustees",
      value: `${clubContacts?.length || 0} claimed of ${Number(maxMembers)} available`
    },
    {
      name: "Cost to mint",
      value: `$${format(membershipCost, token)}`
    },
    {
      name: "Starting credit",
      value: isConnected ? `$${formatDecimals(initialTrustAmount, assetTokenDecimals)}` : "Connect Wallet"
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