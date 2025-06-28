import { sendTransaction } from "@wagmi/core";
import { useAccount, useConfig, useSwitchChain } from "wagmi";
import { Address, Hash, WriteContractErrorType } from "viem";
import { usePrivy } from "@privy-io/react-auth";
import { useBoxAction, type UseBoxActionArgs, useDecentScan } from "@decent.xyz/box-hooks";
import { EvmTransaction } from "@decent.xyz/box-common";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ToastStatus, WagmiErrors } from "@/constants";
import { useToasts } from "@/providers/ToastsProvider";
import { useToastProps } from "@/hooks/useToastProps";

export const useDecentSwap = ({
  config,
  icon,
  disabled,
  onComplete,
}: {
  config: UseBoxActionArgs;
  icon?: string;
  disabled?: boolean;
  onComplete?: (hash: Hash) => Promise<void>;
}) => {
  const [loading, setLoading] = useState(false);
  const [hash, setHash] = useState<Hash | undefined>(undefined);
  const [toastId, setToastId] = useState<string | undefined>(undefined);

  const wagmiConfig = useConfig();
  const { switchChainAsync } = useSwitchChain();
  const { connectWallet } = usePrivy();
  const { chain: connectedChain, isConnected } = useAccount();
  const { addToast, closeToast } = useToasts();
  const { actionResponse, isLoading: boxActionLoading } = useBoxAction(config);
  const { data, isLoading: decentScanLoading } = useDecentScan({
    txHash: hash,
    chainId: config.srcChainId,
  });

  const createToast = useToastProps("decentSwap", config.dstToken as Address, null);
  const tx = actionResponse?.tx as EvmTransaction;

  const isLoading = loading || boxActionLoading || decentScanLoading;

  const reset = () => {
    setHash(undefined);
    setLoading(false);

    if (toastId) {
      closeToast(toastId);
      setToastId(undefined);
    }
  };

  useEffect(() => {
    if (data?.status === "Executed" || (data as any)?.tx?.statusMessage === "success") {
      if (hash) {
        onComplete && onComplete(hash);
        addToast(createToast(ToastStatus.SUCCESS, hash));
      }

      reset();
    }
  }, [data, reset]);

  /**
   * onClick is just the name of the action function for this
   * write. When fired the action defined by the hook inputs
   * will be executed.
   */
  const onClick = useCallback(async () => {
    if (loading) return;

    let tid = addToast(createToast(ToastStatus.PENDING), false);

    setLoading(true);
    setToastId(tid);

    try {
      if (connectedChain?.id !== config.srcChainId) {
        const result = await switchChainAsync({ chainId: config.srcChainId });
        if (result.id !== config.srcChainId) {
          throw "Did not connect to valid network";
        }
      }

      const hash = await sendTransaction(wagmiConfig, {
        ...tx,
      });

      // Replace current pending toast with a new pending toast
      // that links out to etherscan
      closeToast(tid);
      setToastId(addToast(createToast(ToastStatus.PENDING, hash), false));
      setHash(hash);
      return true;
    } catch (e) {
      const error = e as WriteContractErrorType;
      const fallback = {
        title: "Error occurred",
        content: "Sorry, an unknown error occurred.",
      };

      addToast({
        link: null,
        variant: ToastStatus.FAILED,
        id: `${ToastStatus.FAILED}__decentSwap__${Date.now()}`,
        ...(WagmiErrors[error.name] || fallback)
      });

      return false;
    }
  }, [createToast, addToast, closeToast, config]);

  const buttonProps = useMemo(
    () => ({
      disabled: disabled || isLoading,
      loading: isLoading,
      ...(!isConnected ? {
        icon: undefined,
        label : "Connect Wallet",
        onClick: connectWallet,
      } : {
        icon,
        onClick,
      })
    }),
    [icon, disabled, isLoading, isConnected, onClick]
  );

  return {
    data: actionResponse,
    buttonProps,
  }
}