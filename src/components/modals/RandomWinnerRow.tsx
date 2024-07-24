import "./RandomWinnerRow.scss";
// @ts-ignore
import { Text, Union } from "@unioncredit/ui";
import { PrimaryLabel } from "@/components/shared/PrimaryLabel.tsx";
import { Address } from "viem";
import { Avatar } from "@/components/shared/Avatar.tsx";
import { truncateAddress } from "@/utils/format.ts";

export const RandomWinnerRow = ({
  address,
  amount,
}: {
  address: Address;
  amount: number;
}) => {
  return (
    <div className="RandomWinnerRow">
      <Avatar size={24} address={address} />

      <div className="RandomWinnerRow__content">
        <h3><PrimaryLabel address={address} defaultValue="Random Trustee" /></h3>
        <p>{truncateAddress(address)}</p>
      </div>

      <Text className="RandomWinnerRow__value" size="large" weight="medium">
        {amount.toFixed(2)}
        <Union />
      </Text>
    </div>
  );
};