// @ts-ignore
import { Button, Input, Modal, Select } from "@unioncredit/ui";

import { RoundedButton } from "@/components/ui/RoundedButton";
import { useClubData } from "@/hooks/useClubData";
import { Address, Hash } from "viem";
import { DecentTokenSelect } from "@/components/shared/DecentTokenSelect";
import { UserTokenInfo } from "@decent.xyz/box-common";
import { useEffect, useState } from "react";
import { formatDecimals } from "@/lib/format";
import { IFormField, IFormValues, useForm } from "@/hooks/useForm";
import { DEFAULT_CHAIN_ID } from "@/constants";
import { DecentSwapButton } from "@/components/shared/DecentSwapButton";
import { useClubMember } from "@/hooks/useClubMember";
import { useAccount } from "wagmi";
import { useModals } from "@/providers/ModalManagerProvider";

export const BuyPanel = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const [token, setToken] = useState<UserTokenInfo | null>(null);
  const [amountOut, setAmountOut] = useState<any>(undefined);

  const { close } = useModals();
  const { address } = useAccount();
  const { data: clubData } = useClubData(clubAddress);
  const { refetch: refetchClubMember } = useClubMember(address, clubAddress);

  const { symbol } = clubData;
  const maxBalance = token ? formatDecimals(token.balance, token.decimals) : "0.00";

  const validate = (inputs: IFormValues) => {
    const amount = inputs.amount as IFormField;

    if (!token) {
      return "No token selected";
    }
    if (amount.raw > token.balance) {
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
    reset,
  } = useForm({ validate, decimals: token?.decimals || 0 });

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

  // Reset input amount on token change
  useEffect(reset, [token]);

  return (
    <>
      <Input
        type="number"
        name="amount"
        label="Buy amount:"
        placeholder="0.0"
        className="mt-4 TokenSelectInput"
        suffix={<DecentTokenSelect onChange={(token: UserTokenInfo) => setToken(token)} />}
        value={amount.formatted}
        onChange={register("amount")}
        error={errors.amount}
        {...(token ? {
          rightLabel: `Avail. ${maxBalance} ${token.symbol}`,
          rightLabelAction: () => setRawValue("amount", token.balance)
        } : {})}
        disabled={!token}
      />

      {token && (
        <>
          <div className="flex gap-2 w-full">
            {percentages.map(({ label, value }, index) => (
              <RoundedButton
                key={index}
                size="pill"
                className="flex-1 text-slate-500 text-sm mt-2"
                onClick={() => setNumber("amount", (parseFloat(maxBalance) * value).toString(), "display", false) }
              >
                {label}
              </RoundedButton>
            ))}
          </div>

          <Modal.Container className="mt-4">
            <div className="flex justify-between w-full">
              <p className="font-medium text-lg">You receive</p>
              <p className="font-mono text-xl">~{amountOut ? formatDecimals(amountOut.amount, amountOut.decimals) : "0.00"} ${symbol}</p>
            </div>
          </Modal.Container>
        </>
      )}

      {token ? (
        <DecentSwapButton
          amount={amount.raw}
          srcToken={token.address as Address}
          srcChainId={token.chainId}
          dstToken={clubAddress}
          dstChainId={DEFAULT_CHAIN_ID}
          label={`Buy $${symbol} Tokens`}
          onSwapPrepared={(swap) => {
            setAmountOut(swap?.amountOut);
          }}
          onComplete={async (_: Hash) => {
            refetchClubMember();
            close();
          }}
        />
      ) : (
        <Button
          fluid
          className="mt-4"
          color="primary"
          size="large"
          label={`Buy $${symbol} Tokens`}
          disabled={!token}
        />
      )}
    </>
  )
};