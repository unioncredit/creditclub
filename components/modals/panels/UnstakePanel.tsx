import { Address } from "viem";

import { StartWithdrawInput } from "@/components/modals/panels/Unstake/StartWithdrawInput";
import { LockedWithdrawals } from "@/components/modals/panels/Unstake/LockedWithdrawals";
import { PendingWithdrawals } from "@/components/modals/panels/Unstake/PendingWithdrawals";

export const UnstakePanel = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  return (
    <>
      <StartWithdrawInput clubAddress={clubAddress} />
      <LockedWithdrawals clubAddress={clubAddress} />
      <PendingWithdrawals clubAddress={clubAddress} />
    </>
  )
};