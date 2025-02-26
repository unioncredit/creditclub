import { useRef, useState } from "react";
import { useAccount } from "wagmi";
import { Address } from "viem";
import {
  Button,
  Modal,
  ModalOverlay,
  Text,
  VouchIcon,
  Skeleton,
  // @ts-ignore
} from "@unioncredit/ui";

import { useModals } from "@/providers/ModalManagerProvider";
import { useWrite } from "@/hooks/useWrite";
import { AddressInput } from "@/components/shared/AddressInput";
import { InviteesTable } from "@/components/invites/InviteesTables";
import { useSentInvitations } from "@/hooks/useSentInvitations";
import { useClubMember } from "@/hooks/useClubMember";
import { useCreditVaultContract } from "@/hooks/useCreditVaultContract";

export const INVITE_MODAL = "invite-modal";

export const InviteModal = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const [key, setKey] = useState(0);
  const [address, setAddress] = useState<Address | null>(null);

  const addressInputRef = useRef<HTMLInputElement>(null);

  const { close } = useModals();
  const { address: connectedAddress } = useAccount();
  const { data: member, refetch: refetchMember, isLoading: memberLoading } = useClubMember(connectedAddress, clubAddress);
  const { data: sentInvitations, addInvite, } = useSentInvitations({
    sender: connectedAddress,
  });

  const creditVaultContract = useCreditVaultContract(clubAddress);

  const { inviteCount } = member;

  const clearAddressInput = () => {
    if (addressInputRef.current) {
      addressInputRef.current.value = "";
      setKey(k => k + 1);
    }
  };

  const inviteUserButtonProps = useWrite({
    ...creditVaultContract,
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
            onChange={(addr: any) => setAddress(addr)}
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
          <InviteesTable clubAddress={clubAddress} sentInvitations={sentInvitations} />
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
};
