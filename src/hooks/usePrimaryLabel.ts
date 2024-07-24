import { Address, zeroAddress } from "viem";
import { useEns } from "@/hooks/useEns.ts";
import { truncateAddress, truncateEns } from "@/utils/format.ts";

export const usePrimaryLabel = ({
 address,
 shouldTruncate = true,
 defaultValue,
}: {
  address: Address | undefined;
  shouldTruncate?: boolean;
  defaultValue?: string;
}) => {
  const { name } = useEns(address || zeroAddress);

  return {
    data: address ? (name && (shouldTruncate ? truncateEns(name) : name)) || defaultValue ||
      (shouldTruncate ? truncateAddress(address) : address) : defaultValue
  };
}