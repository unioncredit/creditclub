import {
  ColumnDef,
  SortingState
} from "@tanstack/react-table"
import { Address } from "viem";
import { useState } from "react";

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
  numericShares?: number; // Added for sorting
  numericValue?: number; // Added for sorting
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
    accessorKey: "shares",
    header: ({ column }) => (
      <div className="text-right cursor-pointer flex items-center justify-end gap-1" onClick={() => column.toggleSorting()}>
        Shares
        <span className="inline-flex flex-col">
          <span className={`opacity-${column.getIsSorted() === "asc" ? "100" : "30"} -mb-1`}>▲</span>
          <span className={`opacity-${column.getIsSorted() === "desc" ? "100" : "30"}`}>▼</span>
        </span>
      </div>
    ),
    cell: ({ getValue }) => (
      <div className="text-right">{getValue() as string}</div>
    ),
    sortingFn: (rowA, rowB) => {
      return rowA.original.numericShares! - rowB.original.numericShares!;
    }
  },
  {
    accessorKey: "marketValue",
    header: ({ column }) => (
      <div className="text-right cursor-pointer flex items-center justify-end gap-1" onClick={() => column.toggleSorting()}>
        Market value
        <span className="inline-flex flex-col">
          <span className={`opacity-${column.getIsSorted() === "asc" ? "100" : "30"} -mb-1`}>▲</span>
          <span className={`opacity-${column.getIsSorted() === "desc" ? "100" : "30"}`}>▼</span>
        </span>
      </div>
    ),
    cell: ({ getValue }) => (
      <div className="text-right">{getValue() as string}</div>
    ),
    sortingFn: (rowA, rowB) => {
      return rowA.original.numericValue! - rowB.original.numericValue!;
    }
  },
]

export const FundHoldersTable = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const { data: holders } = useHolders();
  const { data: clubData } = useClubData(clubAddress);
  const { data: priceData }  = useTokenPriceData(clubAddress);

  const { decimals } = clubData;
  const { price: tokenPrice } = priceData;

  const rows: FundHolderRow[] = holders.map(({ id: address, amount }, index) => {
    const formattedShares = formatDecimals(amount, decimals);
    const sharesNum = parseFloat(formattedShares);
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

  return (
    <DataTable 
      columns={columns} 
      data={rows} 
      sorting={sorting}
      onSortingChange={setSorting}
    />
  );
};