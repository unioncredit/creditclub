import { cn } from "@/lib/utils";

export const FormattedValue = ({
  value,
  smallDecimals,
  className,
}: {
  value: string;
  smallDecimals?: boolean;
  className?: string;
}) => {
  const values = value.split(".");

  return (
    <p className={cn("font-mono", className)}>
      {smallDecimals && values.length === 2 ? (
        <>{values[0]}<span className="text-[70%] text-stone-400">.{values[1]}</span></>
      ) : value}
    </p>
  )
};