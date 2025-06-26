import {
  Input,
  CalendarIcon,
  WalletIcon,
  Usdc,
  // @ts-ignore
} from "@unioncredit/ui";
import { useState } from "react";
import { Address, erc20Abi } from "viem";
import { useAccount, useWatchAsset } from "wagmi";

import { useModals } from "@/providers/ModalManagerProvider";
import { useClubData } from "@/hooks/useClubData";
import { useClubMember } from "@/hooks/useClubMember";
import { useErc20Token } from "@/hooks/useErc20Token";
import { formatDecimals } from "@/lib/format";
import { IFormField, IFormValues, useForm } from "@/hooks/useForm";
import { useMintRedeemPreview } from "@/hooks/useMintRedeemPreview";
import { ApprovalButton } from "@/components/shared/ApprovalButton";
import { useCreditVaultContract } from "@/hooks/useCreditVaultContract";
import { useClubActivation } from "@/hooks/useClubActivation";
import { formatDuration } from "@/lib/utils";
import { POST_TX_MODAL } from "@/components/modals/PostTxModal";
import { Checkbox } from "@/components/ui/Checkbox";
import { useClubAuction } from "@/hooks/useClubAuction";

export const MintPanel = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const [checked, setChecked] = useState<boolean>(false);

  const { open: openModal } = useModals();
  const { address } = useAccount();
  const { data: clubData, refetch: refetchClubData } = useClubData(clubAddress)
  const { data: clubMember, refetch: refetchClubMember } = useClubMember(address, clubAddress);
  const { data: assetToken } = useErc20Token(clubData.assetAddress);
  const { data: auctionData } = useClubAuction(clubAddress);
  const { activated, locked, remaining } = useClubActivation(clubAddress);
  const { watchAsset } = useWatchAsset();

  const creditVaultContract = useCreditVaultContract(clubAddress);

  const { assetBalance } = clubMember;
  const { minTarget } = auctionData;

  const {
    address: assetTokenAddress,
    symbol: assetTokenSymbol,
    decimals: assetTokenDecimals,
  } = assetToken;

  const {
    image,
    totalAssets,
    symbol: clubTokenSymbol,
    decimals: clubTokenDecimals,
    lockupPeriod,
  } = clubData;

  const {
    sendTokenSymbol,
    sendTokenBalance,
    sendTokenDecimals,
    receiveTokenSymbol,
    receiveTokenDecimals,
    receiveTokenAddress,
  } = {
    sendTokenSymbol: assetTokenSymbol,
    sendTokenBalance: assetBalance,
    sendTokenDecimals: assetTokenDecimals,
    receiveTokenSymbol: clubTokenSymbol,
    receiveTokenDecimals: clubTokenDecimals,
    receiveTokenAddress: clubAddress,
  };

  const validate = (inputs: IFormValues) => {
    const amount = inputs.amount as IFormField;
    if (amount.raw > sendTokenBalance) {
      return `Only ${formatDecimals(sendTokenBalance, sendTokenDecimals)} ${sendTokenSymbol} Available`;
    }
    if (totalAssets + amount.raw > minTarget) {
      return `Maximum mint amount is ${formatDecimals(minTarget - totalAssets, sendTokenDecimals)} ${sendTokenSymbol}`;
    }
  };

  const {
    setRawValue,
    register,
    values = {},
    errors = {},
    empty
  } = useForm({ decimals: sendTokenDecimals, validate });

  const amount = values.amount as IFormField || empty;
  const amountRaw = amount.raw || 0n;

  const { data: amountReceived = 0n } = useMintRedeemPreview({
    action: "mint",
    shares: amountRaw,
    erc4626Address: clubAddress,
  });

  const inputError = () => {
    if (errors.amount) {
      return errors.amount;
    }
    if (totalAssets + amountRaw > minTarget) {
      return "You cannot mint more than the initial raise";
    }

    return null;
  };

  return (
    <>
      <Input
        type="number"
        name="amount"
        label="Mint Amount"
        rightLabel={`Max. ${formatDecimals(minTarget - totalAssets < sendTokenBalance ? minTarget - totalAssets : sendTokenBalance, sendTokenDecimals, 2)} ${sendTokenSymbol}`}
        rightLabelAction={() => {
          const maxAmount = minTarget - totalAssets;
          setRawValue("amount", maxAmount < sendTokenBalance ? maxAmount : sendTokenBalance);
        }}
        suffix={<Usdc />}
        placeholder="0.0"
        className="mt-4"
        value={amount.formatted}
        onChange={register("amount")}
        error={inputError()}
      />

      <h2 className="mt-4 mb-0.5">You receive:</h2>
      <div className="bg-stone-100 p-1 rounded-2xl">
        <Input
          disabled={true}
          value={formatDecimals(amountReceived as bigint, receiveTokenDecimals, 2, false)}
          suffix={(
            <img
              width={24}
              height={24}
              src={image}
              alt="Fund Image"
              className="border border-black"
            />
          )}
        />
      </div>

      <div className="flex gap-1 p-2 border border-black font-mono my-4 bg-stone-100">
        <Checkbox
          id="terms"
          className="mr-1"
          checked={checked}
          onCheckedChange={(value: boolean) => setChecked(value)}
        />
        <label
          htmlFor="terms"
          className="text-xs peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I understand that this is risky, that I may lose all my funds, and I will not be able to withdraw funds until the lockup period ends.
        </label>
      </div>

      <ApprovalButton
        owner={address}
        amount={amountRaw}
        disabled={!!inputError() || amountRaw < 0n || assetBalance < amountRaw || !checked}
        spender={creditVaultContract.address}
        tokenContract={{
          abi: erc20Abi,
          address: assetTokenAddress,
        }}
        actionProps={{
          ...creditVaultContract,
          functionName: "deposit",
          args: [amountRaw, address],
          label: amountRaw <= 0n
            ? "Enter an amount"
            : amountRaw > assetBalance
              ? "Insufficient balance"
              : `Mint ${formatDecimals(amountReceived as bigint, receiveTokenDecimals, 2)} ${receiveTokenSymbol}`,
          disabled: !!errors.amount || amountRaw < 0n || assetBalance < amountRaw,
          onComplete: async (hash: string) => {
            refetchClubData();
            refetchClubMember();
            openModal(POST_TX_MODAL, {
              header: `Your mint was successful`,
              title: "Mint",
              content: (
                <>
                  <p className="font-mono mt-2">You successfully minted {formatDecimals(amountReceived as bigint, receiveTokenDecimals, 2, false)} {receiveTokenSymbol}</p>

                  <div className="flex items-center gap-2 my-4 text-sm text-blue-600">
                    <CalendarIcon width={24} className="fill" />
                    Redeemable: {activated
                    ? locked
                      ? formatDuration(remaining)
                      : "Now"
                    : formatDuration(Number(lockupPeriod))}
                  </div>
                </>
              ),
              action: {
                icon: WalletIcon,
                label: "Add token to wallet",
                onClick: () => watchAsset({
                  type: 'ERC20',
                  options: {
                    address: receiveTokenAddress,
                    symbol: receiveTokenSymbol,
                    decimals: receiveTokenDecimals,
                  },
                })
              },
              hash,
            })
          }
        }}
      />
    </>
  )
}
