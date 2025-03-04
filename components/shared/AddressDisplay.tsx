import { Address } from "viem";

// @ts-ignore
import { LinkOutIcon } from "@unioncredit/ui";
import { truncateAddress } from "@/lib/format";
import Link from "next/link";
import { getEtherscanAddressLink } from "@/lib/links";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { cn } from "@/lib/utils";

export const AddressDisplay = ({
  address,
  className,
}: {
  address: Address;
  className?: string;
}) => {
  const { copy, copied } = useCopyToClipboard();

  return (
    <div className="flex items-center">
      <button
        onClick={() => copy(address)}
        className={cn("bg-slate-100 rounded-full px-2 py-1 font-normal text-sm", className)}
      >
        {copied ? "Copied!" : truncateAddress(address)}
      </button>
      <Link href={getEtherscanAddressLink(address)} target="_blank" rel="noopener noreferrer">
        <LinkOutIcon width={24} />
      </Link>
    </div>
  )
}