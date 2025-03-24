import {
  ColumnDef,
  SortingState,
  OnChangeFn
} from "@tanstack/react-table"
import { Address } from "viem";
import { useState, useCallback } from "react";

import { DataTable } from "@/components/ui/DataTable";
import { formatDecimals, truncateAddress } from "@/lib/format";
import { PrimaryLabel } from "@/components/shared/PrimaryLabel";
import { useTokenPriceData } from "@/hooks/useTokenPriceData";
import { useClubData } from "@/hooks/useClubData";
import { Avatar } from "@/components/shared/Avatar";
import { useHolders } from "@/hooks/useHolders";

interface FundHolderRow {
  id: number;
  address: Address;
  shares: string;
  marketValue: string;
  numericShares: number; // For sorting
  numericValue: number; // For sorting
}

const columns: ColumnDef<FundHolderRow>[] = [
  {
    id: "avatar",
    accessorKey: "address",
    header: "",
    cell: ({ getValue }) => (
      <Avatar address={getValue() as Address} size={32} className="flex justify-center mx-auto" />
    ),
    enableSorting: false
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
    id: "shares",
    accessorFn: (row) => row.numericShares,
    header: ({ column }) => (
      <div className="text-right cursor-pointer flex items-center justify-end gap-1">
        Shares
        <div className="ml-1 inline-flex flex-col">
          <span className={column.getIsSorted() === "asc" ? "text-black" : "text-gray-400"}>▲</span>
          <span className={column.getIsSorted() === "desc" ? "text-black" : "text-gray-400"}>▼</span>
        </div>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-right">{row.original.shares}</div>
    ),
  },
  {
    id: "marketValue",
    accessorFn: (row) => row.numericValue,
    header: ({ column }) => (
      <div className="text-right cursor-pointer flex items-center justify-end gap-1">
        Market value
        <div className="ml-1 inline-flex flex-col">
          <span className={column.getIsSorted() === "asc" ? "text-black" : "text-gray-400"}>▲</span>
          <span className={column.getIsSorted() === "desc" ? "text-black" : "text-gray-400"}>▼</span>
        </div>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-right">{row.original.marketValue}</div>
    ),
  },
]

export const FundHoldersTable = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const { data: holders = [] } = useHolders();
  const { data: clubData } = useClubData(clubAddress);
  const { data: priceData }  = useTokenPriceData(clubAddress);

  const handleSortingChange: OnChangeFn<SortingState> = useCallback((updaterOrValue) => {
    console.log('Sorting changed to:', updaterOrValue);
    setSorting(updaterOrValue);
  }, []);

  // Ensure clubData and priceData are available before processing
  const decimals = clubData?.decimals || 18; // Default to 18 if undefined
  const tokenPrice = priceData?.price || 0;

  const rows: FundHolderRow[] = holders.map(({ id: address, amount }, index) => {
    const formattedShares = formatDecimals(amount, decimals);
    const sharesNum = parseFloat(formattedShares) || 0;
    const marketValue = sharesNum * tokenPrice;
    
    return {
      id: index,
      address,
      shares: formattedShares,
      marketValue: `$${marketValue.toFixed(2)}`,
      numericShares: sharesNum,
      numericValue: marketValue
    };
  });

  console.log('Rendering holders table with data:', { 
    holders: holders.length, 
    rows: rows.length,
    decimals,
    tokenPrice
  });

  return (
    <DataTable 
      columns={columns} 
      data={rows} 
      sorting={sorting}
      onSortingChange={handleSortingChange}
    />
  );
};