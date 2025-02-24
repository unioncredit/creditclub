// @ts-ignore
import { ArrowRightIcon } from "@unioncredit/ui";
import React from "react";
import { cn } from "@/lib/utils";

interface PanelData {
  title: string;
  value: string;
  icon?: React.ReactNode;
}

export const SendReceivePanel = ({
  leftPanel,
  rightPanel,
  className,
}: {
  leftPanel: PanelData;
  rightPanel: PanelData;
  className?: string;
}) => {
  const { title: leftTitle, value: leftValue, icon: leftIcon } = leftPanel;
  const { title: rightTitle, value: rightValue, icon: rightIcon } = rightPanel;

  return (
    <div className={cn("p-3 rounded-lg flex justify-between", className)}>
      <div className="bg-white p-4 rounded-lg flex flex-col items-center border border-stone-300">
        <p className="text-stone-600 text-center">{leftTitle}</p>
        <p className="font-medium flex items-center gap-1">
          {leftValue}
          {leftIcon && leftIcon}
        </p>
      </div>

      <ArrowRightIcon width={32}/>

      <div className="bg-white p-4 rounded-lg flex flex-col items-center  border border-stone-300">
        <p className="text-stone-600 text-center">{rightTitle}</p>
        <p className="font-medium flex items-center gap-1">
          {rightValue}
          {rightIcon && rightIcon}
        </p>
      </div>
    </div>
  )
}