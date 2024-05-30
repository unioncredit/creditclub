import { truncateAddress, truncateEns } from "@/utils/format";
import { useEns } from "@/hooks/useEns.ts";
import { Address } from "viem";

export function PrimaryLabel({
  address,
  shouldTruncate = true
}: {
  address: Address;
  shouldTruncate?: boolean;
}) {
  const { name } = useEns(address);

  return (
    (name && (shouldTruncate ? truncateEns(name) : name)) ||
    (shouldTruncate ? truncateAddress(address) : address)
  );
}
