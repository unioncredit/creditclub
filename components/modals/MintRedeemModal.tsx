import {
  Modal,
  ModalOverlay,
  Input,
  SegmentedControl,
  // @ts-ignore
} from "@unioncredit/ui";

import { useModals } from "@/providers/ModalManagerProvider";
import { SendReceivePanel } from "@/components/shared/SendReceivePanel";
import { useState } from "react";
import { useClubData } from "@/hooks/useClubData";
import { Address, erc20Abi } from "viem";
import { useAccount } from "wagmi";
import { useClubMember } from "@/hooks/useClubMember";
import { useErc20Token } from "@/hooks/useErc20Token";
import { formatDecimals } from "@/lib/format";
import { IFormField, IFormValues, useForm } from "@/hooks/useForm";
import { useMintRedeemPreview } from "@/hooks/useMintRedeemPreview";
import { ApprovalButton } from "@/components/shared/ApprovalButton";
import { useCreditVaultContract } from "@/hooks/useCreditVaultContract";

export const MINT_REDEEM_MODAL = "mint-redeem-modal";

export const MintRedeemModal = ({
  activeTab,
  clubAddress,
}: {
  activeTab: "mint" | "redeem";
  clubAddress: Address;
}) => {
  const [tab, setTab] = useState<"mint" | "redeem">(activeTab);

  const { close } = useModals();
  const { address } = useAccount();
  const { data: clubData, refetch: refetchClubData } = useClubData(clubAddress)
  const { data: clubMember, refetch: refetchClubMember } = useClubMember(address, clubAddress);
  const { data: assetToken } = useErc20Token(clubData.assetAddress);

  const creditVaultContract = useCreditVaultContract(clubAddress);

  const action = tab === "mint" ? "Mint" : "Redeem";

  const { assetBalance, clubTokenBalance } = clubMember;

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
  } = tab === "mint" ? {
    sendTokenSymbol: assetTokenSymbol,
    sendTokenBalance: assetBalance,
    sendTokenDecimals: assetTokenDecimals,
    receiveTokenSymbol: clubTokenSymbol,
    receiveTokenDecimals: clubTokenDecimals,
  } : {
    sendTokenSymbol: clubTokenSymbol,
    sendTokenBalance: clubTokenBalance,
    sendTokenDecimals: clubTokenDecimals,
    receiveTokenSymbol: assetTokenSymbol,
    receiveTokenDecimals: assetTokenDecimals,
  };

  const validate = (inputs: IFormValues) => {
    const shares = inputs.shares as IFormField;

    if (shares.raw > sendTokenBalance) {
      return `Only ${formatDecimals(sendTokenBalance, sendTokenDecimals)} ${sendTokenSymbol} Available`;
    }
  };

  const {
    setRawValue,
    register,
    values = {},
    errors = {},
    empty
  } = useForm({ validate });

  const shares = values.shares as IFormField || empty;
  const sharesRaw = shares.raw || 0n;

  const { data: amountReceived } = useMintRedeemPreview({
    action: tab,
    shares: sharesRaw,
    clubAddress,
  });

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
            rightLabel={`Max. ${formatDecimals(sendTokenBalance, sendTokenDecimals, 2)}`}
            rightLabelAction={() => setRawValue("shares", sendTokenBalance)}
            suffix={sendTokenSymbol}
            placeholder="0.0"
            className="mt-4"
            value={shares.formatted}
            onChange={register("shares")}
            error={errors.shares}
          />

          <SendReceivePanel
            className="my-4"
            leftPanel={{
              title: "What you send",
              value: formatDecimals(sharesRaw, sendTokenDecimals, 0),
              icon: ` ${sendTokenSymbol}`,
            }}
            rightPanel={{
              title: "What you receive",
              value: formatDecimals(amountReceived, sendTokenDecimals, 0),
              icon: ` ${receiveTokenSymbol}`
            }}
          />

          <ApprovalButton
            owner={address}
            amount={sharesRaw}
            disabled={!!errors.shares || sharesRaw < 0n || assetBalance < sharesRaw}
            spender={creditVaultContract.address}
            tokenContract={{
              abi: erc20Abi,
              address: assetTokenAddress,
            }}
            actionProps={{
              ...creditVaultContract,
              ...(tab === "mint" ? {
                functionName: "mint",
                args: [sharesRaw, address],
              } : {
                functionName: "redeem",
                args: [sharesRaw, address, address],
              }),
              label: sharesRaw <= 0n
                ? "Enter an amount"
                : `${action} ${formatDecimals(amountReceived, receiveTokenDecimals, 0)} ${receiveTokenSymbol}`,
              disabled: !!errors.shares || sharesRaw < 0n || assetBalance < sharesRaw,
              onComplete: async () => {
                close();
                refetchClubData();
                refetchClubMember();
              }
            }}
          />
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
