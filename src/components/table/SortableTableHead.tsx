import {
  Sort,
  SortAscending,
  SortDescending,
  TableHead,
} from "@unioncredit/ui";
import { SortOrder } from "@/constants";

export function SortableTableHead({ order, onClick, children, ...props }) {
  const Icon = order
    ? order === SortOrder.ASC
      ? SortAscending
      : SortDescending
    : Sort;

  return (
    <TableHead onClick={onClick} style={{ cursor: "pointer" }} {...props}>
      <Icon
        style={{
          width: "12px",
          height: "12px",
          verticalAlign: "bottom",
          marginRight: "3px",
        }}
      />
      {children}
    </TableHead>
  );
}
