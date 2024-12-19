import { useAccount } from "wagmi";
import {
  Box,
  Button,
  Usdc,
  Grid,
  Input,
  Modal,
  ModalOverlay,
  NumericalBlock,
  BorrowIcon,
  NumericalRows,
  // @ts-ignore
} from "@unioncredit/ui";
import { useModals } from "@/providers/ModalManagerProvider.tsx";
import { format } from "@/utils/format.ts";
import { useWrite } from "@/hooks/useWrite.ts";
import { useUnionData } from "@/providers/UnionDataProvider.tsx";
import { useUnionMember } from "@/providers/UnionMemberProvider.tsx";
import { FormErrors, TOKENS, WAD } from "@/constants.ts";
import { useForm } from "@/hooks/useForm.ts";
import { IFormField, IFormValues } from "@/hooks/useForm.types.ts";
import { useFirstPaymentDueDate } from "@/hooks/useFirstPaymentDueDate.ts";
import { calculateExpectedMinimumPayment, calculateInterestRate, calculateMaxBorrow } from "@/utils/numbers.ts";
import { useContract } from "@/hooks/useContract.ts";
import { useToken } from "@/hooks/useToken.ts";

export const BORROW_MODAL = "borrow-modal";

export const BorrowModal = () => {
  const { close } = useModals();
  const { address } = useAccount();
  const { token } = useToken();
  const { data: member, refetch: refetchMember } = useUnionMember();
  const { data: protocol } = useUnionData();
  const firstPaymentDueDate = useFirstPaymentDueDate();

  const uTokenContract = useContract("uToken");

  const {
    owed,
    minBorrow,
    creditLimit,
    originationFee,
    overdueTime,
    borrowRatePerSecond,
    getLoanableAmount,
  } = { ...member, ...protocol };

  const validate = (inputs: IFormValues) => {
    const amount = inputs.amount as IFormField;

    if (member.isOverdue) {
      return FormErrors.IS_OVERDUE;
    } else if (amount.raw > creditLimit) {
      return FormErrors.INSUFFICIENT_CREDIT_LIMIT;
    } else if (amount.raw < minBorrow) {
      return FormErrors.MIN_BORROW(format(minBorrow, token));
    } else if (amount.raw > getLoanableAmount) {
      return FormErrors.INSUFFICIENT_FUNDS;
    }
  };

  const {
    register,
    setRawValue,
    values = {},
    errors = {},
    empty
  } = useForm({ validate });

  const amount = values.amount as IFormField || empty;

  const maxBorrow = calculateMaxBorrow(creditLimit, originationFee);

  const fee = amount.raw * originationFee / WAD[TOKENS.DAI];

  const borrow = amount.raw + fee;

  const newOwed = borrow + owed;

  const minPayment = calculateExpectedMinimumPayment(borrow, borrowRatePerSecond, overdueTime, token);

  const buttonProps = useWrite({
    ...uTokenContract,
    functionName: "borrow",
    args: [address, amount.raw],
    disabled: amount.raw <= 0n || !!errors.amount,
    onComplete: async () => {
      await refetchMember();
      close();
    },
  });

  /*--------------------------------------------------------------
    Render Component
   --------------------------------------------------------------*/

  return (
    <ModalOverlay onClick={close}>
      <Modal className="BorrowModal">
        <Modal.Header title={`Borrow ${token}`} onClose={close} />
        <Modal.Body>
          {/*--------------------------------------------------------------
            Stats Before
          *--------------------------------------------------------------*/}
          <Grid>
            <Grid.Row>
              <Grid.Col>
                <NumericalBlock
                  token="usdc"
                  size="regular"
                  title="Available to borrow"
                  value={format(creditLimit, token, 2, false)}
                />
              </Grid.Col>
              <Grid.Col>
                <NumericalBlock
                  token="usdc"
                  size="regular"
                  title="Balance owed"
                  value={format(owed, token)}
                />
              </Grid.Col>
            </Grid.Row>
          </Grid>
          {/*--------------------------------------------------------------
            Input
          *--------------------------------------------------------------*/}
          <Box mt="24px">
            <Input
              type="number"
              name="amount"
              label="Amount to borrow"
              rightLabel={`Max. ${format(maxBorrow, token)} ${token}`}
              rightLabelAction={() => setRawValue("amount", maxBorrow, false)}
              suffix={<Usdc />}
              placeholder="0.0"
              error={errors.amount}
              value={amount.formatted}
              onChange={register("amount")}
            />
          </Box>
          {/*--------------------------------------------------------------
            Stats After
          *--------------------------------------------------------------*/}
          <NumericalRows
            mt="16px"
            items={[
              {
                label: "Interest rate",
                value: `${format(
                  calculateInterestRate(borrowRatePerSecond, token) * 100n,
                  token,
                )}% APR`,
                tooltip: {
                  content: "The interest rate accrued over a 12 month borrow period",
                },
              },
              {
                label: "Total incl. origination fee",
                value: `${format(borrow, token)} ${token}`,
                tooltip: {
                  content: "Total amount borrowed including fee",
                },
              },
              {
                label: "New balance owed",
                value: `${format(newOwed, token)} ${token}`,
                tooltip: {
                  content: "The total amount you will owe if this borrow transaction is successful",
                },
              },
              {
                label: "Payment due",
                value:
                  amount.raw <= 0n && owed <= 0n
                    ? "N/A"
                    : `${format(minPayment, token)} ${token} · ${firstPaymentDueDate}`,
                tooltip: {
                  content:
                    "The amount and date of your next minimum payment in order to not enter a default state",
                },
              },
            ]}
          />
          {/*--------------------------------------------------------------
            Button
          *--------------------------------------------------------------*/}
          <Button
            {...buttonProps}
            fluid
            mt="16px"
            h="64px"
            size="large"
            icon={BorrowIcon}
            label={`Borrow ${amount.display} ${token}`}
          />
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
