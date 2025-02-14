import { StatGrid, StatGridRow } from "@/components/shared/StatGrid";

export const FundStatsPanel = () => {
  const fundStatsRows: StatGridRow[] = [
    {
      name: "Initial Raise",
      value: "X"
    },
  ];

  const assetRows: StatGridRow[] = [
    {
      name: "Total Assets",
      value: "X"
    },
    {
      name: "Staked USDC",
      value: "X"
    },
    {
      name: "uToken USDC",
      value: "X"
    },
  ];

  const debtRows: StatGridRow[] = [
    {
      name: "Utilized Stake",
      value: "X"
    },
    {
      name: "Overdue Stake",
      value: "X"
    },
    {
      name: "Write-offs",
      value: "X"
    },
  ];

  const trusteeStatsRows: StatGridRow[] = [
    {
      name: "# of Trustees",
      value: "X"
    },
    {
      name: "# of Borrowers",
      value: "X"
    },
    {
      name: "Humans",
      value: "X"
    },
    {
      name: "uToken USDC",
      value: "X"
    },
  ];

  const earningsStatsRows: StatGridRow[] = [
    {
      name: "Interest",
      value: "X"
    },
    {
      name: "Change in assets",
      value: "X"
    },
    {
      name: "Est. APY",
      value: "X"
    },
  ];

  return (
    <div className="grid grid-cols-2">
      <div>
        <StatGrid title="Fund Stats" rows={fundStatsRows} className="border-l-0 border-b-0" />
        <StatGrid title="Assets" rows={assetRows} className="border-l-0 border-b-0" />
        <StatGrid title="Debt" rows={debtRows} className="border-l-0 border-b-0" />
      </div>

      <div className="flex flex-col">
        <StatGrid title="Trustee Stats" rows={trusteeStatsRows} className="border-l-0 border-r-0 border-b-0 flex-1" />
        <StatGrid title="Earnings" rows={earningsStatsRows} className="border-l-0 border-r-0 border-b-0" />
      </div>
    </div>
  )
};