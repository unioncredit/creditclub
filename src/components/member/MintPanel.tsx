import "./MintPanel.scss";

import cn from "classnames";
import {
  Divider,
  Button,
  // @ts-ignore
} from "@unioncredit/ui";

import { useModals } from "@/providers/ModalManagerProvider.tsx";
import { MINT_NFT_MODAL } from "@/components/modals/MintNftModal.tsx";
import { useNftInfo } from "@/hooks/useNftInfo.ts";
import { InvitationRequirements } from "@/components/member/InvitationRequirements.tsx";
import { MembershipPerks } from "@/components/member/MembershipPerks.tsx";

export const MintPanel = () => {
  const { open: openModal } = useModals();
  const { name } = useNftInfo();

  return (
    <div className="MintPanel rounded-2xl p-6 text-left sm:p-4">
      <header className="MintPanel__header">
        <h2 className="font-medium text-xl text-gray-600">Join The Club!</h2>
      </header>

      <MembershipPerks />
      <InvitationRequirements />

      <Divider mt="12px" />

      <Button
        size="large"
        color="secondary"
        variant="light"
        className={cn("MintButton mt-4")}
        onClick={() => openModal(MINT_NFT_MODAL)}
        label={<p className="text-sm" style={{ color: "#FF638D" }}>Mint{name && ` ${name}`} Membership</p>}
      />
    </div>
  );
};