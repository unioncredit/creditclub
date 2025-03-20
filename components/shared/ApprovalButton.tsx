import { useAccount, useReadContract } from "wagmi";
import { useCallback, useEffect, useState } from "react";
import { Address, maxUint256 } from "viem";

// @ts-ignore
import { Button, MultiStepButton } from "@unioncredit/ui";

import { useWrite } from "@/hooks/useWrite";
import { MultiStep } from "@/constants";
import { usePrivy } from "@privy-io/react-auth";

const initialItems = [{ number: 1, status: MultiStep.SELECTED }, { number: 2 }];
const initialButtonProps = { label: "Enter an amount", disabled: true, loading: false };

export const ApprovalButton = ({
  owner,
  amount,
  spender,
  tokenContract,
  actionProps,
  requireApproval = true,
  disabled = false,
}: {
  owner: Address | undefined;
  amount: bigint;
  spender: Address;
  tokenContract: any;
  actionProps: any;
  requireApproval?: boolean;
  disabled?: boolean;
}) => {
  const [items, setItems] = useState(initialItems);
  const [action, setAction] = useState(initialButtonProps);
  const [showSteps, setShowSteps] = useState(false);

  const { isConnected } = useAccount();
  const { connectWallet } = usePrivy();

  /*--------------------------------------------------------------
    Contract Functions
   --------------------------------------------------------------*/

  const { data: allowance = 0n, refetch: refetchAllowance, isLoading } = useReadContract({
    ...tokenContract,
    functionName: "allowance",
    args: [owner, spender],
  });

  const transactionApproveProps = useWrite({
    ...tokenContract,
    disabled,
    functionName: "approve",
    args: [spender, maxUint256],
    onComplete: useCallback(() => {
      refetchAllowance();
    }, [refetchAllowance]),
  });

  const txButtonProps = useWrite({
    disabled,
    ...actionProps,
  });

  /**
   * Handle setting the action props based on the amount
   * and the allowance
   */
  useEffect(() => {
    if (amount > 0n) {
      if (requireApproval && (!isLoading && amount > (allowance as bigint))) {
        // The amount is more than the allowance so we
        // need to prompt the user to approve this contract
        setAction({
          label: transactionApproveProps.loading ? `Approving token...` : `Approve token`,
          ...transactionApproveProps,
          loading: false,
          disabled: transactionApproveProps.loading || disabled,
        });

        setShowSteps(true);
      } else {
        // The user has an allowance that covers this amount
        // so we can skip straight to the action
        setAction({ label: actionProps.label, ...txButtonProps });
      }
    } else {
      // Display an initial state while we wait for the user input
      setAction(initialButtonProps);
    }
  }, [amount, transactionApproveProps, txButtonProps, requireApproval, allowance, actionProps.label, isLoading]);

  /**
   * Handle setting the items props for the multi step button based
   * on the loading states of each transaction
   */
  useEffect(() => {
    if (transactionApproveProps.loading) {
      // Approval is loading
      setItems([{ number: 1, status: MultiStep.PENDING }, { number: 2 }]);
    } else if (txButtonProps.loading) {
      // Transaction is loading
      setItems([
        { number: 1, status: MultiStep.COMPLETE },
        { number: 2, status: MultiStep.PENDING },
      ]);
    } else if ((allowance as bigint) >= amount) {
      // Allowance has been complete
      setItems([
        { number: 1, status: MultiStep.COMPLETE },
        { number: 2, status: MultiStep.SELECTED },
      ]);
    } else {
      // Return to normal state
      setItems(initialItems);
    }
  }, [
    allowance,
    amount,
    transactionApproveProps.loading,
    txButtonProps.loading,
  ]);

  /*--------------------------------------------------------------
    Render Component
   --------------------------------------------------------------*/

  return isConnected ? (
    <MultiStepButton
      id="approval-component"
      items={items}
      action={action}
      showSteps={requireApproval && showSteps}
    />
  ) : (
    <Button
      fluid
      color="primary"
      size="large"
      onClick={connectWallet}
    >
      {isConnected ? "Disconnect" : "Connect wallet"}
    </Button>
  )
};
