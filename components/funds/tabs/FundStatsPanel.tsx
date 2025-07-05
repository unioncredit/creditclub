import { StatGrid, StatGridRow } from "@/components/shared/StatGrid";
import { Address } from "viem";
import { useClubData } from "@/hooks/useClubData";
import { format, formatDecimals } from "@/lib/format";
import { useToken } from "@/hooks/useToken";
import { useClubContacts } from "@/hooks/useClubContacts";
import { useErc20Token } from "@/hooks/useErc20Token";
import { calculateInterestRate } from "@/lib/utils";
import { useUnionData } from "@/providers/UnionDataProvider";
import { useClubAuction } from "@/hooks/useClubAuction";

export const FundStatsPanel = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const { token } = useToken();
  const { data: clubData, isLoading: isClubDataLoading } = useClubData(clubAddress);
  const { data: clubContacts } = useClubContacts(clubAddress);
  const { data: auctionData } = useClubAuction(clubAddress);
  const { data: assetToken } = useErc20Token(clubData?.assetAddress);
  const { data: protocol } = useUnionData();

  if (isClubDataLoading) {
    return <div>Loading...</div>;
  }

  const defaultedContacts = clubContacts.filter((v) => v.isOverdue);
  const defaultedAmount = defaultedContacts.reduce((acc, c) => acc + c.locking, 0n);

  const {
    decimals,
    totalAssets,
    stakedBalance,
    totalSupply,
    totalLockedStake
  } = clubData;

  const {
    minTarget
  } = auctionData;

  const {
    borrowRatePerSecond,
  } = protocol;

  const {
    decimals: assetDecimals
  } = assetToken;

  const fundStatsRows: StatGridRow[] = [
    {
      name: "Initial Raise",
      value: `$${formatDecimals(minTarget, assetDecimals)}`
    },
  ];

  const assetRows: StatGridRow[] = [
    {
      name: "Staked USDC",
      value: `$${format(stakedBalance, token)}`
    },
    {
      name: "Total Assets",
      value: `${formatDecimals(totalAssets, assetDecimals)}`
    },
    {
      name: "Total Supply",
      value: `${formatDecimals(totalSupply, decimals, 0)}` // Supply should be a whole number
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
      value: formatDecimals(clubContacts.reduce((acc, curr) => acc + curr.numShares, 0n), decimals),
    },
    {
      name: "# of Defaulted",
      value: defaultedContacts.length,
    },
  ];

  const earningsStatsRows: StatGridRow[] = [
    {
      name: "Interest",
      value: `${format(
        calculateInterestRate(borrowRatePerSecond, token) * 100n,
        token,
      )}%`,
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