import { Address } from "viem";

import { PrimaryLabel } from "@/components/shared/PrimaryLabel";

export const AddressLink = ({ address }: { address: Address; }) => {
  return (
    <span>
      <a target="_blank" rel="noopener" href={`https://app.union.finance/profile/base:${address}`}>
        <PrimaryLabel address={address} />
      </a>
    </span>
  );
};