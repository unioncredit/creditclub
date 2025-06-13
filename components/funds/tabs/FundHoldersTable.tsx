import {
  ColumnDef
} from "@tanstack/react-table"
import { Address } from "viem";

import { DataTable } from "@/components/ui/DataTable";
import { formatDecimals, truncateAddress } from "@/lib/format";
import { PrimaryLabel } from "@/components/shared/PrimaryLabel";
import { useTokenPriceData } from "@/hooks/useTokenPriceData";
import { useClubData } from "@/hooks/useClubData";
import { Avatar } from "@/components/shared/Avatar";
import { useHolders } from "@/hooks/useHolders";

interface FundHolderRow {
  id: number;
  shares: string;
  marketValue: string;
}

const columns: ColumnDef<FundHolderRow>[] = [
  // {
  //   accessorKey: "id",
  //   header: "#",
  // },
  {
    id: "avatar",
    accessorKey: "address",
    header: "",
    cell: ({ getValue }) => (
      <Avatar address={getValue() as Address} size={32} className="flex justify-center mx-auto" />
    )
  },
  {
    accessorKey: "address",
    header: "Fund Holder",
    cell: ({ getValue }) => {
      const address = getValue() as Address;

      return (
        <div>
          <p><PrimaryLabel address={address} /></p>
          <p className="text-stone-400">{truncateAddress(address)}</p>
        </div>
      )
    }
  },
  {
    accessorKey: "shares",
    header: () => <div className="text-right">Shares</div>,
    cell: ({ getValue }) => (
      <div className="text-right">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "marketValue",
    header: () => <div className="text-right">Market value</div>,
    cell: ({ getValue }) => (
      <div className="text-right">{getValue() as string}</div>
    ),
  },
]

export const FundHoldersTable = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const { data: holders, loading } = useHolders(clubAddress);
  const { data: clubData } = useClubData(clubAddress);
  const { data: priceData }  = useTokenPriceData(clubAddress);

  const { decimals, totalSupply } = clubData;
  const { price: tokenPrice } = priceData;

  // Debug logging
  console.log('FundHoldersTable - Debug info:', {
    clubAddress,
    holdersCount: holders.length,
    totalSupply: totalSupply.toString(),
    totalSupplyFormatted: formatDecimals(totalSupply, decimals),
    loading,
    decimals,
    tokenPrice,
  });

  const rows: FundHolderRow[] = holders.map(({ address, amount }, index) => ({
    id: index,
    address,
    shares: formatDecimals(amount, decimals),
    marketValue: `$${(parseFloat(formatDecimals(amount, decimals)) * tokenPrice).toFixed(2)}`,
  }));

  // If total supply > 0 but no holders, show a debug message
  if (totalSupply > 0n && holders.length === 0 && !loading) {
    console.warn('FundHoldersTable - Potential issue: Total supply is greater than 0 but no holders found in Ponder database');
  }

  // @ts-ignore
  return (
    <div>
      {/* Debug info for development */}
      {process.env.NODE_ENV === 'development' && (
                 <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-xs font-mono">
           <div className="font-bold mb-1">Debug Info:</div>
           <div>Club Address: {clubAddress}</div>
           <div>Total Supply: {formatDecimals(totalSupply, decimals)} tokens</div>
           <div>Holders Found: {holders.length}</div>
           <div>Loading: {loading ? 'Yes' : 'No'}</div>
           <div>Factory Address: {process.env.NEXT_PUBLIC_FACTORY_ADDRESS || 'Not set'}</div>
          {totalSupply > 0n && holders.length === 0 && !loading && (
            <div className="text-red-600 font-bold mt-2">
              ⚠️ Issue: Token has supply but no holders in database
            </div>
          )}
        </div>
      )}
      <DataTable columns={columns} data={rows} />
    </div>
  )
};