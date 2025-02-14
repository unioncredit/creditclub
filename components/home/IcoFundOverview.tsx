import { StatGrid, type StatGridRow } from "@/components/shared/StatGrid";
import Link from "next/link";

export const IcoFundOverview = ({
  className,
}: {
  className?: string;
}) => {
  const rows: StatGridRow[] = [
    {
      name: "Name",
      value: "FUNDT (Fund Name)"
    },
    {
      name: "Description",
      value: <p className="text-xs">OG Credit Club Beta Testers. This is additional text to fill in the space to see what it will look like. This is addition to oaigueaoiugeoiaigue.</p>
    },
    {
      name: "Qualified",
      value: <Link href="#" className="underline">Invited_List.csv</Link>
    },
    {
      name: "Trustees",
      value: "0 claimed / 1000 available"
    },
    {
      name: "Initial Raise",
      value: "$3,000 of $5,000"
    },
    {
      name: "Locked Until",
      value: "Jan 25, 2025"
    },
  ];

  return <StatGrid title="Fund Overview" rows={rows} className={className} />
};