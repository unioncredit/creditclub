import { Address, zeroAddress } from "viem";

import { useEns } from "@/hooks/useEns";
import { truncateAddress, truncateEns } from "@/lib/format";
import { useFarcasterData } from "@/hooks/useFarcasterData";

export const usePrimaryLabel = ({
  address,
  shouldTruncate = true,
  defaultValue,
}: {
  address: Address | undefined;
  shouldTruncate?: boolean;
  defaultValue?: string;
}) => {
  const { name: ens } = useEns(address || zeroAddress);
  const { data: farcasterData } = useFarcasterData(address || zeroAddress);
  const { name: fname } = farcasterData;

  const formattedEns = ens && shouldTruncate ? truncateEns(ens) : ens;
  const formattedAddress = address ? (shouldTruncate ? truncateAddress(address) : address) : undefined;

  // Ensure we always return a string, not an Address object
  const label = formattedEns || fname || (formattedAddress ? String(formattedAddress) : defaultValue);
  
  return { data: label };
}