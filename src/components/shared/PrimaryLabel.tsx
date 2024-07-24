import { truncateAddress, truncateEns } from "@/utils/format";
import { useEns } from "@/hooks/useEns.ts";
import { Address } from "viem";

export function PrimaryLabel({
  address,
  shouldTruncate = true,
  defaultValue,
}: {
  address: Address;
  shouldTruncate?: boolean;
  defaultValue?: string;
}) {
  const { name } = useEns(address);

  return (
    (name && (shouldTruncate ? truncateEns(name) : name)) || defaultValue ||
    (shouldTruncate ? truncateAddress(address) : address)
  );
}
