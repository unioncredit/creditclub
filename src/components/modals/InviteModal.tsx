import {
  Button,
  Modal,
  ModalOverlay,
  Text,
  VouchIcon,
  Skeleton,
  // @ts-ignore
} from "@unioncredit/ui";
import { useModals } from "@/providers/ModalManagerProvider.tsx";
import { useWrite } from "@/hooks/useWrite.ts";
import { useRef, useState } from "react";
import { Address } from "viem";
import { AddressInput } from "@/components/shared/AddressInput.tsx";
import { InviteesTable } from "@/components/modals/InviteesTable.tsx";
import { useSentInvitations } from "@/hooks/useSentInvitations.ts";
import { useClubMember } from "@/providers/CreditClubMemberProvider.tsx";
import { useAccount } from "wagmi";
import { useContract } from "@/hooks/useContract.ts";

export const INVITE_MODAL = "invite-modal";

export const InviteModal = () => {
  console.log("Opened InviteModal!");

  const [key, setKey] = useState(0);
  const [address, setAddress] = useState<Address | null>(null);

  const addressInputRef = useRef<HTMLInputElement>(null);

  const { close } = useModals();
  const { address: connectedAddress } = useAccount();
  const { data: member, refetch: refetchMember, isLoading: memberLoading } = useClubMember();
  const { data: sentInvitations, addInvite, } = useSentInvitations({
    sender: connectedAddress,
  });

  const clubPluginContract = useContract("clubPlugin");

  const { inviteCount } = member;

  const clearAddressInput = () => {
    if (addressInputRef.current) {
      addressInputRef.current.value = "";
      setKey(k => k + 1);
    }
  };

  const inviteUserButtonProps = useWrite({
    ...clubPluginContract,
    functionName: "invite",
    args: [address],
    disabled: !address,
    onComplete: async () => {
      clearAddressInput();
      addInvite(address);
      await refetchMember();
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
            key={key}
            label="Address or ENS of recipient"
            onChange={(addr) => setAddress(addr)}
            inputProps={{ ref: addressInputRef }}
            rightLabel={memberLoading ? (
              <Skeleton width={125} height={25} shimmer />
            ) : (
              <>{inviteCount === 1 ? "1 invite" : `${inviteCount} invites`} remaining</>
            )}
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
