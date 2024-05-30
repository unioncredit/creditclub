import "./ActionsPanel.scss";

import {
  Button,
} from "@unioncredit/ui";

import BlackGlasses from "@/assets/glasses-black.svg";
import PinkGlasses from "@/assets/glasses-pink.svg";

import { IconCube } from "@/components/shared/IconCube.tsx";
import { ClubCreditRow } from "@/components/member/ClubCreditRow.tsx";
import { ClubDebtRow } from "@/components/member/ClubDebtRow.tsx";
import { BidBucketRow } from "@/components/member/BidBucketRow.tsx";
import { useModals } from "@/providers/ModalManagerProvider.tsx";
import { MINT_NFT_MODAL } from "@/components/modals/MintNftModal.tsx";
import { useMember } from "@/providers/ConnectedMemberProvider.tsx";

export const ActionsPanel = () => {
  const { open } = useModals();
  const { data: member } = useMember();
  const { tokenId } = member;

  return (
    <div className="ActionsPanel rounded-2xl p-6 text-left">
      <h2 className="font-medium text-xl text-gray-600">Club Member Actions</h2>

      <Button
        className="MintButton mt-4"
        size="large"
        disabled={tokenId}
        label={
          tokenId ? (
            <span className="inline-flex items-center">
              <PinkGlasses />
              <p className="ml-2 text-md" style={{ color: "#FF638D" }}>BCC: ID#{tokenId.toString(10)}</p>
            </span>
          ) : (
            <span>
              <IconCube color="#FFDFE8" icon={BlackGlasses} width={32} height={32} />
              <p className="mt-2 text-md" style={{ color: "#FF638D" }}>Mint to Join and claim $2,500 in credit</p>
            </span>
          )

        }
        color="secondary"
        variant="light"
        onClick={() => open(MINT_NFT_MODAL)}
      />

      <ClubCreditRow />
      <ClubDebtRow />
      <BidBucketRow />
    </div>
  );
};