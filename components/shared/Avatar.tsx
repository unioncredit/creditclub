import { useState } from "react";
import { Address } from "viem";
import makeBlockie from "ethereum-blockies-base64";
// @ts-ignore
import { Avatar as UnionUiAvatar } from "@unioncredit/ui";

import { useEns } from "@/hooks/useEns";

export function Avatar({
  address,
  size,
  className,
  ensAvatar,
}: {
  address: Address;
  size?: number;
  className?: string;
  ensAvatar?: string | null;
}) {
  const [error, setError] = useState(false);

  const { avatar, isLoading, isError } = useEns(address);
  const blockie = makeBlockie(address);

  return (
    <div className={className}>
      <UnionUiAvatar
        size={size}
        src={
          isError || isLoading || error ? blockie : ensAvatar || avatar || blockie
        }
        onError={() => setError(true)}
      />
    </div>
  )
}
