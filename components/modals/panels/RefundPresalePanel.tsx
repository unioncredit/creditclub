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
import { POST_TX_MODAL } from "@/components/modals/PostTxModal";
import { useClubStaking } from "@/hooks/useClubStaking";

export const RefundPresalePanel = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {

  const { open: openModal, close } = useModals();
  const { address } = useAccount();
  const { data: clubData, refetch: refetchClubData } = useClubData(clubAddress)
  const { data: clubMember, refetch: refetchClubMember } = useClubMember(address, clubAddress);
  const { data: assetToken } = useErc20Token(clubData.assetAddress);
  const { data: stakingData } = useClubStaking(clubAddress);
  const { watchAsset } = useWatchAsset();

  const stakingContract = useCreditVaultContract(clubData.stakingAddress);

  const { clubTokenBalance } = clubMember;

  const {
    address: assetTokenAddress,
    symbol: assetTokenSymbol,
    decimals: assetTokenDecimals,
  } = assetToken;

  const {
    image,
  } = clubData;

  const {
    decimals: stakingTokenDecimals,
    symbol: stakingTokenSymbol,
  } = stakingData;

  const {
    sendTokenSymbol,
    sendTokenBalance,
    sendTokenDecimals,
    receiveTokenSymbol,
    receiveTokenDecimals,
    receiveTokenAddress,
  } = {
    sendTokenSymbol: stakingTokenSymbol,
    sendTokenBalance: clubTokenBalance,
    sendTokenDecimals: stakingTokenDecimals,
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
    erc4626Address: clubAddress,
  });

  const redeemButtonProps = useWrite({
    ...stakingContract,
    functionName: "redeem",
    args: [sharesRaw, address, address],
    label: sharesRaw <= 0n
      ? "Enter an amount"
      : `Redeem ${formatDecimals(amountReceived, receiveTokenDecimals, 0)} ${receiveTokenSymbol}`,
    disabled: !!errors.shares || sharesRaw <= 0n || clubTokenBalance < sharesRaw,
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
      <InfoBanner
        align="left"
        variant="warning"
        label={`Raise failed to reach its goal. Please redeem your $${stakingTokenSymbol} for the $${assetTokenSymbol} you deposited.`}
        className="p-2 bg-yellow-50 border-yellow-600 text-yellow-800 font-mono border rounded-lg text-center"
      />

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
          <img
            width={24}
            height={24}
            src={image}
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

      <Button
        fluid
        className="mt-4"
        color="primary"
        size="large"
        label={sharesRaw <= 0n
          ? "Enter an amount"
          : sharesRaw > clubTokenBalance
            ? "Insufficient balance"
            : `Redeem ${formatDecimals(amountReceived, receiveTokenDecimals, 2)} ${receiveTokenSymbol}`}
        {...redeemButtonProps}
      />
    </>
  )
};