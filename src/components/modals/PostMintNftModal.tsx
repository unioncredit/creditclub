import "./PostMintNftModal.scss";

import {
  Box,
  Button,
  ButtonRow,
  Modal,
  ModalOverlay,
  InfoBanner,
  LinkOutIcon,
  WithdrawIcon,
  Skeleton,
  // @ts-ignore
} from "@unioncredit/ui";
import { useModals } from "@/providers/ModalManagerProvider.tsx";
import { MembershipPerks } from "@/components/member/MembershipPerks.tsx";
import { useClubMember } from "@/providers/CreditClubMemberProvider.tsx";
import { format } from "date-fns";
import { SHARE_LINK_MODAL } from "@/components/modals/ShareLinkModal.tsx";
import { useNftInfo } from "@/hooks/useNftInfo.ts";
import { generateCreditClubLink } from "@/utils/links.ts";
import { Hash } from "viem";
import { getClubSymbol } from "@/utils/format.ts";

export const POST_MINT_NFT_MODAL = "post-mint-nft-modal";

export const PostMintNftModal = ({
  hash
}: {
  hash: Hash;
}) => {
  const { name, description } = useNftInfo();
  const { open: openModal, close } = useModals();

  const { data: member, isLoading } = useClubMember();

  const { tokenId, isMember } = member;

  return (
    <ModalOverlay onClick={close}>
      <Modal className="PostMintNftModal">
        <Modal.Header title={`Congratulations!`} onClose={close} />

        <InfoBanner
          align="left"
          variant="warning"
          label={<><span>Welcome message:</span> Membership Fees are pooled as Club Stake and grow the amount of capital the club can lend to it’s members.</>}
        />

        <Modal.Body>
          <MembershipPerks
            title={(
              <Box justify="center">
                {getClubSymbol(name)} Member

                {isLoading || !isMember ? (
                  <Skeleton ml="8px" width={50} height={28} grey={200} shimmer />
                ) : ` #${tokenId}`}
              </Box>
            )}
            subtitle="Traits"
            additionalPerks={[
              `Join Date: ${format(new Date(), "dd LLL yyyy")}`
            ]}
          />

          <ButtonRow mt="24px">
            <Button
              fluid
              size="medium"
              label="Share"
              icon={WithdrawIcon}
              onClick={() => openModal(SHARE_LINK_MODAL, {
                url: generateCreditClubLink(tokenId),
                title: name,
                text: description,
                onClose: () => {
                  openModal(POST_MINT_NFT_MODAL);
                }
              })}
            />
            {hash && (
              <Button
                fluid
                size="medium"
                label="Etherscan"
                icon={LinkOutIcon}
                onClick={() => open(`https://basescan.org/tx/${hash}`)}
              />
            )}
          </ButtonRow>
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
};
