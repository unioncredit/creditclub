import "./ActionsPanel.scss";

import {
  Button,
  // @ts-ignore
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
import { useMemberCredit } from "@/hooks/useMemberCredit.ts";
import { format } from "@/utils/format.ts";
import { clubNftContract } from "@/contracts/optimism.ts";

export const ActionsPanel = () => {
  const { open: openModal } = useModals();
  const { data: member } = useMember();
  const { new: creditPerMember } = useMemberCredit();

  const { tokenId } = member;

  return (
    <div className="ActionsPanel rounded-2xl p-6 text-left sm:p-4">
      <header className="ActionsPanel__header">
        <h2 className="font-medium text-xl text-gray-600">Club Member Actions</h2>

        <Button
          className="MintButton mt-4"
          size="large"
          label={
            tokenId ? (
              <span className="inline-flex items-center">
              <PinkGlasses />
              <p className="ml-2 text-md" style={{ color: "#FF638D" }}>BCC: ID#{tokenId.toString(10)}</p>
            </span>
            ) : (
              <span>
              <IconCube color="#FFDFE8" icon={BlackGlasses} width={24} height={24} />
              <p className="mt-1 text-sm"
                 style={{ color: "#FF638D" }}>Mint to Join and claim ${format(creditPerMember)} in credit</p>
            </span>
            )

          }
          color="secondary"
          variant="light"
          onClick={() => tokenId ? open(`https://opensea.io/assets/optimism/${clubNftContract.address}/${tokenId}`) : openModal(MINT_NFT_MODAL)}
        />
      </header>

      <ClubCreditRow />
      <ClubDebtRow />
      <BidBucketRow />
    </div>
  );
};