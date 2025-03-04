import { StatGrid, type StatGridRow } from "@/components/shared/StatGrid";
import { Address } from "viem";
import { useClubData } from "@/hooks/useClubData";
import { useClubMemberNft } from "@/hooks/useClubMemberNft";
import { useIcoStats } from "@/hooks/useIcoStats";
import { formatDuration } from "@/lib/utils";
import { useClubContacts } from "@/hooks/useClubContacts";
import { useClubActivation } from "@/hooks/useClubActivation";

export const IcoFundOverview = ({
  clubAddress,
  className,
}: {
  clubAddress: Address;
  className?: string;
}) => {
  const { data: clubData } = useClubData(clubAddress);
  const { data: clubMemberNftData } = useClubMemberNft(clubAddress);
  const { data: icoStats } = useIcoStats(clubAddress);
  const { data: clubContacts } = useClubContacts(clubAddress);
  const { activated, locked, remaining } = useClubActivation(clubAddress);

  const { name, symbol, lockupPeriod, memberMax } = clubData;
  const { description } = clubMemberNftData;
  const { current, goal } = icoStats;

  const rows: StatGridRow[] = [
    {
      name: "Name",
      value: `${symbol} (${name})`
    },
    {
      name: "Description",
      value: description
    },
    // {
    //   name: "Qualified",
    //   value: <Link href="#" className="underline">Invited_List.csv</Link>
    // },
    {
      name: "Trustees",
      value: `${clubContacts.length} claimed / ${memberMax} available`
    },
    {
      name: "Initial Raise",
      value: `$${current} of $${goal}`
    },
    {
      name: "Redeemable",
      value: activated
        ? locked
          ? formatDuration(remaining)
          : "Now"
        : formatDuration(Number(lockupPeriod)),
    }
  ];

  return <StatGrid title="Fund Overview" rows={rows} className={className} />
};