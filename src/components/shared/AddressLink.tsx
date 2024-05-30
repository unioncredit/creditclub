
// @ts-ignore
import { Text } from "@unioncredit/ui";
import { Address as AddressType } from "viem";

import { PrimaryLabel } from "@/components/shared/PrimaryLabel";

export const AddressLink = ({ address }: { address: AddressType; }) => {
  return (
    <Text as="span" size="medium" weight="medium" grey={500} m={0}>
      <a target="_blank" rel="noopener" href={`https://app.union.finance/profile/opt:${address}`}>
        <PrimaryLabel address={address} />
      </a>
    </Text>
  );
};
