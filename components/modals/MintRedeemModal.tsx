import {
  Button,
  Modal,
  ModalOverlay,
  Input,
  SegmentedControl,
  InfoBanner,
  CalendarIcon,
  WalletIcon,
  // @ts-ignore
} from "@unioncredit/ui";

import { useModals } from "@/providers/ModalManagerProvider";
import { SendReceivePanel } from "@/components/shared/SendReceivePanel";
import { useState } from "react";
import { useClubData } from "@/hooks/useClubData";
import { Address, erc20Abi } from "viem";
import { useAccount, useWatchAsset } from "wagmi";
import { useClubMember } from "@/hooks/useClubMember";
import { useErc20Token } from "@/hooks/useErc20Token";
import { formatDecimals } from "@/lib/format";
import { IFormField, IFormValues, useForm } from "@/hooks/useForm";
import { useMintRedeemPreview } from "@/hooks/useMintRedeemPreview";
import { ApprovalButton } from "@/components/shared/ApprovalButton";
import { useCreditVaultContract } from "@/hooks/useCreditVaultContract";
import { useWrite } from "@/hooks/useWrite";
import { useClubActivation } from "@/hooks/useClubActivation";
import { capitalize, formatDuration } from "@/lib/utils";
import { POST_TX_MODAL } from "@/components/modals/PostTxModal";

export const MINT_REDEEM_MODAL = "mint-redeem-modal";

