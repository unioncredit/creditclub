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
  numericTrust: number;
  numericUsed: number;
}

export const FundTrusteesTable = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const { token } = useToken();
  const { data: clubContacts = [] } = useClubContacts(clubAddress);

  // Process data for rows
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

  // Define columns with simpler definition
  const columns: ColumnDef<FundTrusteeRow>[] = [
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
      header: "Trustee",
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
      id: "trust",
      accessorKey: "numericTrust",
      header: "Trust",
      cell: ({ row }) => (
        <div className="text-right">${row.original.trust}</div>
      ),
      meta: { alignRight: true }
    },
    {
      id: "used",
      accessorKey: "numericUsed",
      header: "Used",
      cell: ({ row }) => (
        <div className="text-right">${row.original.used}</div>
      ),
      meta: { alignRight: true }
    },
    {
      id: "lastRepay",
      accessorKey: "lastRepay",
      header: "Last Payment",
      cell: ({ row }) => {
        const { formatted } = useLastRepay(row.original.lastRepay);
        return (
          <div className="text-right">{formatted}</div>
        )
      },
      enableSorting: false,
      meta: { alignRight: true }
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge contact={row.original.status} />
      ),
      enableSorting: false,
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