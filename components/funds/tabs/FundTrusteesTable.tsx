import {
  ColumnDef
} from "@tanstack/react-table"
import { Address } from "viem";

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
}

const columns: ColumnDef<FundTrusteeRow>[] = [
  {
    id: "avatar",
    header: "",
    accessorKey: "address",
    cell: ({ getValue }) => (
      <Avatar address={getValue() as Address} size={32} className="flex justify-center mx-auto" />
    )
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
    header: () => <div className="text-right">Trust</div>,
    cell: ({ getValue }) => (
      <div className="text-right">${getValue() as string}</div>
    ),
  },
  {
    accessorKey: "used",
    header: () => <div className="text-right">Used</div>,
    cell: ({ getValue }) => (
      <div className="text-right">${getValue() as string}</div>
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
    )
  },
]

export const FundTrusteesTable = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const { token } = useToken();
  const { data: clubContacts } = useClubContacts(clubAddress);

  // Safety guard: ensure clubContacts is a valid array
  if (!Array.isArray(clubContacts)) {
    return <div>Loading trustees...</div>;
  }

  const rows: FundTrusteeRow[] = clubContacts.map((contact) => ({
    address: contact.address,
    trust: format(contact.trust, token),
    used: format(contact.locking, token),
    lastRepay: contact.lastRepay,
    status: contact,
  }));

  // @ts-ignore
  return <DataTable columns={columns} data={rows} />
};