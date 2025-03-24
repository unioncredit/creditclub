import {
  ColumnDef,
  SortingState
} from "@tanstack/react-table"
import { Address } from "viem";
import { useState } from "react";

import { DataTable } from "@/components/ui/DataTable";
import { format, truncateAddress } from "@/lib/format";
import { useClubContacts } from "@/hooks/useClubContacts";
import { useToken } from "@/hooks/useToken";
import { PrimaryLabel } from "@/components/shared/PrimaryLabel";
import { useLastRepay } from "@/hooks/useLastRepay";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { IContact } from "@/providers/types";
import { Avatar } from "@/components/shared/Avatar";

interface FundTrusteeRow {
  address: Address;
  trust: string;
  used: string;
  lastRepay: bigint;
  status: IContact;
  numericTrust?: number;
  numericUsed?: number;
}

const columns: ColumnDef<FundTrusteeRow>[] = [
  {
    id: "avatar",
    header: "",
    accessorKey: "address",
    cell: ({ getValue }) => (
      <Avatar address={getValue() as Address} size={32} className="flex justify-center mx-auto" />
    ),
    enableSorting: false
  },
  {
    accessorKey: "address",
    header: "Trustee",
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
    accessorKey: "trust",
    header: ({ column }) => (
      <div className="text-right cursor-pointer flex items-center justify-end gap-1" onClick={() => column.toggleSorting()}>
        Trust
        <span className="inline-flex flex-col">
          <span className={`opacity-${column.getIsSorted() === "asc" ? "100" : "30"} -mb-1`}>▲</span>
          <span className={`opacity-${column.getIsSorted() === "desc" ? "100" : "30"}`}>▼</span>
        </span>
      </div>
    ),
    cell: ({ getValue }) => (
      <div className="text-right">${getValue() as string}</div>
    ),
    sortingFn: (rowA, rowB) => {
      return rowA.original.numericTrust! - rowB.original.numericTrust!;
    }
  },
  {
    accessorKey: "used",
    header: ({ column }) => (
      <div className="text-right cursor-pointer flex items-center justify-end gap-1" onClick={() => column.toggleSorting()}>
        Used
        <span className="inline-flex flex-col">
          <span className={`opacity-${column.getIsSorted() === "asc" ? "100" : "30"} -mb-1`}>▲</span>
          <span className={`opacity-${column.getIsSorted() === "desc" ? "100" : "30"}`}>▼</span>
        </span>
      </div>
    ),
    cell: ({ getValue }) => (
      <div className="text-right">${getValue() as string}</div>
    ),
    sortingFn: (rowA, rowB) => {
      return rowA.original.numericUsed! - rowB.original.numericUsed!;
    }
  },
  {
    accessorKey: "lastRepay",
    header: () => <div className="text-right">Last Payment</div>,
    cell: ({ getValue }) => {
      const { formatted } = useLastRepay(getValue() as bigint);

      return (
        <div className="text-right">{formatted}</div>
      )
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-right">Status</div>,
    cell: ({ getValue }) => (
      <StatusBadge contact={getValue() as IContact} />
    ),
    enableSorting: false
  },
]

export const FundTrusteesTable = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const { token } = useToken();
  const { data: clubContacts } = useClubContacts(clubAddress);

  const rows: FundTrusteeRow[] = clubContacts.map((contact) => {
    const trustStr = format(contact.trust, token);
    const usedStr = format(contact.locking, token);
    
    const numericTrust = parseFloat(trustStr);
    const numericUsed = parseFloat(usedStr);
    
    return {
      address: contact.address,
      trust: trustStr,
      used: usedStr,
      lastRepay: contact.lastRepay,
      status: contact,
      numericTrust,
      numericUsed
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