// @ts-ignore
import { Button, Input, Modal, Select } from "@unioncredit/ui";
import { useAccount } from "wagmi";
import { Address, Hash } from "viem";
import { useState } from "react";

import { RoundedButton } from "@/components/ui/RoundedButton";
import { useClubData } from "@/hooks/useClubData";
import { formatDecimals } from "@/lib/format";
import { IFormField, IFormValues, useForm } from "@/hooks/useForm";
import { DEFAULT_CHAIN_ID } from "@/constants";
import { DecentSwapButton } from "@/components/shared/DecentSwapButton";
import { useErc20Token } from "@/hooks/useErc20Token";
import { useClubMember } from "@/hooks/useClubMember";
import { useModals } from "@/providers/ModalManagerProvider";

export const SellPanel = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const [amountOut, setAmountOut] = useState<any>(undefined);

  const { close } = useModals();
  const { address } = useAccount();
  const { data: clubData } = useClubData(clubAddress);
  const { data: clubMemberData, refetch: refetchClubMember } = useClubMember(address, clubAddress);
  const { data: assetToken } = useErc20Token(clubData.assetAddress);

  const { image, decimals, symbol } = clubData;
  const { address: assetAddress, symbol: assetSymbol } = assetToken;
  const { clubTokenBalance } = clubMemberData;

  const validate = (inputs: IFormValues) => {
    const amount = inputs.amount as IFormField;

    if (amount.raw > clubTokenBalance) {
      return "Amount exceeds balance";
    }
  };

  const {
    register,
    setRawValue,
    values = {},
    errors = {},
    empty,
  } = useForm({ validate, decimals });

  const amount = values.amount as IFormField || empty;

  const percentages = [
    {
      value: 25n,
      label: "25%",
    },
    {
      value: 50n,
      label: "50%",
    },
    {
      value: 75n,
      label: "75%",
    },
    {
      value: 100n,
      label: "Max",
    },
  ];

  return (
    <>
      <Input
        type="number"
        name="amount"
        label="Sell amount:"
        placeholder="0.0"
        className="mt-4 TokenSelectInput"
        suffix={(
          <img
            width={24}
            height={24}
            src={image}
            alt="Fund Image"
            className="border border-stone-200"
          />
        )}
        value={amount.formatted}
        onChange={register("amount")}
        error={errors.amount}
        rightLabel={`Avail. ${formatDecimals(clubTokenBalance, decimals)} ${symbol} (raw: ${clubTokenBalance?.toString()})`}
        rightLabelAction={() => setRawValue("amount", clubTokenBalance)}
      />

      <div className="flex gap-2 w-full">
        {percentages.map(({ label, value }, index) => (
          <RoundedButton
            key={index}
            size="pill"
            className="flex-1 text-slate-500 text-sm mt-2"
            disabled={amount.raw <= 0n}
            onClick={() => setRawValue("amount", (clubTokenBalance * value) / 100n) }
          >
            {label}
          </RoundedButton>
        ))}
      </div>

      <Modal.Container className="mt-4">
        <div className="flex justify-between w-full">
          <p className="font-medium text-lg">You receive</p>
          <p className="font-mono text-xl">~{amountOut ? formatDecimals(amountOut.amount, amountOut.decimals) : "0.00"} ${assetSymbol}</p>
        </div>
      </Modal.Container>

      <DecentSwapButton
        amount={amount.raw}
        srcToken={clubAddress}
        srcChainId={DEFAULT_CHAIN_ID}
        dstToken={assetAddress}
        dstChainId={DEFAULT_CHAIN_ID}
        label={`Sell $${symbol} Tokens`}
        onSwapPrepared={(swap) => {
          setAmountOut(swap?.amountOut);
        }}
        onComplete={async (_: Hash) => {
          refetchClubMember();
          close();
        }}
      />
    </>
  )
};