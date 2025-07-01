import { Address } from "viem";

import { usePrimaryLabel } from "@/hooks/usePrimaryLabel";

export function PrimaryLabel({
  address,
  shouldTruncate = true,
  defaultValue,
}: {
  address: Address;
  shouldTruncate?: boolean;
  defaultValue?: string;
}) => {
  const { data } = usePrimaryLabel({
    address,
    shouldTruncate,
    defaultValue,
  });

  return <>{String(data || "")}</>;
}
