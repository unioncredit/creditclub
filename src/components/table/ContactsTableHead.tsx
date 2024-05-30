import { TableHead, TableRow } from "@unioncredit/ui";
import { SortableTableHead } from "@/components/table/SortableTableHead.tsx";

export function ContactsTableHead({ items, sort, setSortType }) {
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
