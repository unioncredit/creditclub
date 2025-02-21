import { cn } from "@/lib/utils";
import { Heading } from "@/components/ui/Heading";
import React from "react";

export interface StatGridRow {
  name: string;
  value: string | React.ReactNode;
  align?: "left" | "center" | "right";
}

export const StatGrid = ({
  title,
  rows,
  size,
  className,
}: {
  title: string;
  rows: StatGridRow[];
  size?: "small" | "regular";
  className?: string;
}) => {
  const fontSize = size === "small" ? "text-sm" : "text-base";

  return (
    <div className={cn("border border-black flex flex-col", fontSize, className)}>
      <Heading type="h2" className="font-medium bg-heading border-b border-black px-2 py-1">{title}</Heading>

      <table className="border-collapse w-full flex-1">
        <tbody>
        {rows.map(({ name, value, align }, index) => (
          <tr key={index}>
            <td className="border border-zinc-300 px-2 py-1.5 pr-4 whitespace-nowrap">
              {name}
            </td>
            <td
              align={align || "left"}
              className="border border-zinc-300 px-2 py-1.5"
            >
              {value}
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  )
};