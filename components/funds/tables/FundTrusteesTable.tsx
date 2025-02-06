import {
  ColumnDef
} from "@tanstack/react-table"
import { DataTable } from "@/components/ui/DataTable";
import { format } from "@/lib/format";
import { TOKENS } from "@/constants";

interface FundTrusteeRow {
  numTrustees: number;
  numBorrowers: number;
  proRataAmount: string;
}

const rows: FundTrusteeRow[] = [
  {
    numTrustees: 0,
    numBorrowers: 0,
    proRataAmount: "$0",
  },
  {
    numTrustees: 0,
    numBorrowers: 0,
    proRataAmount: "$0",
  },
  {
    numTrustees: 0,
    numBorrowers: 0,
    proRataAmount: "$0",
  },
  {
    numTrustees: 0,
    numBorrowers: 0,
    proRataAmount: "$0",
  },
  {
    numTrustees: 0,
    numBorrowers: 0,
    proRataAmount: "$0",
  },
]

const columns: ColumnDef<FundTrusteeRow>[] = [
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
    accessorKey: "numTrustees",
    header: () => <div className="text-right"># of Trustees</div>,
    cell: ({ getValue }) => (
      <div className="text-right">${format(getValue() as bigint, TOKENS.UNION, 0)}</div>
    ),
  },
  {
    accessorKey: "numBorrowers",
    header: () => <div className="text-right"># of Borrowers</div>,
    cell: ({ getValue }) => (
      <div className="text-right">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "proRataAmount",
    header: () => <div className="text-right">Pro Rata Amount</div>,
    cell: ({ getValue }) => (
      <div className="text-right">{getValue() as string}</div>
    ),
  },
]

export const FundTrusteesTable = () => {
  return <DataTable columns={columns} data={rows} />
};