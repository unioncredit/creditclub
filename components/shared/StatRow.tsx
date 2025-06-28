import React from "react";

// @ts-ignore
import { Text } from "@unioncredit/ui";
import { cn } from "@/lib/utils";

export const StatRow = ({
  percentage,
  title,
  content,
  amount,
  color,
  token,
  className,
}: {
  percentage?: string;
  title: string;
  content?: string | React.ReactNode;
  amount: string;
  color?: string;
  token: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex items-center p-2 border border-stone-200 rounded-xl", className)}>
      {percentage && (
        <div className="w-[42px] h-[42px] flex justify-center items-center font-medium rounded-lg text-sm" style={{ background: color }}>
          {percentage}
        </div>
      )}

      <div className="flex-1 pl-2">
        <h3>{title}</h3>
        {content && <p className="text-sm text-stone-500 -mt-0.5">{content}</p>}
      </div>

      <div className="flex items-center gap-2">
        <Text m="0 4px 0 0" className="font-medium" size="large" weight="medium">
          {amount}
        </Text>
        {token}
      </div>
    </div>
  );
};