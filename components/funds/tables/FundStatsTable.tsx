import {
  ColumnDef
} from "@tanstack/react-table"
import { DataTable } from "@/components/ui/DataTable";
import { format } from "@/lib/format";
import { TOKENS } from "@/constants";

interface FundStatRow {
  used: bigint;
  trustPerTrustee: bigint;
  lastPayment: string;
  status: string;
}

const payments: FundStatRow[] = [
  {
    used: 0n,
    trustPerTrustee: 0n,
    lastPayment: "01-Jan-1900",
    status: "active",
  },
  {
    used: 0n,
    trustPerTrustee: 0n,
    lastPayment: "01-Jan-1900",
    status: "overdue",
  },
  {
    used: 0n,
    trustPerTrustee: 0n,
    lastPayment: "01-Jan-1900",
    status: "bad-debt",
  },
  {
    used: 0n,
    trustPerTrustee: 0n,
    lastPayment: "01-Jan-1900",
    status: "inactive",
  },
  {
    used: 0n,
    trustPerTrustee: 0n,
    lastPayment: "01-Jan-1900",
    status: "none",
  },
]

const columns: ColumnDef<FundStatRow>[] = [
  {
    id: "avatar",
    header: "",
    cell: ({ row }) => (
      <p>{row.id}</p>
    )
  },
  {
    header: "Trustee",
    cell: () => (
      <div>
        <p>geraldhost.eth</p>
        <p className="text-stone-400">0x34Ea...b66e</p>
      </div>
    )
  },
  {
    accessorKey: "used",
    header: () => <div className="text-right">Used</div>,
    cell: ({ getValue }) => (
      <div className="text-right">${format(getValue() as bigint, TOKENS.UNION, 0)}</div>
    ),
  },
  {
    accessorKey: "trustPerTrustee",
    header: () => <div className="text-right">Trust Per Trustee</div>,
    cell: ({ getValue }) => (
      <div className="text-right">${format(getValue() as bigint, TOKENS.UNION, 0)}</div>
    ),
  },
  {
    accessorKey: "lastPayment",
    header: () => <div className="text-right">Last Payment</div>,
    cell: ({ getValue }) => (
      <div className="text-right">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="text-right">Status</div>,
    cell: ({ getValue }) => (
      <div className="text-right">{getValue() as string}</div>
    )
  },
]

export const FundStatsTable = () => {
  return <DataTable columns={columns} data={payments} />
};