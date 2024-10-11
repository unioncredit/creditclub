import { truncateAddress, truncateEns } from "@/utils/format";
import { useEns } from "@/hooks/useEns.ts";
import { Address } from "viem";
import { useFarcasterData } from "@/hooks/useFarcasterData.ts";

export function PrimaryLabel({
  address,
  shouldTruncate = true,
  defaultValue,
}: {
  address: Address;
  shouldTruncate?: boolean;
  defaultValue?: string;
}) {
  const { name: ens } = useEns(address);
  const { data: farcasterData } = useFarcasterData(address)
  const { name: fname } = farcasterData;

  return (
    fname ||
    (ens && (shouldTruncate ? truncateEns(ens) : ens)) || defaultValue ||
    (shouldTruncate ? truncateAddress(address) : address)
  );
}
