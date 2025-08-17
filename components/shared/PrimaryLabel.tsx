import { Address } from "viem";

import { usePrimaryLabel } from "@/hooks/usePrimaryLabel";

export function PrimaryLabel({
  address,
  shouldTruncate = true,
  defaultValue,
  ensName,
}: {
  address: Address;
  shouldTruncate?: boolean;
  defaultValue?: string;
  ensName?: string | null;
}) {
  const { data: name } = usePrimaryLabel({
    address,
    shouldTruncate,
    defaultValue,
    ensName,
  });

  return name;
}
