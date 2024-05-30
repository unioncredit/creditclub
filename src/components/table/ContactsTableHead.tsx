// @ts-ignore
import { TableHead, TableRow } from "@unioncredit/ui";
import { SortableTableHead } from "@/components/table/SortableTableHead.tsx";

export function ContactsTableHead({
  items,
  sort,
  setSortType
}: {
  items: { id: string; label: string; }[];
  sort: { type: string; order: string; }
  setSortType: (sortType: string) => void;
}) {
  return (
    <TableRow>
      <TableHead></TableHead>
      <TableHead>Account</TableHead>

      {items.map(({ id, label }, index) => (
        <SortableTableHead
          key={index}
          align="right"
          order={sort.type === id && sort.order}
          onClick={() => setSortType(id)}
        >
          {label}
        </SortableTableHead>
      ))}
    </TableRow>
  );
}
