import {
  Button,
  Input,
  Usdc,
  InfoBanner,
  WalletIcon,
  // @ts-ignore
} from "@unioncredit/ui";

import { useModals } from "@/providers/ModalManagerProvider";
import { useClubData } from "@/hooks/useClubData";
import { Address } from "viem";
import { useAccount, useWatchAsset } from "wagmi";
import { useClubMember } from "@/hooks/useClubMember";
import { useErc20Token } from "@/hooks/useErc20Token";
import { formatDecimals } from "@/lib/format";
import { IFormField, IFormValues, useForm } from "@/hooks/useForm";
import { useMintRedeemPreview } from "@/hooks/useMintRedeemPreview";
import { useCreditVaultContract } from "@/hooks/useCreditVaultContract";
import { useWrite } from "@/hooks/useWrite";
import { useClubActivation } from "@/hooks/useClubActivation";
import { formatDuration } from "@/lib/utils";
import { POST_TX_MODAL } from "@/components/modals/PostTxModal";
import Image from "next/image";
import { createIpfsImageUrl } from "@/lib/links";
import { useClubMemberNft } from "@/hooks/useClubMemberNft";

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

  const isLocked = !activated || locked;

  const redeemButtonProps = useWrite({
    ...creditVaultContract,
    functionName: "redeem",
    args: [sharesRaw, address, address],
    label: sharesRaw <= 0n
      ? "Enter an amount"
      : `Redeem ${formatDecimals(amountReceived, receiveTokenDecimals, 0)} ${receiveTokenSymbol}`,
    disabled: !!errors.shares || sharesRaw <= 0n || clubTokenBalance < sharesRaw || isLocked,
    onComplete: async (hash: string) => {
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
        name="amount"
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
            : `Redeem is not available until the club locked period has expired. There are ${formatDuration(remaining)} remaining until the club is unlocked.`}
          className="text-sm mt-4 p-2 bg-slate-50 font-mono border border-black"
        />
      )}

      <Button
        fluid
        className="mt-4"
        color="primary"
        size="large"
        label={!activated
          ? "Club not activated"
          : isLocked
            ? `Locked for ${formatDuration(remaining)}`
            : sharesRaw <= 0n
              ? "Enter an amount"
              : sharesRaw > clubTokenBalance
                ? "Insufficient balance"
                : `Redeem ${formatDecimals(amountReceived, receiveTokenDecimals, 2)} ${receiveTokenSymbol}`}
        {...redeemButtonProps}
      />
    </>
  )
};