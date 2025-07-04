import {
  Input,
  Usdc,
  InfoBanner,
  WalletIcon,
  // @ts-ignore
} from "@unioncredit/ui";

import { useModals } from "@/providers/ModalManagerProvider";
import { useClubData } from "@/hooks/useClubData";
import { Address, erc20Abi } from "viem";
import { useAccount, useWatchAsset, useReadContract } from "wagmi";
import { useClubMember } from "@/hooks/useClubMember";
import { useErc20Token } from "@/hooks/useErc20Token";
import { formatDecimals } from "@/lib/format";
import { IFormField, IFormValues, useForm } from "@/hooks/useForm";
import { useMintRedeemPreview } from "@/hooks/useMintRedeemPreview";
import { useCreditVaultContract } from "@/hooks/useCreditVaultContract";
import { useClubActivation } from "@/hooks/useClubActivation";
import { formatDuration } from "@/lib/utils";
import { POST_TX_MODAL } from "@/components/modals/PostTxModal";
import Image from "next/image";
import { createIpfsImageUrl } from "@/lib/links";
import { useClubMemberNft } from "@/hooks/useClubMemberNft";
import { ApprovalButton } from "@/components/shared/ApprovalButton";

export const RedeemPanel = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {

  const { open: openModal, close } = useModals();
  const { address } = useAccount();
  const { data: clubData, refetch: refetchClubData } = useClubData(clubAddress)
  const { data: clubMember, refetch: refetchClubMember } = useClubMember(address, clubAddress);
  const { data: assetToken } = useErc20Token(clubData.assetAddress);
  const { data: clubMemberNftData } = useClubMemberNft(clubAddress);
  const { activated, locked, remaining } = useClubActivation(clubAddress);
  const { watchAsset } = useWatchAsset();

  const creditVaultContract = useCreditVaultContract(clubAddress);

  const { clubTokenBalance } = clubMember;
  const { image: ipfsImageLink } = clubMemberNftData;

  const {
    address: assetTokenAddress,
    symbol: assetTokenSymbol,
    decimals: assetTokenDecimals,
  } = assetToken;

  const {
    symbol: clubTokenSymbol,
    decimals: clubTokenDecimals,
  } = clubData;

  const {
    sendTokenSymbol,
    sendTokenBalance,
    sendTokenDecimals,
    receiveTokenSymbol,
    receiveTokenDecimals,
    receiveTokenAddress,
  } = {
    sendTokenSymbol: clubTokenSymbol,
    sendTokenBalance: clubTokenBalance,
    sendTokenDecimals: clubTokenDecimals,
    receiveTokenSymbol: assetTokenSymbol,
    receiveTokenDecimals: assetTokenDecimals,
    receiveTokenAddress: assetTokenAddress,
  };

  const validate = (inputs: IFormValues) => {
    const shares = inputs.shares as IFormField;

    if (shares.raw > clubTokenBalance) {
      return `Only ${formatDecimals(sendTokenBalance, sendTokenDecimals)} ${sendTokenSymbol} Available`;
    }
  };

  const {
    setRawValue,
    register,
    values = {},
    errors = {},
    empty
  } = useForm({ decimals: sendTokenDecimals, validate });

  const shares = values.shares as IFormField || empty;
  const sharesRaw = shares.raw || 0n;

  const { data: amountReceived } = useMintRedeemPreview({
    action: "redeem",
    shares: sharesRaw,
    clubAddress,
  });

  // Check vault limits
  const { data: maxWithdrawAmount } = useReadContract({
    ...creditVaultContract,
    functionName: "maxWithdraw",
    args: [address!],
    query: { enabled: !!address },
  });

  const { data: maxRedeemShares } = useReadContract({
    ...creditVaultContract,
    functionName: "maxRedeem",
    args: [address!],
    query: { enabled: !!address },
  });

  // Debug logs
  console.log("🔍 RedeemPanel Debug:", {
    sharesFormatted: shares.formatted,
    sharesDisplay: shares.display,
    sharesRaw: sharesRaw.toString(),
    amountReceived: amountReceived.toString(),
    clubTokenBalance: clubTokenBalance.toString(),
    maxWithdrawAmount: maxWithdrawAmount?.toString() || "loading",
    maxRedeemShares: maxRedeemShares?.toString() || "loading",
    sendTokenDecimals,
    receiveTokenDecimals,
    activated,
    locked,
    remaining,
    assetTokenAddress,
    clubAddress,
    canRedeem: sharesRaw <= (maxRedeemShares || 0n),
    canWithdraw: amountReceived <= (maxWithdrawAmount || 0n),
  });

  const isLocked = !activated || locked;
  
  const isDisabled = !!errors.shares || sharesRaw <= 0n || clubTokenBalance < sharesRaw || isLocked;
  
  const buttonLabel = !activated
    ? "Club not activated"
    : isLocked
      ? `Locked for ${formatDuration(remaining)}`
      : sharesRaw <= 0n
        ? "Enter an amount"
        : sharesRaw > clubTokenBalance
          ? "Insufficient balance"
          : `Redeem ${formatDecimals(amountReceived, receiveTokenDecimals, 2)} ${receiveTokenSymbol}`;

  // Debug button state
  console.log("🎯 Button Debug:", {
    buttonLabel,
    isDisabled,
    isLocked,
    activated,
    locked,
    remaining,
    sharesRawZero: sharesRaw <= 0n,
    insufficientBalance: sharesRaw > clubTokenBalance,
    hasErrors: !!errors.shares,
  });

  const inputError = () => {
    if (errors.shares) {
      return errors.shares;
    }

    return null;
  };

  return (
    <>
      <Input
        type="number"
        name="shares"
        label="Redeem Amount"
        placeholder="0.0"
        className="mt-4"
        value={shares.formatted}
        onChange={register("shares")}
        error={inputError()}
        suffix={(
          <Image
            width={24}
            height={24}
            src={createIpfsImageUrl(ipfsImageLink)}
            alt="Fund Image"
            className="border border-black"
          />
        )}
        rightLabel={`Max. ${formatDecimals(sendTokenBalance, sendTokenDecimals, 2)} ${sendTokenSymbol}`}
        rightLabelAction={() => setRawValue("shares", sendTokenBalance)}
      />

      <h2 className="mt-4 mb-0.5">You receive:</h2>
      <div className="bg-stone-100 p-1 rounded-2xl">
        <Input
          disabled={true}
          placeHolder="0.0"
          value={formatDecimals(amountReceived, receiveTokenDecimals, 2, false)}
          suffix={<Usdc />}
        />
      </div>

      {isLocked && (
        <InfoBanner
          align="left"
          variant="warning"
          label={!activated 
            ? "Redeem is not available until the club has been activated and the lock period has expired." 
            : remaining > 0
              ? `Redeem is not available until the club locked period has expired. There are ${formatDuration(remaining)} remaining until the club is unlocked.`
              : "Redeem is not available until the club locked period has expired. The club will be unlocked shortly."}
          className="text-sm mt-4 p-2 bg-slate-50 font-mono border border-black"
        />
      )}

      <ApprovalButton
        owner={address}
        amount={sharesRaw}
        disabled={isDisabled}
        spender={clubAddress}
        tokenContract={{
          abi: erc20Abi,
          address: clubAddress,
        }}
        actionProps={{
          ...creditVaultContract,
          functionName: "redeem",
          args: [sharesRaw, address, address],
          label: buttonLabel,
          onTransactionStart: () => {
            console.log("🚀 Starting redeem transaction:", {
              contractAddress: creditVaultContract.address,
              functionName: "redeem",
              args: [sharesRaw.toString(), address, address],
              userAddress: address,
              expectedReceived: amountReceived.toString(),
            });
          },
          onError: (error: any) => {
            console.error("❌ Redeem transaction failed:", {
              error: error.message || error,
              errorCode: error.code,
              sharesRaw: sharesRaw.toString(),
              amountReceived: amountReceived.toString(),
              userAddress: address,
              contractAddress: creditVaultContract.address,
            });
          },
          onComplete: async (hash: string) => {
            console.log("✅ Redeem transaction successful:", {
              hash,
              sharesRedeemed: sharesRaw.toString(),
              amountReceived: amountReceived.toString(),
            });
            close();
            refetchClubData();
            refetchClubMember();
            openModal(POST_TX_MODAL, {
              header: `Your redeem was successful`,
              title: "Redeem",
              content: <p className="font-mono mt-2">You successfully
                redeemed {formatDecimals(amountReceived, receiveTokenDecimals, 2, false)} {receiveTokenSymbol}</p>,
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