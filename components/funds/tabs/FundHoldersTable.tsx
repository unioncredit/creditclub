import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel
} from "@tanstack/react-table"
import { Address } from "viem";
import { useMemo, useState } from "react";

import { DataTable } from "@/components/ui/DataTable";
import { formatDecimals, truncateAddress } from "@/lib/format";
import { PrimaryLabel } from "@/components/shared/PrimaryLabel";
import { useTokenPriceData } from "@/hooks/useTokenPriceData";
import { useClubData } from "@/hooks/useClubData";
import { Avatar } from "@/components/shared/Avatar";
import { useHolders } from "@/hooks/useHolders";
import { useBatchEns } from "@/hooks/useBatchEns";
import { useClubHolders } from "@/hooks/useClubHolders";
import { Table } from "@/components/shared/Table";

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
  const { data: holders = [], isLoading } = useClubHolders(clubAddress);
  const addresses = useMemo(() => holders.map(h => h.id), [holders]);
  const { data: ensData, isLoading: ensLoading } = useBatchEns(addresses);

  const { data: clubData } = useClubData(clubAddress);
  const { data: priceData }  = useTokenPriceData(clubAddress);

  const { decimals } = clubData;
  const { price: tokenPrice } = priceData;

  const rows: FundHolderRow[] = holders.map(({ id: address, amount }, index) => ({
    id: index,
    address,
    shares: formatDecimals(amount, decimals),
    marketValue: `$${(parseFloat(formatDecimals(amount, decimals)) * tokenPrice).toFixed(2)}`,
  }));

  const table = useTable({
    data: holders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Table
      table={table}
      isLoading={isLoading || ensLoading}
    />
  );
};