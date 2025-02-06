import { cn } from "@/lib/utils";

export const IconCube = ({
  icon: Icon,
  color,
  width,
  height,
  className,
}: {
  icon: string;
  color: string;
  width: number;
  height: number;
  className?: string;
}) => {
  return (
    <div className={cn("p-2 rounded-lg inline-block", className)} style={{ backgroundColor: color }}>
      {/* @ts-ignore */}
      <Icon width={width} height={height} className="fill" />
    </div>
  )
};