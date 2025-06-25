import { useState } from "react";
import { useAccount } from "wagmi";
import {
  ArrowRightIcon,
  Box,
  Button,
  Heading,
  ProfileIcon,
  Modal,
  ModalOverlay,
  Text,
  Union,
  VouchIcon,
  // @ts-ignore
} from "@unioncredit/ui";

import { useModals } from "@/providers/ModalManagerProvider";
import { format } from "@/lib/format";
import { REWARDS_MODAL } from "@/components/modals/RewardsModal";
import { useWrite } from "@/hooks/useWrite";
import { POST_TX_MODAL } from "@/components/modals/PostTxModal";
import { INVITE_MODAL } from "@/components/modals/InviteModal";
import { useUnionMember } from "@/providers/UnionMemberProvider";
import { useToken } from "@/hooks/useToken";
import { useRewardsManager } from "@/hooks/useRewardsManager";
import { Address } from "viem";
import { useRewardsManagerContract } from "@/hooks/useRewardsManagerContract";

export const BUY_INVITES_MODAL = "buy-invites-modal";

export const BuyInvitesModal = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const [numInvites, setNumInvites] = useState(1);

  const { token } = useToken();
  const { open, close } = useModals();
  const { address: connectedAddress } = useAccount();
  const { data: rewards } = useRewardsManager(clubAddress);
  const { data: member } = useUnionMember();

  const { invitePrice } = rewards;
  const { unionBalance } = member;

  const rewardsManagerContract = useRewardsManagerContract();

  const totalCost = invitePrice * BigInt(numInvites);

  const buyInvitesButtonProps = useWrite({
    ...rewardsManagerContract,
    functionName: "claimRewardInvite",
    args: [clubAddress, numInvites, connectedAddress],
    disabled: !connectedAddress || totalCost < invitePrice || totalCost > unionBalance,
    onComplete: async (hash: string) => {
      open(POST_TX_MODAL, {
        header: "Your redeem was successful",
        title: numInvites > 1 ? "Invites Received" : "Invite Received",
        content: (
          <Text maxw="320px" grey={500} size="medium" weight="medium">
            You successfully redeemed {format(totalCost, token, 0)} UNION for {numInvites} club {numInvites > 1 ? "invites" : "invite"}!
          </Text>
        ),
        action: {
          icon: VouchIcon,
          label: "Invite a friend",
          onClick: () => open(INVITE_MODAL)
        },
        hash,
      });
    },
  });

  return (
    <ModalOverlay onClick={close}>
      <Modal className="BuyInvitesModal" animated={false}>
        <Modal.Header title="Redeem Invites" onClose={close} onBack={() => open(REWARDS_MODAL)} />
        <Modal.Body>
          <Box direction="vertical" align="center">
            <ProfileIcon width={32} height={32} />
            <Heading level={2} size="xlarge" weight="medium">Club Invites</Heading>
            <Text size="medium" weight="medium" grey={500} maxw="300px" align="center">
              Pay it forward, use your club rewards to invite your friends to the party.
            </Text>
          </Box>

          <Box className="BuyInvitesModal__Boxes" m="32px 0 48px" align="center">
            <Box className="BuyInvitesModal__Box" direction="vertical" align="center" fluid>
              <Text size="medium" weight="medium" grey={500}>
                What you send
              </Text>
              <Text m={0} grey={900} size="large" weight="medium" className="flex items-center gap-1">
                {format(totalCost, token, 0)}
                <Union />
              </Text>
            </Box>

            <ArrowRightIcon width={24} />

            <Box className="BuyInvitesModal__Box" direction="vertical" align="center" fluid>
              <Text size="medium" weight="medium" grey={500}>
                What you receive
              </Text>

              <Box className="BuyInvitesModal__InviteSelection">
                <Button
                  label="-"
                  size="pill"
                  variant="light"
                  color="secondary"
                  onClick={() => setNumInvites(i => Math.max(i - 1, 1))}
                />
                <Text m={0} grey={900} size="large" weight="medium">
                  {numInvites}
                </Text>
                <Button
                  label="+"
                  size="pill"
                  variant="light"
                  color="secondary"
                  onClick={() => setNumInvites(i => i + 1)}
                />
                <Text m={0} grey={900} size="large" weight="medium">
                  Invites
                </Text>
              </Box>
            </Box>
          </Box>

          {totalCost > unionBalance && (
            <Text color="red600">
              Insufficient UNION balance
            </Text>
          )}

          <Button
            fluid
            size="large"
            label={`Redeem ${format(totalCost, token, 0)} UNION`}
            {...buyInvitesButtonProps}
          />
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
