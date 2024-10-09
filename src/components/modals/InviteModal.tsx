import {
  Button,
  Modal,
  ModalOverlay,
  Text,
  VouchIcon,
  // @ts-ignore
} from "@unioncredit/ui";
import { useModals } from "@/providers/ModalManagerProvider.tsx";
import { useWrite } from "@/hooks/useWrite.ts";
import { clubPluginContract } from "@/contracts/optimism.ts";
import { useState } from "react";
import { Address } from "viem";
import { AddressInput } from "@/components/shared/AddressInput.tsx";
import { InviteesTable } from "@/components/modals/InviteesTable.tsx";
import { useSentInvitations } from "@/hooks/useSentInvitations.ts";
import { useClubMember } from "@/providers/CreditClubMemberProvider.tsx";
import { useAccount } from "wagmi";

export const INVITE_MODAL = "invite-modal";

export const InviteModal = () => {
  const [address, setAddress] = useState<Address | null>(null);

  const { close } = useModals();
  const { address: connectedAddress } = useAccount();
  const { data: member, refetch: refetchMember } = useClubMember();
  const { data: sentInvitations, refetch: refetchSentInvitations } = useSentInvitations({
    sender: connectedAddress,
  });

  const { inviteCount } = member;

  const inviteUserButtonProps = useWrite({
    ...clubPluginContract,
    functionName: "invite",
    args: [address],
    disabled: !address,
    onComplete: async () => {
      await refetchMember();
      await refetchSentInvitations();
      close();
    },
  });

  /*--------------------------------------------------------------
    Render Component
   --------------------------------------------------------------*/

  return (
    <ModalOverlay onClick={close}>
      <Modal className="InviteModal">
        <Modal.Header title="Invite Club Members" onClose={close} />
        <Modal.Body>
          <AddressInput
            label="Address or ENS of recipient"
            rightLabel={`${inviteCount === 1 ? "1 invite" : `${inviteCount} invites`} remaining`}
            onChange={(addr) => setAddress(addr)}
          />

          <Button
            {...inviteUserButtonProps}
            label="Invite user"
            icon={VouchIcon}
            size="large"
            mt="16px"
            fluid
          />

          <Text mt="16px" align="left" size="medium">Invited users</Text>
          <InviteesTable sentInvitations={sentInvitations} />
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
};
