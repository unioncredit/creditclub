import "./DimmableTableCell.scss";

import cn from "classnames";
// @ts-ignore
import { TableCell } from "@unioncredit/ui";
import React from "react";

export const DimmableTableCell = ({
  dimmed,
  value,
  children,
  className,
  ...props
}: {
  dimmed: boolean;
  value?: string | React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) => (
  <TableCell
    align="right"
    weight="medium"
    className={cn("DimmableTableCell", className, {
      "DimmableTableCell--dimmed": dimmed,
    })}
    {...props}
  >
    {value ?? children}
  </TableCell>
);
