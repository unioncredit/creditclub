import {
  ColumnDef
} from "@tanstack/react-table"
import { DataTable } from "@/components/ui/DataTable";
import { format } from "@/lib/format";
import { TOKENS } from "@/constants";

interface FundHolderRow {
  id: number;
  shares: bigint;
  marketValue: string;
}

const rows: FundHolderRow[] = [
  {
    id: 1,
    shares: 0n,
    marketValue: "$1,000",
  },
  {
    id: 2,
    shares: 0n,
    marketValue: "$1,000",
  },
  {
    id: 3,
    shares: 0n,
    marketValue: "$1,000",
  },
  {
    id: 4,
    shares: 0n,
    marketValue: "$1,000",
  },
  {
    id: 5,
    shares: 0n,
    marketValue: "$1,000",
  },
]

const columns: ColumnDef<FundHolderRow>[] = [
  {
    accessorKey: "id",
    header: "#",
  },
  {
    id: "avatar",
    header: "",
    cell: ({ row }) => (
      <p>{row.id}</p>
    )
  },
  {
    header: "Fund Holder",
    cell: () => (
      <div>
        <p>geraldhost.eth</p>
        <p className="text-stone-400">0x34Ea...b66e</p>
      </div>
    )
  },
  {
    accessorKey: "shares",
    header: () => <div className="text-right">Shares</div>,
    cell: ({ getValue }) => (
      <div className="text-right">${format(getValue() as bigint, TOKENS.UNION, 0)}</div>
    ),
  },
  {
    accessorKey: "marketValue",
    header: () => <div className="text-right">Trust Per Trustee</div>,
    cell: ({ getValue }) => (
      <div className="text-right">{getValue() as string}</div>
    ),
  },
]

export const FundHoldersTable = () => {
  return <DataTable columns={columns} data={rows} />
};