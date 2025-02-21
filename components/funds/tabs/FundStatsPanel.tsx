import { StatGrid, StatGridRow } from "@/components/shared/StatGrid";
import { Address } from "viem";
import { useClubData } from "@/hooks/useClubData";
import { format, formatDecimals } from "@/lib/format";
import { useToken } from "@/hooks/useToken";
import { useClubContacts } from "@/hooks/useClubContacts";

export const FundStatsPanel = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const { token } = useToken();
  const { data: clubData } = useClubData(clubAddress);
  const { data: clubContacts } = useClubContacts(clubAddress);

  const defaultedContacts = clubContacts.filter((v) => v.isOverdue);
  const defaultedAmount = defaultedContacts.reduce((acc, c) => acc + c.locking, 0n);

  const {
    decimals,
    initialRaise,
    totalAssets,
    stakedBalance,
    totalSupply,
    totalLockedStake
  } = clubData;

  const fundStatsRows: StatGridRow[] = [
    {
      name: "Initial Raise",
      value: `$${formatDecimals(initialRaise, decimals)}`
    },
  ];

  const assetRows: StatGridRow[] = [
    {
      name: "Staked USDC",
      value: `$${format(stakedBalance, token)}`
    },
    {
      name: "Total Assets",
      value: `${formatDecimals(totalAssets, decimals)}`
    },
    {
      name: "Total Supply",
      value: `${formatDecimals(totalSupply, decimals)}`
    },
  ];

  const debtRows: StatGridRow[] = [
    {
      name: "Utilized Stake",
      value: `$${format(totalLockedStake, token)}`
    },
    {
      name: "Overdue Stake",
      value: `$${format(defaultedAmount, token)}`
    },
    {
      name: "Write-offs",
      value: "0"
    },
  ];

  const trusteeStatsRows: StatGridRow[] = [
    {
      name: "# of Trustees",
      value: clubContacts.length,
    },
    {
      name: "# of Borrowers",
      value: clubContacts.filter(c => c.locking > 0n).length,
    },
    {
      name: "# of Shares",
      value: clubContacts.reduce((acc, curr) => acc + curr.numShares, 0n).toString(),
    },
    {
      name: "# of Defaulted",
      value: defaultedContacts.length,
    },
  ];

  const earningsStatsRows: StatGridRow[] = [
    {
      name: "Interest",
      value: "0%",
    },
    {
      name: "Change in assets",
      value: "0",
    },
    {
      name: "Est. APY",
      value: "0%"
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-1">
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