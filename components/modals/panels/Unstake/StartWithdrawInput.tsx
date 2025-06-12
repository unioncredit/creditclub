import {
  Button,
  Input,
  // @ts-ignore
} from "@unioncredit/ui";
import { Address } from "viem";
import { useAccount } from "wagmi";

import { formatDecimals } from "@/lib/format";
import { IFormField, IFormValues, useForm } from "@/hooks/useForm";
import { useClubData } from "@/hooks/useClubData";
import { useClubMember } from "@/hooks/useClubMember";
import { useWrite } from "@/hooks/useWrite";
import { useStakingContract } from "@/hooks/useStakingContract";
import { useClubWithdrawBucket } from "@/hooks/useClubWithdrawBucket";


export const StartWithdrawInput = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const { address: connectedAddress } = useAccount();
  const { data: clubData, refetch: refetchClubData } = useClubData(clubAddress);
  const { data: clubMember, refetch: refetchClubMember } = useClubMember(connectedAddress, clubAddress);
  const { refetch: refetchWithdrawBucket } = useClubWithdrawBucket(clubAddress);

  const { image, decimals, symbol } = clubData;
  const { stakedBalance } = clubMember;

  const stakingContract = useStakingContract(clubData.stakingAddress);

  const validate = (inputs: IFormValues) => {
    const shares = inputs.shares as IFormField;

    if (shares.raw > stakedBalance) {
      return `Only ${formatDecimals(stakedBalance, decimals)} ${symbol} Available`;
    }
  };

  const {
    setRawValue,
    register,
    values = {},
    errors = {},
    empty
  } = useForm({ decimals, validate });

  const shares = values.shares as IFormField || empty;
  const sharesRaw = shares.raw || 0n;

  const inputError = () => {
    if (errors.shares) {
      return errors.shares;
    }

    return null;
  };

  const withdrawButtonProps = useWrite({
    ...stakingContract,
    functionName: "redeem",
    args: [sharesRaw, connectedAddress, connectedAddress],
    disabled: !!errors.shares || sharesRaw <= 0n || stakedBalance < sharesRaw,
    onComplete: async () => {
      refetchClubData();
      refetchClubMember();
      refetchWithdrawBucket();
    }
  });

  return (
    <div className="flex gap-2 mt-4">
      <Input
        type="number"
        name="amount"
        label="Amount"
        placeholder="0.0"
        value={shares.formatted}
        onChange={register("shares")}
        error={inputError()}
        suffix={(
          <img
            width={24}
            height={24}
            src={image}
            className="border border-black"
          />
        )}
        rightLabel={`Max. ${formatDecimals(stakedBalance, decimals, 2)}`}
        rightLabelAction={() => setRawValue("shares", stakedBalance)}
      />

      <Button
        fluid
        className="mt-7"
        color="secondary"
        variant="light"
        label={
          sharesRaw <= 0n
            ? "Enter amount"
            : "Start withdraw"
        }
        {...withdrawButtonProps}
      />
    </div>
  )
};