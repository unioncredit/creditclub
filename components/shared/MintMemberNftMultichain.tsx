import { TheBox } from "@decent.xyz/the-box";
import { ActionType, ChainId } from "@decent.xyz/box-common";
import { Address, TransactionReceipt } from "viem";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount } from "wagmi";
import { useState } from "react";

import { config as wagmiConfig } from "@/providers/Web3Provider";
import { useToastProps } from "@/hooks/useToastProps";
import { ToastStatus } from "@/constants";
import { useToasts } from "@/providers/ToastsProvider";
import { useModals } from "@/providers/ModalManagerProvider";
import { POST_MINT_NFT_MODAL } from "@/components/modals/PostMintNftModal";
import { useContract } from "@/hooks/useContract";
import { useClubMember } from "@/hooks/useClubMember";
import { useClubData } from "@/hooks/useClubData";
import { useCreditVaultContract } from "@/hooks/useCreditVaultContract";
import { useIsQualified } from "@/hooks/useIsQualified";

export const MintMemberNftMultichain = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const [toastId, setToastId] = useState<string | null>(null);

  const { open: openModal } = useModals();
  const { addToast, closeToast } = useToasts();
  const { address } = useAccount();
  const { connectWallet } = usePrivy();
  const { data: clubMember, refetch: refetchMember } = useClubMember(address, clubAddress);
  const { data: clubData, refetch: refetchCreditClub } = useClubData(clubAddress);
  const { data: isQualified } = useIsQualified(clubAddress);

  const creditVaultContract = useCreditVaultContract(clubAddress);
  const tokenContract = useContract("token");

  const { isMember } = clubMember;
  const { costToMint } = clubData;
  const createToast = useToastProps("mintMemberNFT", creditVaultContract.address, [address]);

  return (
    <TheBox
      className="MintMemberNftMultichain"
      actionType={ActionType.EvmFunction}
      paymentButtonText="Mint Member NFT"
      disableLoadingModals={true}
      chains={[ChainId.OPTIMISM, ChainId.BASE]}
      disableGuard={async () => {
        if (isMember) {
          return { disable: true, message: "Already a member" }
        }
        if (!isQualified) {
          return { disable: true, message: "You are not qualified" }
        }
        return { disable: false, message: "" }
      }}
      actionConfig={{
        chainId: ChainId.BASE,
        contractAddress: creditVaultContract.address,
        cost: {
          amount: costToMint,
          isNative: false,
          tokenAddress: tokenContract.address,
        },
        signature: "function mintMemberNFT(address recipient)",
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
      onConnectWallet={connectWallet}
      apiKey={process.env.NEXT_PUBLIC_DECENT_API_KEY!}
    />
  );
};
