import {
  Input,
  CalendarIcon,
  WalletIcon,
  Usdc,
  // @ts-ignore
} from "@unioncredit/ui";
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
import { formatDuration } from "@/lib/utils";
import { POST_TX_MODAL } from "@/components/modals/PostTxModal";
import { useClubAuction } from "@/hooks/useClubAuction";
import { useClubActivation } from "@/hooks/useClubActivation";

export const StakePanel = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const { open: openModal } = useModals();
  const { address: connectedAddress } = useAccount();
  const { data: clubData, refetch: refetchClubData } = useClubData(clubAddress)
  const { data: clubMember, refetch: refetchClubMember } = useClubMember(connectedAddress, clubAddress);
  const { data: assetToken } = useErc20Token(clubData.assetAddress);
  const { data: auctionData } = useClubAuction(clubAddress);
  const { activated } = useClubActivation(clubAddress);
  const { watchAsset } = useWatchAsset();

  const creditVaultContract = useCreditVaultContract(clubAddress);

  const { assetBalance } = clubMember;
  const { minTarget } = auctionData;

  const {
    address: assetTokenAddress,
    symbol: assetTokenSymbol,
    decimals: assetTokenDecimals,
  } = assetToken;

  console.log({ creditVaultContract, assetTokenAddress });

  const {
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

  const { data: amountReceived } = useMintRedeemPreview({
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

  const footerStats = [
    {
      title: "Withdraw Period",
      value: formatDuration(Number(lockupPeriod)),
    },
  ];

  return (
    <>
      <Input
        type="number"
        name="amount"
        label="Amount"
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

      <ul className="my-2 flex flex-col items-center justify-between">
        {footerStats.map(({ title, value }, index) => (
          <li key={index} className="flex items-center justify-between gap-2 w-full py-2">
            <h3 className="font-medium text-stone-500">{title}</h3>
            <p className="font-mono font-medium flex gap-1 items-center">
              {value}
            </p>
          </li>
        ))}
      </ul>

      <ApprovalButton
        owner={connectedAddress}
        amount={amountRaw}
        disabled={!!inputError() || amountRaw < 0n || assetBalance < amountRaw}
        spender={creditVaultContract.address}
        tokenContract={{
          abi: erc20Abi,
          address: assetTokenAddress,
        }}
        actionProps={{
          ...creditVaultContract,
          functionName: "deposit",
          args: [amountRaw, connectedAddress],
          label: !activated ? "Club not activated"
            : amountRaw <= 0n
              ? "Enter an amount"
              : amountRaw > assetBalance
                ? "Insufficient balance"
                : `Stake ${formatDecimals(amountRaw, sendTokenDecimals, 2)} ${sendTokenSymbol}`,
          disabled: !!errors.amount || amountRaw < 0n || assetBalance < amountRaw,
          onComplete: async (hash: string) => {
            refetchClubData();
            refetchClubMember();
            openModal(POST_TX_MODAL, {
              header: `Your stake was successful`,
              title: "Stake",
              content: (
                <>
                  <p className="font-mono mt-2">You
                    received {formatDecimals(amountReceived, receiveTokenDecimals, 2, false)} {receiveTokenSymbol}</p>

                  <div className="flex items-center gap-2 my-4 text-sm text-blue-600">
                    <CalendarIcon width={24} className="fill" />
                    Withdrawable in: {formatDuration(Number(lockupPeriod))}
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
