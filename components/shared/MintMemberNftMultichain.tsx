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
import { useClubContacts } from "@/hooks/useClubContacts";
import { StatGridRow } from "@/components/shared/StatGrid";
import { useClubMemberNft } from "@/hooks/useClubMemberNft";
import { useNewMemberData } from "@/hooks/useNewMemberData";

export const MintMemberNftMultichain = ({
  clubAddress,
  rows,
}: {
  clubAddress: Address;
  rows: StatGridRow[];
}) => {
  const [toastId, setToastId] = useState<string | null>(null);

  const { open: openModal } = useModals();
  const { addToast, closeToast } = useToasts();
  const { address } = useAccount();
  const { connectWallet } = usePrivy();
  const { refetch: refetchClubContacts } = useClubContacts(clubAddress);
  const { data: clubMember, refetch: refetchClubMember } = useClubMember(address, clubAddress);
  const { data: clubData, refetch: refetchClubData } = useClubData(clubAddress);
  const { data: isQualified } = useIsQualified(clubAddress);
  const { data: clubMemberNftData } = useClubMemberNft(clubAddress);
  const { data: newMemberData } = useNewMemberData(address, clubAddress);

  const creditVaultContract = useCreditVaultContract(clubAddress);
  const tokenContract = useContract("token");

  const { isMember } = clubMember;
  const { name, image, memberNftAddress, isActivated } = clubData;
  const { membershipCost } = clubMemberNftData;
  const { initialTrustAmount, tokenId } = newMemberData;

  const createToast = useToastProps("mintMemberNFT", creditVaultContract.address, [address]);

  return (
    <TheBox
      className="MintMemberNftMultichain"
      actionType={ActionType.EvmFunction}
      paymentButtonText="Mint Member NFT"
      disableLoadingModals={true}
      chains={[ChainId.OPTIMISM, ChainId.BASE]}
      disableGuard={async () => {
        if (!isActivated) {
          return { disable: true, message: "Club not activated" }
        }
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
        contractAddress: memberNftAddress,
        cost: {
          amount: membershipCost,
          isNative: false,
          tokenAddress: tokenContract.address,
        },
        signature: "function mint(address guy)",
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

        refetchClubData();
        refetchClubMember();
        refetchClubContacts();

        openModal(POST_MINT_NFT_MODAL, {
          clubName: name,
          tokenId,
          rows,
          startingCredit: initialTrustAmount,
          nftImageUrl: image,
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
