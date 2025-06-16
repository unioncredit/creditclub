import { TheBox } from "@decent.xyz/the-box";
import { ActionType, ChainId } from "@decent.xyz/box-common";
import { Address, TransactionReceipt } from "viem";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount, useReadContract } from "wagmi";
import { useState, useEffect, useRef } from "react";

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
  const [isWaitingForApproval, setIsWaitingForApproval] = useState(false);
  const [hasShownApprovalToast, setHasShownApprovalToast] = useState(false);
  const previousAllowanceRef = useRef<bigint>(0n);

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

  // Monitor token allowance for approval detection
  const { data: currentAllowance = 0n } = useReadContract({
    ...tokenContract,
    functionName: "allowance",
    args: [address, memberNftAddress],
    query: {
      enabled: !!address && !!memberNftAddress,
      refetchOnWindowFocus: false,
      refetchInterval: isWaitingForApproval ? 2000 : false, // Poll when waiting for approval
    }
  }) as { data: bigint };

  const needsApproval = membershipCost > currentAllowance;

  // Create toast functions
  const createApprovalToast = useToastProps("approve", tokenContract.address, [address]);
  const createMintToast = useToastProps("mintMemberNFT", creditVaultContract.address, [address]);

  // Add trust console logging for mint process
  console.log("Mint Process - Trust Data:", {
    initialTrustAmount: initialTrustAmount.toString(),
    tokenId: tokenId.toString(),
    membershipCost: membershipCost.toString(),
    clubAddress,
    userAddress: address,
    needsApproval,
    currentAllowance: currentAllowance.toString(),
    isWaitingForApproval,
  });

  // Monitor allowance changes to detect approval completion
  useEffect(() => {
    const previousAllowance = previousAllowanceRef.current;
    
    if (isWaitingForApproval && previousAllowance < membershipCost && currentAllowance >= membershipCost) {
      // Approval just completed!
      console.log("Approval detected:", {
        previousAllowance: previousAllowance.toString(),
        currentAllowance: currentAllowance.toString(),
        membershipCost: membershipCost.toString()
      });
      
      setIsWaitingForApproval(false);
      if (toastId) {
        closeToast(toastId);
        setToastId(addToast(createApprovalToast(ToastStatus.SUCCESS), false));
      }
    }
    
    previousAllowanceRef.current = currentAllowance;
  }, [currentAllowance, membershipCost, isWaitingForApproval, toastId, closeToast, addToast, createApprovalToast]);

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
        if (needsApproval && !hasShownApprovalToast) {
          // This is the approval transaction
          console.log("Approval transaction pending");
          setIsWaitingForApproval(true);
          setHasShownApprovalToast(true);
          setToastId(addToast(createApprovalToast(ToastStatus.PENDING), false));
        } else {
          // This is the mint transaction
          console.log("Mint transaction pending");
          if (toastId) {
            closeToast(toastId);
          }
          setToastId(addToast(createMintToast(ToastStatus.PENDING), false));
        }
      }}
      // @ts-ignore
      onTxReceipt={(r: TransactionReceipt) => {
        console.log("Transaction Receipt:", {
          startingCredit: initialTrustAmount.toString(),
          tokenId: tokenId.toString(),
          transactionHash: r.transactionHash,
          clubName: name,
          needsApproval,
          isWaitingForApproval
        });

        if (!isWaitingForApproval) {
          // This is the mint transaction completion
          if (toastId) {
            closeToast(toastId);
          }
          setToastId(addToast(createMintToast(ToastStatus.SUCCESS), false));

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

          // Reset approval state for next time
          setHasShownApprovalToast(false);
        }
        // If isWaitingForApproval is true, the approval completion will be handled by the useEffect
      }}
      onTxError={() => {
        if (toastId) {
          closeToast(toastId);
        }
        
        if (isWaitingForApproval) {
          setIsWaitingForApproval(false);
          setHasShownApprovalToast(false);
          setToastId(addToast(createApprovalToast(ToastStatus.FAILED), true));
        } else {
          setToastId(addToast(createMintToast(ToastStatus.FAILED), true));
        }
      }}
      wagmiConfig={wagmiConfig}
      onConnectWallet={connectWallet}
      apiKey={process.env.NEXT_PUBLIC_DECENT_API_KEY!}
    />
  );
};
