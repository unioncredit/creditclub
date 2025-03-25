import {
  ColumnDef,
  SortingState
} from "@tanstack/react-table"
import { Address } from "viem";
import { useState } from "react";

import { DataTable } from "@/components/ui/DataTable";
import { format, truncateAddress } from "@/lib/format";
import { useHolders } from "@/hooks/useHolders";
import { PrimaryLabel } from "@/components/shared/PrimaryLabel";
import { Avatar } from "@/components/shared/Avatar";

interface FundHolderRow {
  address: Address;
  shares: string;
  marketValue: string;
  numericShares: number;
  numericMarketValue: number;
}

export const FundHoldersTable = ({
  tokenAddress,
  decimals,
  tokenPrice,
}: {
  tokenAddress: Address;
  decimals?: number;
  tokenPrice?: number;
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const { data: holders = [] } = useHolders(tokenAddress);
  
  // Safety for undefined values
  const actualDecimals = decimals || 18;
  const actualTokenPrice = tokenPrice || 0;

  console.log('Processing holder data:', { 
    holders: holders.length, 
    tokenPrice: actualTokenPrice,
    decimals: actualDecimals 
  });

  // Process data for rows
  const rows: FundHolderRow[] = holders.map((holder) => {
    const sharesStr = format(holder.value, actualDecimals);
    // Calculate market value safely
    const marketValueStr = `${(parseFloat(sharesStr) * actualTokenPrice).toFixed(2)}`;
    
    // Ensure we have valid numbers for sorting
    const numericShares = parseFloat(sharesStr) || 0;
    const numericMarketValue = parseFloat(marketValueStr) || 0;
    
    return {
      address: holder.owner,
      shares: sharesStr,
      marketValue: marketValueStr,
      numericShares,
      numericMarketValue
    };
  });

  // Define columns with improved meta for alignment
  const columns: ColumnDef<FundHolderRow>[] = [
    {
      id: "avatar",
      header: "",
      cell: ({ row }) => (
        <Avatar address={row.original.address} size={32} className="flex justify-center mx-auto" />
      ),
      enableSorting: false
    },
    {
      id: "address",
      accessorKey: "address",
      header: "Member",
      cell: ({ row }) => {
        const address = row.original.address;
        return (
          <div>
            <p><PrimaryLabel address={address} /></p>
            <p className="text-stone-400">{truncateAddress(address)}</p>
          </div>
        )
      },
      enableSorting: false
    },
    {
      id: "shares",
      accessorKey: "numericShares",
      header: "Shares",
      cell: ({ row }) => (
        <div className="text-right">{row.original.shares}</div>
      ),
      meta: { alignRight: true }
    },
    {
      id: "marketValue",
      accessorKey: "numericMarketValue",
      header: "Market value",
      cell: ({ row }) => (
        <div className="text-right">${row.original.marketValue}</div>
      ),
      meta: { alignRight: true }
    },
  ];

  return (
    <DataTable 
      columns={columns} 
      data={rows} 
      sorting={sorting}
      onSortingChange={setSorting}
    />
  );
};