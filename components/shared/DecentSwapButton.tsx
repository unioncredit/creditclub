// @ts-ignore
import { Button } from "@unioncredit/ui";

import { useDecentSwap } from "@/hooks/useDecentSwap";
import { ActionType, BoxActionResponse, ChainId, SwapDirection } from "@decent.xyz/box-common";
import { Address, erc20Abi, Hash, zeroAddress } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { useEffect } from "react";
import { useWrite } from "@/hooks/useWrite";

export const DecentSwapButton = ({
  amount,
  srcToken,
  srcChainId,
  dstToken,
  dstChainId,
  onComplete,
  onSwapPrepared,
  ...props
}: {
  amount: bigint;
  srcToken: Address;
  srcChainId: ChainId;
  dstToken: Address;
  dstChainId: ChainId;
  onComplete?: (hash: Hash) => Promise<void>;
  onSwapPrepared?: (x: BoxActionResponse | undefined) => void;
  [_: string]: any;
}) => {
  const { address } = useAccount();
  const { buttonProps, data } = useDecentSwap({
    onComplete,
    config: {
      actionType: ActionType.SwapAction,
      sender: address as Address,
      srcToken,
      dstToken,
      slippage: 1, // 1%, Note: cannot be 0
      // @ts-ignore
      srcChainId,
      // @ts-ignore
      dstChainId,
      // @ts-ignore
      actionConfig: {
        amount: amount,
        swapDirection: SwapDirection.EXACT_AMOUNT_IN,
        receiverAddress: address,
      },
    }
  });



  const { data: allowance = 0n, refetch: refetchAllowance, isLoading } = useReadContract({
    abi: erc20Abi,
    address: srcToken,
    functionName: "allowance",
    args: [address || zeroAddress, (data?.tx?.to || zeroAddress) as Address],
    query: {
      enabled: !!address && !!data?.tx?.to && srcToken !== zeroAddress,
      refetchOnWindowFocus: false,
    }
  });

  // Get token balance to check if user has sufficient funds
  const { data: tokenBalance = 0n } = useReadContract({
    abi: erc20Abi,
    address: srcToken,
    functionName: "balanceOf",
    args: [address || zeroAddress],
    query: {
      enabled: !!address && srcToken !== zeroAddress,
      refetchOnWindowFocus: false,
    }
  });

  const transactionApproveProps = useWrite({
    abi: erc20Abi,
    address: srcToken,
    disabled: isLoading || !data?.tx?.to,
    functionName: "approve",
    args: [data?.tx?.to, amount],
    onComplete: async (_: string) => {
      try {
        // Add a small delay before refetching to ensure blockchain state is updated
        await new Promise(resolve => setTimeout(resolve, 1000));
        await refetchAllowance();
      } catch (error) {
        // Silently handle error during polling
      }
    },
  });

  // Check if approval is needed
  const needsApproval = srcToken !== zeroAddress && 
                        data?.tx?.to && 
                        allowance < amount && 
                        amount > 0n;



  // Enhanced button props with better error handling
  const enhancedButtonProps = {
    ...buttonProps,
    disabled: buttonProps.disabled || 
              (srcToken !== zeroAddress && tokenBalance < amount) ||
              (amount <= 0n),
    label: srcToken !== zeroAddress && tokenBalance < amount 
      ? "Insufficient balance"
      : amount <= 0n
        ? "Enter an amount"
        : (buttonProps as any).label || "Buy Tokens",
  };

  return (
    <Button
      fluid
      className="mt-4 w-full"
      color="primary"
      size="large"
      {...props}
      {...(
        needsApproval
          ? {
            ...transactionApproveProps,
            label: "Approve token",
            loading: buttonProps.loading || transactionApproveProps.loading,
            disabled: buttonProps.disabled || transactionApproveProps.disabled || tokenBalance < amount,
          }
          : enhancedButtonProps
      )}
    />
  );
};