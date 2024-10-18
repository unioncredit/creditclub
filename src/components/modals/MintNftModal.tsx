import "./MintNftModal.scss";

import {
  Text,
  Modal,
  ModalOverlay,
  InfoBanner,
  // @ts-ignore
} from "@unioncredit/ui";
import { useModals } from "@/providers/ModalManagerProvider.tsx";
import { useAccount } from "wagmi";
import { useNftInfo } from "@/hooks/useNftInfo.ts";
import { MintMemberNftMultichain } from "@/components/shared/MintMemberNftMultichain.tsx";
import { MembershipPerks } from "@/components/member/MembershipPerks.tsx";

export const MINT_NFT_MODAL = "mint-nft-modal";

export const MintNftModal = () => {
  const { close } = useModals();
  const { isConnected } = useAccount();
  const { name } = useNftInfo();

  return (
    <ModalOverlay onClick={close}>
      <Modal className="MintNftModal">
        <Modal.Header title={`Mint ${name} membership`} onClose={close} />

        <InfoBanner
          align="left"
          variant="warning"
          label={<><span>Beta Note:</span> Membership Fees are pooled as Club Stake and grow the amount of capital the club can lend to it’s members.</>}
        />

        <Modal.Body>
          <MembershipPerks />
          <MintMemberNftMultichain />

          {!isConnected && (
            <Text color="red500" m="8px 0 0" weight="light">
              Your wallet must be connected to mint
            </Text>
          )}
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
};
