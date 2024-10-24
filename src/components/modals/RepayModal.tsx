import "./RepayModal.scss";

import { useAccount } from "wagmi";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  Text,
  OptionSelect,
  NumericalRows,
  RepayIcon,
  // @ts-ignore
} from "@unioncredit/ui";

import { useModals } from "@/providers/ModalManagerProvider.tsx";
import { useUnionMember } from "@/providers/UnionMemberProvider.tsx";
import { FormErrors } from "@/constants.ts";
import { format } from "@/utils/format.ts";
import { useForm } from "@/hooks/useForm.ts";
import { IFormField, IFormValues } from "@/hooks/useForm.types.ts";
import { IRepayOption, IRepayType } from "@/components/modals/RepayModal.types.ts";
import { ApprovalButton } from "@/components/shared/ApprovalButton.tsx";
import { daiContract, uTokenContract } from "@/contracts/optimism.ts";
import { useFirstPaymentDueDate } from "@/hooks/useFirstPaymentDueDate.ts";

export const REPAY_MODAL = "repay-modal";

const PaymentType: Record<string, IRepayType> = {
  MIN: "min",
  MAX: "max",
  BALANCE: "balance",
  CUSTOM: "custom",
};

export const RepayModal = () => {
  const [paymentType, setPaymentType] = useState<IRepayType>(PaymentType.MAX);

  const { close } = useModals();
  const { address } = useAccount();
  const { data: member, refetch: refetchMember } = useUnionMember();
  const firstPaymentDueDate = useFirstPaymentDueDate();

  const { owed, daiBalance, minPayment } = member;

  const validate = (inputs: IFormValues) => {
    const amount = inputs.amount as IFormField;

    if (amount.raw > daiBalance) {
      return FormErrors.INSUFFICIENT_BALANCE;
    }
  };

  const {
    values = {},
    errors = {},
    empty,
    setRawValue,
    setNumber,
    isErrored,
  } = useForm({ validate });

  const handleSelect = (option: IRepayOption) => {
    setPaymentType(option.paymentType);
    setRawValue("amount", option.amount ?? 0n);
  };

  const amount = values.amount as IFormField || empty;
  const newOwed = owed - amount.raw;

  // Factor in a 0.005% margin for the max repay as we can no longer use MaxUint256.
  // If 0.005% of the balance owed is less than 0.01 we default to 0.01
  const margin = owed / 50000n;
  const minMargin = BigInt("10000000000000000");
  const owedBalanceWithMargin = owed + (margin < minMargin ? minMargin : margin);

  // The maximum amount the user can repay, either their total DAI balance
  // or their balance owed + 0.005% margin
  const maxRepay = daiBalance >= owedBalanceWithMargin ? owedBalanceWithMargin : daiBalance;

  const options: IRepayOption[] = [
    {
      token: "dai",
      value: format(owed),
      amount: owedBalanceWithMargin,
      paymentType: PaymentType.MAX,
      title: "Full balance",
      content: paymentType === PaymentType.MAX && "Pay-off your outstanding balance in its entirety",
    },
    {
      token: "dai",
      value: format(maxRepay, 2, false),
      amount: maxRepay,
      paymentType: PaymentType.BALANCE,
      title: "Wallet balance",
      content: paymentType === PaymentType.BALANCE && "The maximum amount available in your wallet",
    },
    {
      value: format(minPayment),
      amount: minPayment,
      token: "dai",
      paymentType: PaymentType.MIN,
      title: "Minimum due",
      content: paymentType === PaymentType.MIN && "Minimum required to cover the interest due on your loan",
    },
    {
      value: "",
      token: "dai",
      paymentType: PaymentType.CUSTOM,
      title: "Custom amount",
      content: paymentType === PaymentType.CUSTOM && "Enter a custom amount you wish to repay",
      inputProps: {
        w: "150px",
        type: "number",
        placeholder: "0.00",
        value: amount.display,
        inputProps: {
          ref: (input: any) => input && input.focus()
        },
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          setNumber("amount", e.target.value, "display", false);
        }
      }
    }
  ];

  useEffect(() => {
    handleSelect(options[0]);
  }, []);

  /*--------------------------------------------------------------
    Render Component
   --------------------------------------------------------------*/

  return (
    <ModalOverlay onClick={close}>
      <Modal className="RepayModal">
        <Modal.Header title="Make a payment" onClose={close} />
        <Modal.Body>
          {owed > 0n ? (
            <>
              <OptionSelect cards={options} onChange={(index: number) => handleSelect(options[index])} />

              {/*--------------------------------------------------------------
                Stats After
                *--------------------------------------------------------------*/}
              <NumericalRows
                m="24px 0"
                items={[
                  {
                    label: "Wallet balance",
                    value: `${format(daiBalance, 2, false)} DAI`,
                    error: errors.amount === FormErrors.INSUFFICIENT_BALANCE,
                    tooltip: {
                      content: "How much DAI you have in your connected wallet",
                    },
                  },
                  {
                    label: "Next payment due",
                    value: amount.raw <= 0n && owed <= 0n
                      ? "N/A"
                      : `${format(minPayment)} DAI · ${firstPaymentDueDate}`,
                  },
                  {
                    label: "New balance owed",
                    value: `${format(newOwed < 0n ? 0n : newOwed)} DAI`,
                    tooltip: {
                      content:
                        "The total amount you will owe if this payment transaction is successful",
                    },
                  },
                ]}
              />

              {/*--------------------------------------------------------------
                Button
                *--------------------------------------------------------------*/}
              <ApprovalButton
                disabled={owed <= 0n}
                owner={address}
                amount={amount.raw}
                spender={uTokenContract.address}
                tokenContract={daiContract}
                actionProps={{
                  ...uTokenContract,
                  size: "large",
                  args: [address, amount.raw],
                  disabled: amount.raw > daiBalance,
                  enabled: !isErrored,
                  functionName: "repayBorrow",
                  label: amount.raw > daiBalance
                    ? "Not enough wallet balance"
                    : `Repay ${amount.display} DAI`,
                  icon: amount.raw > daiBalance
                    ? false
                    : RepayIcon,
                  onComplete: async () => {
                    await refetchMember();
                    close();
                  },
                }}
              />
            </>
          ) : (
            <>
              <Box h="80px" align="center" justify="center">
                <Text grey={500} m="0" size="medium">
                  You have nothing to repay.
                </Text>
              </Box>

              <Button
                fluid
                mt="16px"
                size="large"
                label="Close"
                color="secondary"
                variant="light"
                onClick={close}
              />
            </>
          )}
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
