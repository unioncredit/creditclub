import { ToastStatus, WagmiErrors } from "@/constants";
import { useCallback, useMemo, useState } from "react";
import { useToasts } from "@/providers/ToastsProvider.tsx";
import { useToastProps } from "@/hooks/useToastProps.ts";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { useAccount, useConfig } from "wagmi";
import { WriteContractErrorType } from "viem";

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

  const { isConnected } = useAccount();
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
      const hash = await writeContract(config, {
        ...memoizedProps,
        functionName,
        args: memoizedArgs,

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

      onComplete && (await onComplete(hash));

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
      disabled: disabled || loading || !isConnected,
      loading,
      onClick,
      icon,
    }),
    [icon, disabled, loading, isConnected, onClick]
  );
}