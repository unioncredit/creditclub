import "./UnionRepayModal.scss";

import {
  ArrowRightIcon,
  Button,
  Heading,
  Modal,
  ModalOverlay,
  Input,
  Union,
  Usdc,
  Text,
  RepayIcon,
  // @ts-ignore
} from "@unioncredit/ui";
import { useModals } from "@/providers/ModalManagerProvider.tsx";
import { REWARDS_MODAL } from "@/components/modals/RewardsModal.tsx";
import { StatRow } from "@/components/modals/StatRow.tsx";
import { IFormField, IFormValues } from "@/hooks/useForm.types.ts";
import { useForm } from "@/hooks/useForm.ts";
import { useUnionMember } from "@/providers/UnionMemberProvider.tsx";
import { format } from "@/utils/format.ts";
import { useRewardsManager } from "@/providers/RewardsManagerDataProvider.tsx";
import { useWrite } from "@/hooks/useWrite.ts";
import { useAccount } from "wagmi";
import { POST_TX_MODAL } from "@/components/modals/PostTxModal.tsx";
import { useClubActivity } from "@/providers/ClubActivityProvider.tsx";
import { REPAY_MODAL } from "@/components/modals/RepayModal.tsx";
import { useContract } from "@/hooks/useContract.ts";
import { useToken } from "@/hooks/useToken.ts";

export const UNION_REPAY_MODAL = "union-repay-modal";

export const UnionRepayModal = () => {
  const { open, close } = useModals();

  const { token, wad } = useToken();
  const { address: connectedAddress } = useAccount();
  const { data: member, refetch: refetchMember } = useUnionMember();
  const { data: rewards } = useRewardsManager();
  const { refetch: refetchClubActivity } = useClubActivity();

  const { unionBalance, owed } = member;
  const { unionPer, contractDaiBalance } = rewards;

  const clubPluginContract = useContract("clubPlugin");
  const rewardsManagerContract = useContract("rewardsManager");

  const validate = (inputs: IFormValues) => {
    const amount = inputs.amount as IFormField;

    if (amount.raw > unionBalance) {
      return `${format(unionBalance, token)} UNION Available`;
    }
    const credit = amount.raw * unionPer / wad;
    if (credit > contractDaiBalance) {
      return `Only ${format(contractDaiBalance, token, 0)} ${token} available at this time`;
    }
  };

  const {
    setRawValue,
    register,
    values = {},
    errors = {},
    empty
  } = useForm({ validate });

  const amount = values.amount as IFormField || empty;
  const amountRaw = amount.raw || 0n;
  const formattedAmount = format(amountRaw, token, 2, false);

  const creditRaw = amount.raw * unionPer / wad;
  const creditFormatted = format(creditRaw, token, 2, false);

  const maxAmountFromBalance = unionBalance * unionPer / wad;
  const maxAvailable = maxAmountFromBalance <= contractDaiBalance ? maxAmountFromBalance : contractDaiBalance;

  const repayCreditButtonProps = useWrite({
    ...rewardsManagerContract,
    functionName: "claimStatementCredit",
    args: [amountRaw, connectedAddress, clubPluginContract.address],
    disabled: !connectedAddress || amountRaw === 0n || !!errors.amount,
    onComplete: async (hash) => {
      refetchMember();
      refetchClubActivity(10000);
      open(POST_TX_MODAL, {
        header: "Your redeem was successful",
        title: "Credit Repaid",
        content: (
          <Text grey={500} size="medium" weight="medium">
            You successfully redeemed {formattedAmount} UNION for ${creditFormatted} in repay credit. Your new balance is ${format(owed - creditRaw, token)}.
          </Text>
        ),
        action: {
          icon: RepayIcon,
          label: `Repay with ${token}`,
          onClick: () => open(REPAY_MODAL)
        },
        hash,
      });
    },
  });

  return (
    <ModalOverlay onClick={close}>
      <Modal className="UnionRepayModal" animated={false}>
        <Modal.Header title="Repay Credit" onClose={close} onBack={() => open(REWARDS_MODAL)} />
        <Modal.Body>
          <Heading align="center" level={2} size="xlarge" weight="medium" maxw="275px">
            Instantly pay down your balance
          </Heading>

          <Input
            type="number"
            m="12px 0 32px"
            maxw="300px"
            label="Amount"
            caption={`${format(maxAvailable, token, 0)} ${token} available to redeem`}
            placeholder="0.0"
            suffix={<Union />}
            rightLabel={`Max. ${format(unionBalance, token, 0, false)} UNION`}
            rightLabelAction={() => setRawValue("amount", unionBalance, false)}
            error={errors.amount}
            value={amount.formatted}
            onChange={register("amount")}
          />

          <StatRow
            title="Points to Redeem"
            content="What you send"
            amount={formattedAmount}
            color="#F59E0B"
            token={<Union />}
          />

          <ArrowRightIcon className="DownArrow" width={24} height={24} />

          <StatRow
            title="Statement Credit"
            content="What you receive"
            amount={creditFormatted}
            color="#F59E0B"
            token={<Usdc />}
          />

          <Button
            fluid
            mt="12px"
            size="large"
            label={`Redeem ${formattedAmount} UNION`}
            className="RedeemButton"
            {...repayCreditButtonProps}
          />
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
