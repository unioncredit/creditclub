import {
  Sort,
  SortAscending,
  SortDescending,
  TableHead,
  // @ts-ignore
} from "@unioncredit/ui";
import { SortOrder } from "@/constants";
import React from "react";

export function SortableTableHead({
  order,
  onClick,
  children,
  ...props
}: {
  order: string | false;
  onClick: () => void;
  children: React.ReactNode;
  [_: string]: any;
}) {
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
