import { useState } from "react";
import { Address } from "viem";
// @ts-ignore
import { Avatar as UnionUiAvatar } from "@unioncredit/ui";

import { useEns } from "@/hooks/useEns";
import { BlockHeaderAvatar } from "@/components/shared/BlockHeaderAvatar";

export function Avatar({
  address,
  size,
  className,
}: {
  address: Address;
  size?: number;
  className?: string;
}) {
  const [error, setError] = useState(false);

  const { avatar, isLoading, isError } = useEns(address);

  return !isLoading && !isError && !error && avatar ? (
    <div className={className}>
      <UnionUiAvatar
        size={size}
        src={avatar}
        onError={() => setError(true)}
      />
    </div>
  ) : (
    <BlockHeaderAvatar address={address} className={className} />
  );
}
