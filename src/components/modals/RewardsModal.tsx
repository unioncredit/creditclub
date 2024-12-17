import "./RewardsModal.scss";

import cn from "classnames";
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  Text,
  NumericalBlock,
  RepayIcon,
  IncreaseVouchIcon,
  // @ts-ignore
} from "@unioncredit/ui";

import { useModals } from "@/providers/ModalManagerProvider.tsx";
import { useUnionMember } from "@/providers/UnionMemberProvider.tsx";
import { format } from "@/utils/format.ts";
import { BUY_INVITES_MODAL } from "@/components/modals/BuyInvitesModal.tsx";
import { UNION_REPAY_MODAL } from "@/components/modals/UnionRepayModal.tsx";
import { ActivateRewardsToggle } from "@/components/rewards/ActivateRewardsToggle.tsx";
import { useRewardsManager } from "@/providers/RewardsManagerDataProvider.tsx";
import { useToken } from "@/hooks/useToken.ts";

export const REWARDS_MODAL = "rewards-modal";

export const RewardsModal = () => {
  const { open, close } = useModals();

  const { token } = useToken();
  const { data: member } = useUnionMember();
  const { data: rewards } = useRewardsManager();

  const { unionBalance } = member;
  const { allowance } = rewards;

  const actions = [
    {
      title: "Repay credit",
      subtitle: "Points for Repay",
      icon: RepayIcon,
      onClick: () => open(UNION_REPAY_MODAL),
      disabled: allowance <= 0n,
    },
    {
      title: "Buy an Invite",
      subtitle: "10k UNION",
      icon: IncreaseVouchIcon,
      onClick: () => open(BUY_INVITES_MODAL),
      disabled: allowance <= 0n,
    },
    {
      title: "Club Merch",
      subtitle: "Coming soon",
      icon: IncreaseVouchIcon,
      onClick: () => console.log("repay"),
      disabled: true,
    },
    {
      title: "Cash Back",
      subtitle: "Coming soon",
      icon: IncreaseVouchIcon,
      onClick: () => console.log("repay"),
      disabled: true,
    }
  ];

  return (
    <ModalOverlay onClick={close}>
      <Modal className="RewardsModal">
        <Modal.Header title="Rewards" onClose={close} />
        <Modal.Body>
          <NumericalBlock
            token="union"
            align="left"
            title="Current Balance"
            value={format(unionBalance, token)}
            smallDecimals
          />

          <Box mt="24px" justify="space-between" align="center" fluid>
            <Text m={0} grey={500} weight="medium">Redeem</Text>
            <ActivateRewardsToggle />
          </Box>

          <Box className="RewardsModal__actions">
            {actions.map(({ title, subtitle, icon, disabled, onClick }) => (
              <Box
                align="center"
                justify="space-between"
                onClick={onClick}
                className={cn("RewardsModal__action", {
                  "disabled": disabled,
                })}
              >
                <Box className="RewardsModal__content" direction="vertical">
                  <Text m={0} grey={700} size="large" weight="medium">{title}</Text>
                  <Text m={0} grey={500} weight="medium">{subtitle}</Text>
                </Box>

                <Button icon={icon} />
              </Box>
            ))}
          </Box>
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
