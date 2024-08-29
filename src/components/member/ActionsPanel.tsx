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
import { clubNftContract } from "@/contracts/optimism.ts";
import cn from "classnames";
import { useNftInfo } from "@/hooks/useNftInfo.ts";
import { useVesting } from "@/hooks/useVesting.ts";

export const ActionsPanel = () => {
  const { open: openModal } = useModals();
  const { data: member } = useMember();
  const { data: vestingData } = useVesting();
  const { name } = useNftInfo();

  const { vestedPercentage } = vestingData;
  const { tokenId } = member;

  const vestingStatus = vestedPercentage >= 100
    ? "Full Member"
    : `${(vestedPercentage * 100).toFixed(2)}% vested`

  return (
    <div className="ActionsPanel rounded-2xl p-6 text-left sm:p-4">
      <header className="ActionsPanel__header">
        <h2 className="font-medium text-xl text-gray-600">Club Member Actions</h2>

        <Button
          className={cn("MintButton mt-4", {
            "token": tokenId,
          })}
          size="large"
          label={
            tokenId ? (
              <span className="inline-flex items-center">
                <PinkGlasses />
                <p className="ml-2 text-md" style={{ color: "#FF638D" }}>
                  BCC: ID#{tokenId.toString(10)} : {vestingStatus}
                </p>
              </span>
            ) : (
              <span>
              <IconCube color="#FFDFE8" icon={BlackGlasses} width={32} height={32} />
              <p className="mt-1 text-sm"
                 style={{ color: "#FF638D" }}>Mint to Join {name && `"${name}"`}</p>
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