export const MintRedeemModal = ({
  activeTab,
  clubAddress,
}: {
  activeTab: "mint" | "redeem";
  clubAddress: Address;
}) => {
  const [tab, setTab] = useState<"mint" | "redeem">(activeTab);

  const { open: openModal, close } = useModals();
  const { address } = useAccount();
  const { data: clubData, refetch: refetchClubData } = useClubData(clubAddress)
  const { data: clubMember, refetch: refetchClubMember } = useClubMember(address, clubAddress);
  const { data: assetToken } = useErc20Token(clubData.assetAddress);
  const { activated, locked, remaining } = useClubActivation(clubAddress);
  const { watchAsset } = useWatchAsset();

  const creditVaultContract = useCreditVaultContract(clubAddress);

  const action = tab === "mint" ? "Mint" : "Redeem";

  const { assetBalance, clubTokenBalance } = clubMember;

  const {
    address: assetTokenAddress,
    symbol: assetTokenSymbol,
    decimals: assetTokenDecimals,
  } = assetToken;

  const {
    raiseOver,
    totalAssets,
    initialRaise,
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
  } = tab === "mint" ? {
    sendTokenSymbol: assetTokenSymbol,
    sendTokenBalance: assetBalance,
    sendTokenDecimals: assetTokenDecimals,
    receiveTokenSymbol: clubTokenSymbol,
    receiveTokenDecimals: clubTokenDecimals,
    receiveTokenAddress: clubAddress,
  } : {
    sendTokenSymbol: clubTokenSymbol,
    sendTokenBalance: clubTokenBalance,
    sendTokenDecimals: clubTokenDecimals,
    receiveTokenSymbol: assetTokenSymbol,
    receiveTokenDecimals: assetTokenDecimals,
    receiveTokenAddress: assetTokenAddress,
  };

  const validate = (inputs: IFormValues) => {
    const shares = inputs.shares as IFormField;

    if (tab === "mint") {
      if (shares.raw > sendTokenBalance) {
        return `Only ${formatDecimals(sendTokenBalance, sendTokenDecimals)} ${sendTokenSymbol} Available`;
      }
    } else {
      if (shares.raw > clubTokenBalance) {
        return `Only ${formatDecimals(sendTokenBalance, sendTokenDecimals)} ${sendTokenSymbol} Available`;
      }
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
    action: tab,
    shares: sharesRaw,
    clubAddress,
  });

  const redeemButtonProps = useWrite({
    ...creditVaultContract,
    functionName: "redeem",
    args: [sharesRaw, address, address],
    label: sharesRaw <= 0n
      ? "Enter an amount"
      : `${action} ${formatDecimals(amountReceived, receiveTokenDecimals, 0)} ${receiveTokenSymbol}`,
    disabled: !!errors.shares || sharesRaw <= 0n || clubTokenBalance < sharesRaw,
    onComplete: async (hash: string) => {
      close();
      refetchClubData();
      refetchClubMember();
      openModal(POST_TX_MODAL, {
        header: `Your ${tab} was successful`,
        title: capitalize(tab),
        content: (
          <>
            <p className="font-mono mt-2">You successfully {tab}ed {formatDecimals(amountReceived, receiveTokenDecimals, 2, false)} {receiveTokenDecimals}</p>

            {tab === "mint" && (
              <div className="flex items-center gap-2 my-4 text-sm text-blue-600">
                <CalendarIcon width={24} className="fill" />
                Redeemable: {activated
                ? locked
                  ? formatDuration(remaining)
                  : "Now"
                : formatDuration(Number(lockupPeriod))}
              </div>
            )}
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
  });

  const inputError = () => {
    if (errors.shares) {
      return errors.shares;
    }

    if (tab === "mint") {
      if (totalAssets + sharesRaw > initialRaise) {
        return "You cannot mint more than the initial raise";
      }
    }

    return null;
  };

  return (
    <ModalOverlay onClick={close}>
      <Modal>
        <Modal.Header title={`${action} ${clubTokenSymbol}`} onClose={close} />
        <Modal.Body>
          <SegmentedControl
            value={tab}
            initialActive={0}
            onChange={(value: { id: "mint" | "redeem" }) => setTab(value.id)}
            items={[
              {
                id: "mint",
                label: "Mint",
                disabled: raiseOver,
              },
              {
                id: "redeem",
                label: "Redeem",
              },
            ]}
          />

          <Input
            type="number"
            name="amount"
            label={`${action} Amount`}
            rightLabel={`Max. ${formatDecimals(sendTokenBalance, sendTokenDecimals, 2)} ${sendTokenSymbol}`}
            rightLabelAction={() => setRawValue("shares", sendTokenBalance)}
            suffix={sendTokenSymbol}
            placeholder="0.0"
            className="mt-4"
            value={shares.formatted}
            onChange={register("shares")}
            error={inputError()}
            disabled={tab === "redeem" && locked}
          />

          <SendReceivePanel
            className="my-4"
            leftPanel={{
              title: "What you send",
              value: formatDecimals(sharesRaw, sendTokenDecimals, 2),
              icon: ` ${sendTokenSymbol}`,
            }}
            rightPanel={{
              title: "What you receive",
              value: formatDecimals(amountReceived, receiveTokenDecimals, 2, false),
              icon: ` ${receiveTokenSymbol}`
            }}
          />

          {tab === "redeem" && (!activated || locked) && (
            <InfoBanner
              align="left"
              variant="warning"
              label={!activated ? "Redeem is not available until the club has been activated and the lock period has expired." : `Redeem is not available until the club locked period has expired. There are ${formatDuration(remaining)} remaining until the club is unlocked.`}
              className="text-sm mt-4 p-3 bg-slate-50  font-mono border border-black"
            />
          )}

          {tab === "mint" ? (
            <ApprovalButton
              owner={address}
              amount={sharesRaw}
              disabled={!!inputError() || sharesRaw < 0n || assetBalance < sharesRaw}
              spender={creditVaultContract.address}
              tokenContract={{
                abi: erc20Abi,
                address: assetTokenAddress,
              }}
              actionProps={{
                ...creditVaultContract,
                functionName: "deposit",
                args: [sharesRaw, address],
                label: sharesRaw <= 0n
                  ? "Enter an amount"
                  : sharesRaw > assetBalance
                    ? "Insufficient balance"
                    : `${action} ${formatDecimals(amountReceived, receiveTokenDecimals, 2)} ${receiveTokenSymbol}`,
                disabled: !!errors.shares || sharesRaw < 0n || assetBalance < sharesRaw,
                onComplete: async () => {
                  close();
                  refetchClubData();
                  refetchClubMember();
                }
              }}
            />
          ) : (
            <Button
              fluid
              className="mt-4"
              color="primary"
              size="large"
              label={sharesRaw <= 0n
                ? "Enter an amount"
                : sharesRaw > clubTokenBalance
                  ? "Insufficient balance"
                  : `${action} ${formatDecimals(amountReceived, receiveTokenDecimals, 2)} ${receiveTokenSymbol}`}
              {...redeemButtonProps}
            />
          )}
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
