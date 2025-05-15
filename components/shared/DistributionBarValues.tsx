// @ts-ignore
import { Dot, DistributionBar } from "@unioncredit/ui";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface DistributionBarItem {
  value: number;
  label: string;
  title: string;
  color: string;
}

export const DistributionBarValues = ({
  items,
  mark,
  className,
}: {
  items: DistributionBarItem[];
  mark?: number;
  className?: string;
}) => {
  const [width, setWidth] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const maxValue = items.reduce((acc, { value }) => value > acc ? value : acc, 1);

  // Calculate markOffset position relative to the max value and component width
  const markOffset = mark ? (mark / maxValue) * width : 0;

  const handleResize = () => {
    if (containerRef.current) {
      setWidth(containerRef.current.clientWidth);
    }
  }

  useEffect(() => {
    handleResize();

    if (containerRef.current) {
      window.addEventListener("resize", handleResize);
    }

    return () => window.removeEventListener("resize", handleResize);
  }, [containerRef]);

  return (
    <div ref={containerRef} onResize={handleResize}>
      <div className={cn("relative my-[24px]", className)}>
        <DistributionBar
          items={items.map(({ value, color }) => ({ value, color }))}
        />
        {mark && (
          <span
            className="h-full bg-black w-[2px] absolute top-0"
            style={{
              left: markOffset,
            }}
          />
        )}
      </div>

      <ul className="flex items-center justify-between gap-2">
        {items.map(({ label, title, color }, index) => (
          <li key={index}>
            <p className="text-lg font-medium font-mono">{label}</p>
            <p className="flex gap-1 items-center text-xs text-stone-400">
              <Dot color={color} size={6} />
              {title}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}