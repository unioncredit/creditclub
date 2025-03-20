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

  useEffect(() => {
    onSwapPrepared && onSwapPrepared(data as BoxActionResponse | undefined);
  }, [data]);

  const { data: allowance = 0n, refetch: refetchAllowance, isLoading } = useReadContract({
    abi: erc20Abi,
    address: srcToken,
    functionName: "allowance",
    args: [address || zeroAddress, (data?.tx?.to || zeroAddress) as Address],
  });

  const transactionApproveProps = useWrite({
    abi: erc20Abi,
    address: srcToken,
    disabled: isLoading,
    functionName: "approve",
    args: [data?.tx?.to, amount],
    onComplete: async (_: string) => {
      refetchAllowance()
    },
  });

  return (
    <Button
      fluid
      className="mt-4 w-full"
      color="primary"
      size="large"
      {...props}
      {...(
        (srcToken !== zeroAddress && allowance < amount)
          ? {
            ...transactionApproveProps,
            label: "Approve token",
            loading: buttonProps.loading || transactionApproveProps.loading,
            disabled: buttonProps.disabled || transactionApproveProps.disabled,
          }
          : buttonProps
      )}
    />
  );
};