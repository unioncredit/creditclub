import { useState } from "react";
import { Address } from "viem";
import makeBlockie from "ethereum-blockies-base64";
// @ts-ignore
import { Avatar as UnionUiAvatar } from "@unioncredit/ui";

import { useEns } from "@/hooks/useEns";

export function Avatar({
  address,
  size
}: {
  address: Address;
  size?: number;
}) {
  const [error, setError] = useState(false);

  const { avatar, isLoading, isError } = useEns(address);
  const blockie = makeBlockie(address);

  return (
    <UnionUiAvatar
      size={size}
      src={
        isError || isLoading || error ? blockie : avatar || blockie
      }
      onError={() => setError(true)}
    />
  );
}
