// @ts-ignore
import { WalletIcon, CalendarIcon, Input, Usdc, Modal, ModalOverlay, SegmentedControl } from "@unioncredit/ui";
import { Address, erc20Abi } from "viem";
import { useAccount, useWatchAsset } from "wagmi";

import { useClubData } from "@/hooks/useClubData";
import { useModals } from "@/providers/ModalManagerProvider";
import { useClubMember } from "@/hooks/useClubMember";
import { useErc20Token } from "@/hooks/useErc20Token";
import { useClubAuction } from "@/hooks/useClubAuction";
import { useClubActivation } from "@/hooks/useClubActivation";
import { IFormField, IFormValues, useForm } from "@/hooks/useForm";
import { formatDecimals, formatDurationUntil } from "@/lib/format";
import { useMintRedeemPreview } from "@/hooks/useMintRedeemPreview";
import { ApprovalButton } from "@/components/shared/ApprovalButton";
import { POST_TX_MODAL } from "@/components/modals/PostTxModal";
import { formatDuration } from "@/lib/utils";
import { DistributionBarItem, DistributionBarValues } from "@/components/shared/DistributionBarValues";
import { useClubStaking } from "@/hooks/useClubStaking";
import { useAuctionContract } from "@/hooks/useAuctionContract";
import { useCurrentTime } from "@/hooks/useCurrentTime";

export const PresalePanel = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const { open: openModal } = useModals();
  const { address } = useAccount();
  const { data: clubData, refetch: refetchClubData } = useClubData(clubAddress)
  const { data: clubMember, refetch: refetchClubMember } = useClubMember(address, clubAddress);
  const { data: assetToken } = useErc20Token(clubData.assetAddress);
  const { data: auctionData } = useClubAuction(clubAddress);
  const { data: stakingData } = useClubStaking(clubAddress);
  const { activated, locked, remaining } = useClubActivation(clubAddress);
  const { watchAsset } = useWatchAsset();
  const { hasPassed } = useCurrentTime();

  const auctionContract = useAuctionContract(clubData.auctionAddress);

  const { assetBalance } = clubMember;
  const {
    totalDeposits,
    maxTarget,
    end,
    hasMaxTarget,
  } = auctionData;

  const {
    symbol: stakingTokenSymbol,
    decimals: stakingTokenDecimals,
  } = stakingData;

  const {
    address: assetTokenAddress,
    symbol: assetTokenSymbol,
    decimals: assetTokenDecimals,
  } = assetToken;

  const {
    totalAssets,
    lockupPeriod,
    stakingAddress,
    auctionAddress,
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
    receiveTokenSymbol: stakingTokenSymbol,
    receiveTokenDecimals: stakingTokenDecimals,
    receiveTokenAddress: auctionAddress,
  };

  const validate = (inputs: IFormValues) => {
    const amount = inputs.amount as IFormField;
    if (amount.raw > sendTokenBalance) {
      return `Only ${formatDecimals(sendTokenBalance, sendTokenDecimals)} ${sendTokenSymbol} Available`;
    }
    if (totalAssets + amount.raw > maxTarget) {
      return `Maximum mint amount is ${formatDecimals(maxTarget - totalAssets, sendTokenDecimals)} ${sendTokenSymbol}`;
    }
  };

  const {
    setRawValue,
    register,
    values = {},
    errors = {},
    empty
  } = useForm({ decimals: sendTokenDecimals, validate });

  const maxMintAmount = maxTarget - totalAssets < sendTokenBalance ? maxTarget - totalAssets : sendTokenBalance;
  const amount = values.amount as IFormField || empty;
  const amountRaw = amount.raw || 0n;

  // During auction, tokens are minted 1:1 with USDC, not based on ERC4626 exchange rates
  // The ERC4626 previewDeposit gives wrong results during auction phase
  // Convert USDC amount to staking token amount accounting for decimal differences
  const amountReceived = (() => {
    if (!assetTokenDecimals || !stakingTokenDecimals || !amountRaw) return 0n;
    if (assetTokenDecimals === stakingTokenDecimals) return amountRaw;
    
    const decimalDiff = stakingTokenDecimals - assetTokenDecimals;
    if (decimalDiff < 0) {
      // If staking token has fewer decimals, divide
      return amountRaw / BigInt(10 ** Math.abs(decimalDiff));
    } else {
      // If staking token has more decimals, multiply
      return amountRaw * BigInt(10 ** decimalDiff);
    }
  })();

  // Keep this for debugging - shows the broken ERC4626 calculation
  const { data: erc4626Preview } = useMintRedeemPreview({
    action: "mint",
    shares: amountRaw,
    erc4626Address: stakingAddress,
  });

  const inputError = () => {
    if (errors.amount) {
      return errors.amount;
    }
    if (totalAssets + amountRaw > maxTarget) {
      return "You cannot mint more than the initial raise";
    }

    return null;
  };

  const barValues: DistributionBarItem[] = [
    {
      value: Number(totalDeposits),
      label: `$${formatDecimals(totalDeposits, assetTokenDecimals, 2)}`,
      color: "green600",
      title: "Raised",
    },
    ...(hasMaxTarget ? [{
      value: Number(maxTarget - totalDeposits),
      label: `$${formatDecimals(maxTarget - totalDeposits, assetTokenDecimals, 2)}`,
      color: "blue50",
      title: "Remaining",
    }] : [])
  ];

  return (
    <>
      <Input
        type="number"
        name="amount"
        label="Mint Amount"
        rightLabel={`Max. ${formatDecimals(maxMintAmount, sendTokenDecimals, 2)} ${sendTokenSymbol}`}
        rightLabelAction={() => {
          setRawValue("amount", maxMintAmount);
        }}
        suffix={<Usdc />}
        placeholder="0.0"
        value={amount.formatted}
        onChange={register("amount")}
        error={inputError()}
      />

      <div className="p-4 my-4 rounded-xl border bg-zinc-100">
        <DistributionBarValues items={barValues} className="mt-0 mb-4 border rounded" />

        {end > 0n && (
          <p className="mt-4 bg-white border p-3 rounded-xl text-center">
            {hasPassed(end) ? "Raise period ended" : `Raise ends in: ${formatDurationUntil(Number(end))}`}
          </p>
        )}
      </div>

      <ApprovalButton
        owner={address}
        amount={amountRaw}
        disabled={!!inputError() || amountRaw < 0n || assetBalance < amountRaw}
        spender={receiveTokenAddress}
        tokenContract={{
          abi: erc20Abi,
          address: assetTokenAddress,
        }}
        actionProps={{
          ...auctionContract,
          functionName: "deposit",
          args: [address, amountRaw],
          label: amountRaw <= 0n
            ? "Enter an amount"
            : amountRaw > assetBalance
              ? "Insufficient balance"
              : `Mint ${formatDecimals(amountReceived, stakingTokenDecimals, 2)} ${receiveTokenSymbol}`,
          disabled: !!errors.amount || amountRaw < 0n || assetBalance < amountRaw,
          onComplete: async (hash: string) => {
            refetchClubData();
            refetchClubMember();
            openModal(POST_TX_MODAL, {
              header: `Your mint was successful`,
              title: "Mint",
              content: (
                <>
                  <p className="font-mono mt-2 text-center">You successfully minted {formatDecimals(amountReceived, receiveTokenDecimals, 2, false)} {receiveTokenSymbol}</p>

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
};