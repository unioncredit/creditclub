import { DEFAULT_CHAIN_ID, ToastStatus, WagmiErrors } from "@/constants";
import { useCallback, useMemo, useState } from "react";
import { useToasts } from "@/providers/ToastsProvider";
import { useToastProps } from "@/hooks/useToastProps";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { useAccount, useConfig, useSwitchChain } from "wagmi";
import { WriteContractErrorType } from "viem";
import { usePrivy } from "@privy-io/react-auth";

export const useWrite = ({
  functionName,
  args = [],
  disabled = false,
  onComplete = undefined,
  value = undefined,
  icon = undefined,
  ...props
}: {
  functionName: string;
  args?: any[];
  disabled?: boolean;
  onComplete?: (hash: string) => Promise<void>;
  value?: bigint;
  icon?: string;
  [_: string]: any;
}) => {
  const config = useConfig();
  const { switchChainAsync } = useSwitchChain();
  const { connectWallet } = usePrivy();
  const { chain: connectedChain, isConnected } = useAccount();
  const { addToast, closeToast } = useToasts();

  const [loading, setLoading] = useState(false);

  // Don't stringify the entire props object - extract what we need
  const { abi, address: contractAddress, ...otherProps } = props;
  
  const createToast = useToastProps(functionName, contractAddress, args);

  const memoizedArgs = useMemo(() => args, [
    JSON.stringify(args, (_, value) => (typeof value === "bigint" ? value.toString() : value))
  ]);
  
  const memoizedProps = useMemo(() => ({
    abi,
    address: contractAddress,
    ...otherProps
  }), [
    // Use a stable reference for ABI (array reference comparison)
    abi,
    contractAddress,
    // Only stringify the other props (without abi)
    JSON.stringify(otherProps, (_, value) => (typeof value === "bigint" ? value.toString() : value))
  ]);

  /**
   * onClick is just the name of the action function for this
   * write. When fired the action defined by the hook inputs
   * will be executed.
   */
  const onClick = useCallback(async () => {
    setLoading(true);

    let toastId = addToast(createToast(ToastStatus.PENDING), false);

    try {
      if (connectedChain?.id !== DEFAULT_CHAIN_ID) {
        const result = await switchChainAsync({ chainId: DEFAULT_CHAIN_ID });
        if (result.id !== DEFAULT_CHAIN_ID) {
          throw new Error("Failed to switch to the correct network");
        }
      }

      const hash = await writeContract(config, {
        functionName,
        args: memoizedArgs,
        chainId: DEFAULT_CHAIN_ID,
        // @ts-ignore
        value,
        ...memoizedProps,
      });

      // Replace current pending toast with a new pending toast
      // that links out to etherscan
      closeToast(toastId);
      toastId = addToast(createToast(ToastStatus.PENDING, hash), false);

      const { status } = await waitForTransactionReceipt(config, {
        hash,
        timeout: 60_000, // 60 second timeout
      });

      if (onComplete) {
        await onComplete(hash);
      }

      addToast(createToast(status === "success" ? ToastStatus.SUCCESS : ToastStatus.FAILED, hash));

      return true;
    } catch (e) {
      const error = e as WriteContractErrorType;
      console.error("Transaction error:", error);

      let errorMessage = {
        title: "Transaction failed",
        content: "Please try again",
      };

      // Handle specific error types
      if ((error as any).name === "UserRejectedRequestError" || error.message?.includes("User rejected")) {
        errorMessage = {
          title: "Transaction cancelled",
          content: "You cancelled the transaction",
        };
      } else if ((error as any).name === "TransactionExecutionError") {
        errorMessage = {
          title: "Transaction failed",
          content: "The transaction was reverted. Please check your balance and try again.",
        };
      } else if (error.cause && typeof error.cause === 'object' && 'reason' in error.cause) {
        const reason = (error.cause as any).reason;
        if (reason?.includes("insufficient")) {
          errorMessage = {
            title: "Insufficient balance",
            content: "You don't have enough balance for this transaction",
          };
        } else if (reason?.includes("allowance")) {
          errorMessage = {
            title: "Approval required",
            content: "Please approve the token spending first",
          };
        }
      } else if (error.message?.includes("User rejected")) {
        errorMessage = {
          title: "Transaction cancelled",
          content: "You cancelled the transaction",
        };
      }

      addToast({
        link: null,
        variant: ToastStatus.FAILED,
        id: `${ToastStatus.FAILED}__${functionName}__${Date.now()}`,
        ...(WagmiErrors[error.name] || errorMessage)
      });

      return false;
    } finally {
      setLoading(false);
      closeToast(toastId);
    }
  }, [memoizedProps, createToast, addToast, closeToast, config, functionName, memoizedArgs, value, onComplete, connectedChain, switchChainAsync]);

  /*--------------------------------------------------------------
    Return
   --------------------------------------------------------------*/

  return useMemo(
    () => ({
      disabled: disabled || loading,
      loading,
      ...(!isConnected ? {
        icon: undefined,
        label : "Connect Wallet",
        onClick: connectWallet,
      } : {
        icon,
        onClick,
      })
    }),
    [icon, disabled, loading, isConnected, onClick, connectWallet]
  );
}