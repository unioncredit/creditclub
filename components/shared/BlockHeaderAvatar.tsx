import { Address } from "viem";
import { cn, generateNumberFromAddress } from "@/lib/utils";

export const BlockHeaderAvatar = ({
  address,
  className,
}: {
  address: Address;
  className?: string;
}) => {
  const randomNumber = generateNumberFromAddress(address);

  const faces: Record<number, string> = {
    1: "-_-",
    2: "^_^",
    3: "*_*",
    4: "~_~",
    5: "!_!",
    6: "@_@",
    7: "#_#",
    8: "$_$",
    9: ")_(",
    10: "&_&",
  };

  return (
    <div className={cn("border border-black flex items-center justify-center w-[32px] h-[32px]", className)}>
      <span className="font-mono">{faces[randomNumber]}</span>
    </div>
  );
}
