import { StatGrid, type StatGridRow } from "@/components/shared/StatGrid";

export const IcoCreditTrustees = ({
  className,
}: {
  className?: string;
}) => {
  const rows: StatGridRow[] = [
    {
      name: "Who can mint?",
      value: "Top 1000 builder score"
    },
    {
      name: "Trustees",
      value: "0 claimed of 150 available"
    },
    {
      name: "Starting credit",
      value: "$100"
    },
    {
      name: "Cost to mint",
      value: "$0"
    },
    {
      name: "Do you qualify?",
      value: "Yes / No"
    },
  ];

  return <StatGrid title="Builder Credit Trustees" rows={rows} className={className} />
};