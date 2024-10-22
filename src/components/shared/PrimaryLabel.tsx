import { Address } from "viem";

import { usePrimaryLabel } from "@/hooks/usePrimaryLabel.ts";

export function PrimaryLabel({
  address,
  shouldTruncate = true,
  defaultValue,
}: {
  address: Address;
  shouldTruncate?: boolean;
  defaultValue?: string;
}) {
  const { data: name } = usePrimaryLabel({
    address,
    shouldTruncate,
    defaultValue,
  });

  return name;
}
