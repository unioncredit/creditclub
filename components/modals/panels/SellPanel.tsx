// @ts-ignore
import { Button, Input, Modal, Select } from "@unioncredit/ui";

import { RoundedButton } from "@/components/ui/RoundedButton";
import { useClubData } from "@/hooks/useClubData";
import { Address, Hash } from "viem";
import { useState } from "react";
import { formatDecimals } from "@/lib/format";
import { IFormField, IFormValues, useForm } from "@/hooks/useForm";
import { DEFAULT_CHAIN_ID } from "@/constants";
import { DecentSwapButton } from "@/components/shared/DecentSwapButton";
import { createIpfsImageUrl } from "@/lib/links";
import Image from "next/image";
import { useClubMemberNft } from "@/hooks/useClubMemberNft";
import { useErc20Token } from "@/hooks/useErc20Token";
import { useClubMember } from "@/hooks/useClubMember";
import { useAccount } from "wagmi";
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
  const { data: clubMemberNftData } = useClubMemberNft(clubAddress);
  const { data: assetToken } = useErc20Token(clubData.assetAddress);

  const {
    image: ipfsImageLink,
  } = clubMemberNftData;

  const { decimals, symbol } = clubData;
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
    setNumber,
    setRawValue,
    values = {},
    errors = {},
    empty,
  } = useForm({ validate, decimals });

  const amount = values.amount as IFormField || empty;

  const percentages = [
    {
      value: 0.25,
      label: "25%",
    },
    {
      value: 0.5,
      label: "50%",
    },
    {
      value: 0.75,
      label: "75%",
    },
    {
      value: 1,
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
          <Image
            width={24}
            height={24}
            src={createIpfsImageUrl(ipfsImageLink)}
            alt="Fund Image"
            className="border border-stone-200"
          />
        )}
        value={amount.formatted}
        onChange={register("amount")}
        error={errors.amount}
        rightLabel={`Avail. ${formatDecimals(clubTokenBalance, decimals)} ${symbol}`}
        rightLabelAction={() => setRawValue("amount", clubTokenBalance)}
      />

      <div className="flex gap-2 w-full">
        {percentages.map(({ label, value }, index) => (
          <RoundedButton
            key={index}
            size="pill"
            className="flex-1 text-slate-500 text-sm mt-2"
            disabled={amount.raw <= 0n}
            onClick={() => setNumber("amount", (parseFloat(formatDecimals(clubTokenBalance, decimals)) * value).toString(), "display", false) }
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