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
import { useCreditVaultContract } from "@/hooks/useCreditVaultContract";


export const StartWithdrawInput = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const { address: connectedAddress } = useAccount();
  const { data: clubData, refetch: refetchClubData } = useClubData(clubAddress);
  const { data: clubMember, refetch: refetchClubMember } = useClubMember(connectedAddress, clubAddress);

  const { image, decimals, symbol } = clubData;
  const { clubTokenBalance } = clubMember;

  const creditVaultContract = useCreditVaultContract(clubAddress);

  const validate = (inputs: IFormValues) => {
    const shares = inputs.shares as IFormField;

    if (shares.raw > clubTokenBalance) {
      return `Only ${formatDecimals(clubTokenBalance, decimals)} ${symbol} Available`;
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
    ...creditVaultContract,
    functionName: "withdraw",
    args: [sharesRaw, connectedAddress, connectedAddress],
    disabled: !!errors.shares || sharesRaw <= 0n || clubTokenBalance < sharesRaw,
    onComplete: async () => {
      refetchClubData();
      refetchClubMember();
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
        rightLabel={`Max. ${formatDecimals(clubTokenBalance, decimals, 2)}`}
        rightLabelAction={() => setRawValue("shares", clubTokenBalance)}
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