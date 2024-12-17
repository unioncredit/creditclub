import { ToastStatus } from "@/constants";
import { IToast, IToastStatus } from "@/providers/types.ts";
import { useCallback } from "react";
import { Address } from "viem";
import { useContract } from "@/hooks/useContract.ts";
import { useToken } from "@/hooks/useToken.ts";

export const useToastProps = (functionName: string, contract: Address, args: any) => {
  const { token } = useToken();

  const unionContract = useContract("union");

  return useCallback((status: IToastStatus, txHash?: string | undefined): IToast => {
    const props = {
      link: txHash ? `https://optimistic.etherscan.io/tx/${txHash}` : null,
      variant: status,
      id: `${status}__${functionName}__${Date.now()}`,
      args,
    };

    if (status === ToastStatus.PENDING) {
      /*--------------------------------------------------------------
        Pending transactions
      --------------------------------------------------------------*/
      switch (functionName) {
        case "approve":
          return {
            ...props,
            title: `Approving ${contract === unionContract.address
              ? "UNION"
              : token}`,
            content: "Transaction pending",
          };
        case "feelingLucky":
          return {
            ...props,
            title: "Raffle Distribution",
            content: "Transaction pending",
          };
        case "fixedBid":
          return {
            ...props,
            title: `Bidding ${token}`,
            content: "Transaction pending",
          };
        case "mintMemberNFT":
          return {
            ...props,
            title: "Minting Member NFT",
            content: "Transaction pending",
          };
        default:
          return {
            ...props,
            content: "Transaction pending",
            title: "Pending",
          };
      }
    } else if (status === ToastStatus.SUCCESS) {
      /*--------------------------------------------------------------
        Successful transactions
      --------------------------------------------------------------*/

      switch (functionName) {
        case "approve":
          return {
            ...props,
            title: `Approved ${contract === unionContract.address
              ? "UNION"
              : token}`,
            content: "Transaction successful",
          };
        case "feelingLucky":
          return {
            ...props,
            title: "Raffle Distribution",
            content: "Transaction successful",
          };
        case "fixedBid":
          return {
            ...props,
            title: `Bidding ${token}`,
            content: "Transaction successful",
          };
        case "mintMemberNFT":
          return {
            ...props,
            title: "Minting Member NFT",
            content: "Transaction successful",
          };
        default:
          return {
            ...props,
            content: "Transaction successful",
            title: "Success",
          };
      }
    } else {
      /*--------------------------------------------------------------
        Failed transactions
      --------------------------------------------------------------*/

      switch (functionName) {
        case "approve":
          return {
            ...props,
            title: `Approving ${contract === unionContract.address
              ? "UNION"
              : token}`,
            content: "Transaction failed",
          };
        case "feelingLucky":
          return {
            ...props,
            title: "Raffle Distribution",
            content: "Transaction failed",
          };
        case "fixedBid":
          return {
            ...props,
            title: `Bidding ${token}`,
            content: "Transaction failed",
          };
        case "mintMemberNFT":
          return {
            ...props,
            title: "Minting Member NFT",
            content: "Transaction failed",
          };
        default:
          return {
            ...props,
            content: "Transaction failed",
            title: "Failed",
          };
      }
    }
  }, [functionName]);
};
