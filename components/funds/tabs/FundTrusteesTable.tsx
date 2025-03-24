import {
  ColumnDef,
  SortingState,
  OnChangeFn
} from "@tanstack/react-table"
import { Address } from "viem";
import { useState, useCallback } from "react";

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
  numericTrust: number;
  numericUsed: number;
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
    id: "trust",
    accessorFn: (row) => row.numericTrust, 
    header: ({ column }) => (
      <div className="text-right cursor-pointer flex items-center justify-end gap-1">
        Trust
        <div className="ml-1 inline-flex flex-col">
          <span className={column.getIsSorted() === "asc" ? "text-black" : "text-gray-400"}>▲</span>
          <span className={column.getIsSorted() === "desc" ? "text-black" : "text-gray-400"}>▼</span>
        </div>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-right">${row.original.trust}</div>
    ),
  },
  {
    id: "used",
    accessorFn: (row) => row.numericUsed,
    header: ({ column }) => (
      <div className="text-right cursor-pointer flex items-center justify-end gap-1">
        Used
        <div className="ml-1 inline-flex flex-col">
          <span className={column.getIsSorted() === "asc" ? "text-black" : "text-gray-400"}>▲</span>
          <span className={column.getIsSorted() === "desc" ? "text-black" : "text-gray-400"}>▼</span>
        </div>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-right">${row.original.used}</div>
    ),
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
  const { data: clubContacts = [] } = useClubContacts(clubAddress);

  const handleSortingChange: OnChangeFn<SortingState> = useCallback((updaterOrValue) => {
    console.log('Trustee sorting changed to:', updaterOrValue);
    setSorting(updaterOrValue);
  }, []);

  const rows: FundTrusteeRow[] = clubContacts.map((contact) => {
    const trustStr = format(contact.trust, token);
    const usedStr = format(contact.locking, token);
    
    // Ensure we have valid numbers for sorting
    const numericTrust = parseFloat(trustStr) || 0;
    const numericUsed = parseFloat(usedStr) || 0;
    
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

  console.log('Rendering trustees table with data:', { 
    contacts: clubContacts.length, 
    rows: rows.length
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