import "./MintMemberNftMultichain.scss";

import { TheBox } from "@decent.xyz/the-box";
import { ActionType, ChainId } from '@decent.xyz/box-common';
import { wagmiConfig } from "@/providers/Web3Provider.tsx";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useClubMember } from "@/providers/CreditClubMemberProvider.tsx";
import { clubPluginContract, daiContract } from "@/contracts/optimism.ts";
import { useClubData } from "@/providers/CreditClubDataProvider.tsx";
import { useToastProps } from "@/hooks/useToastProps.ts";
import { ToastStatus } from "@/constants.ts";
import { useToasts } from "@/providers/ToastsProvider.tsx";
import { useState } from "react";
import { useModals } from "@/providers/ModalManagerProvider.tsx";
import { POST_MINT_NFT_MODAL } from "@/components/modals/PostMintNftModal.tsx";
import { TransactionReceipt } from "viem";

export const MintMemberNftMultichain = () => {
  const [toastId, setToastId] = useState<string | null>(null);

  const { open: openModal } = useModals();
  const { addToast, closeToast } = useToasts();
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { data: member, refetch: refetchMember } = useClubMember();
  const { data: creditClub, refetch: refetchCreditClub } = useClubData();

  const { isMember } = member;
  const { costToMint } = creditClub;
  const createToast = useToastProps("mintMemberNFT");

  return (
    <TheBox
      className="MintMemberNftMultichain"
      actionType={ActionType.EvmFunction}
      paymentButtonText="Mint Member NFT"
      disableLoadingModals={true}
      chains={[ChainId.OPTIMISM]}
      disableGuard={async () => {
        return { disable: isMember, message: "Already a member" }
      }}
      actionConfig={{
        chainId: ChainId.OPTIMISM,
        contractAddress: clubPluginContract.address,
        cost: {
          amount: costToMint,
          isNative: false,
          tokenAddress: daiContract.address,
        },
        signature: 'function mintMemberNFT(address recipient)',
        args: [address],
      }}
      onTxPending={() => {
        setToastId(addToast(createToast(ToastStatus.PENDING), false))
      }}
      // @ts-ignore
      onTxReceipt={(r: TransactionReceipt) => {
        if (toastId) {
          closeToast(toastId);
        }
        setToastId(addToast(createToast(ToastStatus.SUCCESS), false));
        refetchCreditClub();
        refetchMember();
        openModal(POST_MINT_NFT_MODAL, {
          hash: r.transactionHash,
        });
      }}
      onTxError={() => {
        if (toastId) {
          closeToast(toastId);
        }
        setToastId(addToast(createToast(ToastStatus.FAILED), true));
      }}
      wagmiConfig={wagmiConfig}
      onConnectWallet={() => openConnectModal && openConnectModal()}
      apiKey={import.meta.env.VITE_DECENT_API_KEY}
    />
  );
};
