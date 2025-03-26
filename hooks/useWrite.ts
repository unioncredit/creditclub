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
  const { address: contract } = props;
  const config = useConfig();
  const createToast = useToastProps(functionName, contract, args);

  const { switchChainAsync } = useSwitchChain();
  const { connectWallet } = usePrivy();
  const { chain: connectedChain, isConnected } = useAccount();
  const { addToast, closeToast } = useToasts();

  const [loading, setLoading] = useState(false);

  const memoizedArgs = useMemo(() => args, [
    JSON.stringify(args, (_, value) => (typeof value === "bigint" ? value.toString() : value))
  ]);
  const memoizedProps = useMemo(() => props, [
    JSON.stringify(args, (_, value) => (typeof value === "bigint" ? value.toString() : value))
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
          throw "Did not connect to valid network";
        }
      }

      const hash = await writeContract(config, {
        ...memoizedProps,
        functionName,
        args: memoizedArgs,
        chainId: DEFAULT_CHAIN_ID,
        // @ts-ignore
        value,
      });

      // Replace current pending toast with a new pending toast
      // that links out to etherscan
      closeToast(toastId);
      toastId = addToast(createToast(ToastStatus.PENDING, hash), false);

      const { status } = await waitForTransactionReceipt(config, {
        hash,
      })

      onComplete && onComplete(hash);

      addToast(createToast(status === "success" ? ToastStatus.SUCCESS : ToastStatus.FAILED, hash));

      return true;
    } catch (e) {
      const error = e as WriteContractErrorType;
      const fallback = {
        title: "Error occurred",
        content: "Sorry, an unknown error occurred.",
      };

      console.log({ error });

      addToast({
        link: null,
        variant: ToastStatus.FAILED,
        id: `${ToastStatus.FAILED}__${functionName}__${Date.now()}`,
        ...(WagmiErrors[error.name] || fallback)
      });

      return false;
    } finally {
      setLoading(false);
      closeToast(toastId);
    }
  }, [memoizedProps, createToast, addToast, closeToast, config, functionName, memoizedArgs, value, onComplete]);

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
    [icon, disabled, loading, isConnected, onClick]
  );
}