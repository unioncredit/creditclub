import { Address } from "viem";

// @ts-ignore
import { AvatarBadgeRow } from "@unioncredit/ui";

import { Avatar } from "@/components/shared/Avatar.tsx";

export const AddressesAvatarBadgeRow = ({
  addresses,
  ...props
}: {
  addresses: Address[];
  [_: string]: any;
}) => (
  <AvatarBadgeRow style={{ pointerEvents: "none" }} {...props}>
    {addresses.map((address) => (
      <Avatar key={address} address={address} />
    ))}
  </AvatarBadgeRow>
);
