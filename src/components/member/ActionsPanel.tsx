import "./ActionsPanel.scss";

import {
  Button,
  // @ts-ignore
} from "@unioncredit/ui";

import PinkGlasses from "@/assets/glasses-pink.svg";

import { ClubCreditRow } from "@/components/member/ClubCreditRow.tsx";
import { ClubDebtRow } from "@/components/member/ClubDebtRow.tsx";
import { BidBucketRow } from "@/components/member/BidBucketRow.tsx";
import { useModals } from "@/providers/ModalManagerProvider.tsx";
import { MINT_NFT_MODAL } from "@/components/modals/MintNftModal.tsx";
import { useClubMember } from "@/providers/CreditClubMemberProvider.tsx";
import cn from "classnames";
import { useNftInfo } from "@/hooks/useNftInfo.ts";
import { useVesting } from "@/hooks/useVesting.ts";
import { RainbowBar } from "@/components/shared/RainbowBar.tsx";
import { generateCreditClubLink } from "@/utils/links.ts";
import { getClubSymbol } from "@/utils/format.ts";

export const ActionsPanel = () => {
  const { open: openModal } = useModals();
  const { data: member } = useClubMember();
  const { data: vestingData } = useVesting();
  const { name } = useNftInfo();

  const { vestedPercentage } = vestingData;
  const { tokenId, isMember } = member;

  const vestingStatus = vestedPercentage >= 100
    ? "Full Member"
    : `${(vestedPercentage * 100).toFixed(2)}% vested`

  return (
    <div className="ActionsPanel rounded-2xl p-6 text-left sm:p-4">
      <header className="ActionsPanel__header">
        <h2 className="font-medium text-xl text-gray-600">Club Member Actions</h2>

        <Button
          size="large"
          color="secondary"
          variant="light"
          onClick={() => isMember ? open(generateCreditClubLink(tokenId)) : openModal(MINT_NFT_MODAL)}
          className={cn("MintButton mt-4", {
            "token": isMember,
          })}
          label={
            isMember ? (
              <span className="inline-flex items-center">
                <PinkGlasses />
                <p className="ml-2 text-md" style={{ color: "#FF638D" }}>
                  {getClubSymbol(name)}: ID#{tokenId!.toString(10)} : {vestingStatus}
                </p>
              </span>
            ) : (
              <p className="text-sm" style={{ color: "#FF638D" }}>Mint{name && ` ${name}`} Membership</p>
            )
          }
        />

        {isMember && (
          <RainbowBar mt="24px" percentage={vestedPercentage * 100} />
        )}
      </header>

      <ClubCreditRow />
      <ClubDebtRow />
      <BidBucketRow />
    </div>
  );
};