import {
  Input,
  CalendarIcon,
  WalletIcon,
  // @ts-ignore
} from "@unioncredit/ui";
import { Address, erc20Abi } from "viem";
import { useAccount, useWatchAsset } from "wagmi";

import { useModals } from "@/providers/ModalManagerProvider";
import { useClubData } from "@/hooks/useClubData";
import { useClubMember } from "@/hooks/useClubMember";
//import { useErc20Token } from "@/hooks/useErc20Token";
import { formatDecimals } from "@/lib/format";
import { IFormField, IFormValues, useForm } from "@/hooks/useForm";
import { useMintRedeemPreview } from "@/hooks/useMintRedeemPreview";
import { ApprovalButton } from "@/components/shared/ApprovalButton";
//import { useCreditVaultContract } from "@/hooks/useCreditVaultContract";
import { formatDuration } from "@/lib/utils";
import { POST_TX_MODAL } from "@/components/modals/PostTxModal";
//import { useClubAuction } from "@/hooks/useClubAuction";
import { useClubActivation } from "@/hooks/useClubActivation";
import { useClubStaking } from "@/hooks/useClubStaking";
import { useStakingContract } from "@/hooks/useStakingContract";

export const StakePanel = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const { open: openModal } = useModals();
  const { address: connectedAddress } = useAccount();
  const { data: clubData, refetch: refetchClubData } = useClubData(clubAddress)
  const { data: clubMember, refetch: refetchClubMember } = useClubMember(connectedAddress, clubAddress);
  const { data: stakingData } = useClubStaking(clubAddress);
  const { activated } = useClubActivation(clubAddress);
  const { watchAsset } = useWatchAsset();

  const stakingContract = useStakingContract(clubData.stakingAddress);

  const { clubTokenBalance } = clubMember;

  const {
    image,
    symbol: vaultTokenSymbol,
    decimals: vaultTokenDecimals,
  } = clubData;

  const {
    symbol: stakingTokenSymbol,
    decimals: stakingTokenDecimals,
  } = stakingData;

  const {
    sendTokenSymbol,
    sendTokenBalance,
    sendTokenDecimals,
    receiveTokenSymbol,
    receiveTokenDecimals,
    receiveTokenAddress,
  } = {
    sendTokenSymbol: vaultTokenSymbol,
    sendTokenBalance: clubTokenBalance,
    sendTokenDecimals: vaultTokenDecimals,
    receiveTokenSymbol: stakingTokenSymbol,
    receiveTokenDecimals: stakingTokenDecimals,
    receiveTokenAddress: clubData.stakingAddress,
  };

  const validate = (inputs: IFormValues) => {
    const amount = inputs.amount as IFormField;
    if (amount.raw > sendTokenBalance) {
      return `Only ${formatDecimals(sendTokenBalance, sendTokenDecimals)} ${sendTokenSymbol} Available`;
    }
    // Check if the amount would result in 0 shares (prevent rounding to zero)
    if (amount.raw > 0n && amountReceived === 0n) {
      return "Amount too small - would result in 0 shares";
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
    erc4626Address: clubData.stakingAddress,
  });

  const inputError = () => {
    if (errors.amount) {
      return errors.amount;
    }
    return null;
  };

  const footerStats = [
    {
      title: "Withdraw Period",
      value: formatDuration(Number(clubData.lockupPeriod)),
    },
  ];

  return (
    <>
      <Input
        type="number"
        name="amount"
        label="Amount"
        rightLabel={`Max. ${formatDecimals(sendTokenBalance, sendTokenDecimals, 2)} ${sendTokenSymbol}`}
        rightLabelAction={() => {
          setRawValue("amount", sendTokenBalance);
        }}
        suffix={(
          <img
            width={24}
            height={24}
            src={image}
            alt="Vault Token"
            className="border border-black"
          />
        )}
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
        disabled={!!inputError() || amountRaw < 0n || clubTokenBalance < amountRaw || (amountRaw > 0n && amountReceived === 0n)}
        spender={stakingContract.address}
        tokenContract={{
          abi: erc20Abi,
          address: clubAddress, // Vault token address
        }}
        actionProps={{
          ...stakingContract,
          functionName: "deposit",
          args: [amountRaw, connectedAddress],
          label: !activated ? "Club not activated"
            : amountRaw <= 0n
              ? "Enter an amount"
              : amountRaw > clubTokenBalance
                ? "Insufficient balance"
                : `Stake ${formatDecimals(amountRaw, sendTokenDecimals, 2)} ${sendTokenSymbol}`,
          disabled: !!errors.amount || amountRaw < 0n || clubTokenBalance < amountRaw || (amountRaw > 0n && amountReceived === 0n),
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
                    Withdrawable in: {formatDuration(Number(clubData.lockupPeriod))}
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
