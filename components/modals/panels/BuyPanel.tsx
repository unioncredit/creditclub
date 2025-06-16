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
import { usdcContract } from "@/contracts/base";

export const BuyPanel = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const [token, setToken] = useState<UserTokenInfo | null>(null);
  const [swapData, setSwapData] = useState<any>(undefined);



  const { close } = useModals();
  const { address } = useAccount();
  const { data: clubData } = useClubData(clubAddress);
  const { refetch: refetchClubMember } = useClubMember(address, clubAddress);
  
  // Check if we have a routing error (token not available on DEX)
  const hasRoutingError = swapData && swapData.error && swapData.error.code === 404;
  const amountOut = swapData?.amountOut;

  const { symbol } = clubData;

  const maxBalanceRaw = token ? token.balance : 0n;
  const maxBalance = formatDecimals(maxBalanceRaw, token?.decimals || 0);

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
    setRawValue,
    values = {},
    errors = {},
    empty,
    reset,
  } = useForm({ validate, decimals: token?.decimals || 18 }); // Default to 18 decimals

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

  // Reset input amount on token change
  useEffect(() => {
    if (token) {
      reset();
      setSwapData(undefined);
    }
  }, [token?.address, reset]); // Only reset when token address changes

  // Clear swap data when amount is 0
  useEffect(() => {
    if (amount.raw <= 0n) {
      setSwapData(undefined);
    }
  }, [amount.raw]);

  return (
    <>
      <Input
        type="number"
        name="amount"
        label="Buy amount:"
        placeholder="0.0"
        className="mt-4 TokenSelectInput"
        suffix={(
          <DecentTokenSelect
            initialToken={usdcContract.address}
            onChange={(token: UserTokenInfo) => {
              setToken(token);
            }}
            onReady={(token: UserTokenInfo) => {
              console.log("Token ready in DecentTokenSelect:", token);
              if (token) setToken(token);
            }}
          />
        )}
        value={amount.formatted}
        onChange={register("amount")}
        error={errors.amount}
        {...(token ? {
          rightLabel: `Avail. ${maxBalance} ${token.symbol}`,
          rightLabelAction: () => setRawValue("amount", token.balance)
        } : {})}
        disabled={false}
      />

      

      {token && (
        <>
          <div className="flex gap-2 w-full">
            {percentages.map(({ label, value }, index) => (
              <RoundedButton
                key={index}
                size="pill"
                className="flex-1 text-slate-500 text-sm mt-2"
                onClick={() => setRawValue("amount", (maxBalanceRaw * value) / 100n)}
              >
                {label}
              </RoundedButton>
            ))}
          </div>

          {hasRoutingError ? (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800 text-sm font-medium">Token not available on secondary markets</p>
              <p className="text-amber-700 text-xs mt-1">
                This token may only be available through direct minting. Check the main page for minting options.
              </p>
            </div>
          ) : (
            <Modal.Container className="mt-4">
              <div className="flex justify-between w-full">
                <p className="font-medium text-lg">You receive</p>
                <p className="font-mono text-xl">~{amountOut && !hasRoutingError ? formatDecimals(amountOut.amount || amountOut, amountOut.decimals || 18) : "0.00"} ${symbol}</p>

              </div>
            </Modal.Container>
          )}
        </>
      )}

      {token && amount.raw > 0n && !hasRoutingError ? (
        <DecentSwapButton
          amount={amount.raw}
          srcToken={token.address as Address}
          srcChainId={token.chainId}
          dstToken={clubAddress}
          dstChainId={DEFAULT_CHAIN_ID}
          label={`Buy $${symbol} Tokens`}
          onSwapPrepared={(swap) => {
            setSwapData(swap);
          }}
          onComplete={async (_: Hash) => {
            refetchClubMember();
            close();
          }}
        />
      ) : token && hasRoutingError ? (
        <Button
          fluid
          className="mt-4"
          color="secondary"
          size="large"
          label="Token not available on DEX"
          disabled={true}
        />
      ) : token ? (
        <Button
          fluid
          className="mt-4"
          color="primary"
          size="large"
          label={amount.raw <= 0n ? "Enter an amount" : `Buy $${symbol} Tokens`}
          disabled={true}
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