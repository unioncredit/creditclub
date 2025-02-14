import {
  ColumnDef
} from "@tanstack/react-table"
import { DataTable } from "@/components/ui/DataTable";
import { format, truncateAddress } from "@/lib/format";
import { TOKENS } from "@/constants";
import { Address } from "viem";
import { useClubContacts } from "@/hooks/useClubContacts";
import { PrimaryLabel } from "@/components/shared/PrimaryLabel";
import { useTokenPrice } from "@/hooks/useTokenPrice";
import { BlockHeaderAvatar } from "@/components/shared/BlockHeaderAvatar";

interface FundHolderRow {
  id: number;
  shares: bigint;
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
      <BlockHeaderAvatar address={getValue() as Address} className="mx-auto" />
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
      <div className="text-right">{format(getValue() as bigint, TOKENS.UNION, 0)}</div>
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

export const FundHoldersTable = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const { data: clubContacts } = useClubContacts(clubAddress);
  const { data: tokenPrice }  = useTokenPrice(clubAddress);

  const rows: FundHolderRow[] = clubContacts.map(({ address, numShares }, index) => ({
    id: index,
    address,
    shares: numShares,
    marketValue: `$${Number(numShares) * tokenPrice}`,
  }));

  return <DataTable columns={columns} data={rows} />
};