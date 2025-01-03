import "./MintMemberNftMultichain.scss";

import { TheBox } from "@decent.xyz/the-box";
import { ActionType, ChainId } from '@decent.xyz/box-common';
import { wagmiConfig } from "@/providers/Web3Provider.tsx";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useClubMember } from "@/providers/CreditClubMemberProvider.tsx";
import { useClubData } from "@/providers/CreditClubDataProvider.tsx";
import { useToastProps } from "@/hooks/useToastProps.ts";
import { ToastStatus } from "@/constants.ts";
import { useToasts } from "@/providers/ToastsProvider.tsx";
import { useState } from "react";
import { useModals } from "@/providers/ModalManagerProvider.tsx";
import { POST_MINT_NFT_MODAL } from "@/components/modals/PostMintNftModal.tsx";
import { TransactionReceipt } from "viem";
import { useReceivedInvitation } from "@/hooks/useReceivedInvitation.ts";
import { useContract } from "@/hooks/useContract.ts";
import { useWhitelistProof } from "@/hooks/useWhitelistProof.ts";

export const MintMemberNftMultichain = () => {
  const [toastId, setToastId] = useState<string | null>(null);

  const { open: openModal } = useModals();
  const { addToast, closeToast } = useToasts();
  const { chain, address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { data: member, refetch: refetchMember } = useClubMember();
  const { data: creditClub, refetch: refetchCreditClub } = useClubData();
  const { proof, isWhitelisted } = useWhitelistProof();
  const { data: invitation } = useReceivedInvitation({
    receiver: address,
  })

  const clubPluginContract = useContract("clubPlugin");
  const tokenContract = useContract("token");

  const { isMember } = member;
  const { costToMint } = creditClub;
  const createToast = useToastProps("mintMemberNFT", clubPluginContract.address, [address]);

  return (
    <TheBox
      className="MintMemberNftMultichain"
      actionType={ActionType.EvmFunction}
      paymentButtonText="Mint Member NFT"
      disableLoadingModals={true}
      chains={[ChainId.OPTIMISM, ChainId.BASE]}
      disableGuard={async () => {
        if (isWhitelisted) {
          return { disable: false, message: "" }
        }
        if (isMember) {
          return { disable: true, message: "Already a member" }
        }
        if (!invitation) {
          return { disable: true, message: "You are not invited" }
        }
        return { disable: false, message: "" }
      }}
      actionConfig={{
        chainId: chain && [ChainId.OPTIMISM, ChainId.BASE].includes(chain.id) ? chain.id : ChainId.BASE,
        contractAddress: clubPluginContract.address,
        cost: {
          amount: costToMint,
          isNative: false,
          tokenAddress: tokenContract.address,
        },
        signature: isWhitelisted ? 'function mintMemberNFT(address recipient, bytes32[] memory proof)' : 'function mintMemberNFT(address recipient)',
        args: isWhitelisted ? [address, proof] : [address],
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
