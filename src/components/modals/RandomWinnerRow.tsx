import "./RandomWinnerRow.scss";
// @ts-ignore
import { Text, Union } from "@unioncredit/ui";
import { PrimaryLabel } from "@/components/shared/PrimaryLabel.tsx";
import { Address } from "viem";
import { Avatar } from "@/components/shared/Avatar.tsx";

export const RandomWinnerRow = ({
  title,
  address,
  amount,
}: {
  title: string;
  address: Address;
  amount: number;
}) => {
  return (
    <div className="RandomWinnerRow">
      <Avatar size={24} address={address} />

      <div className="RandomWinnerRow__content">
        <h3>{title}</h3>
        <p><PrimaryLabel address={address} /></p>
      </div>

      <Text size="large" weight="medium">
        {amount.toFixed(2)}
        <Union />
      </Text>
    </div>
  );
};