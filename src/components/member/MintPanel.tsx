import "./MintPanel.scss";

import cn from "classnames";
import {
  Divider,
  Text,
  Button,
  Heading,
  // @ts-ignore
} from "@unioncredit/ui";

import NftImage from "@/assets/nft-prevew.svg";

import { useModals } from "@/providers/ModalManagerProvider.tsx";
import { MINT_NFT_MODAL } from "@/components/modals/MintNftModal.tsx";
import { useNftInfo } from "@/hooks/useNftInfo.ts";
import { useMemberCredit } from "@/hooks/useMemberCredit.ts";
import { useVesting } from "@/hooks/useVesting.ts";
import { format, formattedNumber } from "@/utils/format.ts";
import { InvitationRequirements } from "@/components/member/InvitationRequirements.tsx";

export const MintPanel = () => {
  const { open: openModal } = useModals();
  const { name } = useNftInfo();
  const { new: creditPerMember } = useMemberCredit();
  const { data: vestingData } = useVesting();
  const { startingPercentage, duration } = vestingData;

  return (
    <div className="MintPanel rounded-2xl p-6 text-left sm:p-4">
      <header className="MintPanel__header">
        <h2 className="font-medium text-xl text-gray-600">Join The Club!</h2>
      </header>

      <div className="MintPanel__container">
        <div className="MintPanel__image">
          <NftImage />
        </div>
        <div className="MintPanel__content">
          <Heading level={3}>BCC Membership</Heading>
          <Text weight="bold">Perks:</Text>

          <ul>
            <li>Initial Credit: ${(formattedNumber(creditPerMember) * startingPercentage).toFixed(0)}</li>
            <li>Vesting: {duration} days</li>
            <li>Credit after vest: ${format(creditPerMember, 0)}</li>
          </ul>
        </div>
      </div>

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