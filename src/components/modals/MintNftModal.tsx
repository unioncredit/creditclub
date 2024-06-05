import "./MintNftModal.scss";

import {
  Text,
  Modal,
  ModalOverlay,
  InfoBanner,
  Dai,
  DelegateIcon,
  ArrowRightIcon,
  // @ts-ignore
} from "@unioncredit/ui";
import { useModals } from "@/providers/ModalManagerProvider.tsx";
import { StatRow } from "@/components/modals/StatRow.tsx";
import { useCreditClub } from "@/providers/CreditClubDataProvider.tsx";
import { format } from "@/utils/format.ts";
import { ApprovalButton } from "@/components/shared/ApprovalButton.tsx";
import { useAccount } from "wagmi";
import { clubPluginContract, daiContract } from "@/contracts/optimism.ts";
import { useWhitelistProof } from "@/hooks/useWhitelistProof.ts";
import { useMember } from "@/providers/ConnectedMemberProvider.tsx";
import { useMemberCredit } from "@/hooks/useMemberCredit.ts";

export const MINT_NFT_MODAL = "mint-nft-modal";

export const MintNftModal = () => {
  const { close } = useModals();
  const { address, isConnected } = useAccount();
  const { data: creditClub, refetch: refetchCreditClub } = useCreditClub();
  const { new: creditPerMember } = useMemberCredit();
  const { refetch: refetchMember } = useMember();
  const { proof } = useWhitelistProof();

  const { costToMint } = creditClub;

  return (
    <ModalOverlay onClick={close}>
      <Modal className="MintNftModal">
        <Modal.Header title="Mint Club NFT" onClose={close} />

        <Modal.Body>
          <InfoBanner
            mb="12px"
            align="left"
            variant="warning"
            label="Please be aware that your accessible credit limit may change as other members join the club and borrow."
          />

          <div className="mb-4">
            <StatRow
              title="Entry Fee"
              content="The cost to join"
              amount={format(costToMint, 0)}
              token={<Dai />}
            />

            <ArrowRightIcon className="ArrowRightIcon" />

            <StatRow
              title="Credit Limit"
              content="Your initial credit limit"
              amount={format(creditPerMember)}
              token={<Dai />}
            />
          </div>

          <ApprovalButton
            disabled={!proof}
            owner={address}
            amount={costToMint}
            spender={clubPluginContract.address}
            tokenContract={daiContract}
            actionProps={{
              ...clubPluginContract,
              functionName: "mintMemberNFT",
              label: "Mint Member NFT",
              icon: DelegateIcon,
              args: [proof],
              disabled: !proof,
              onComplete: async () => {
                await refetchCreditClub();
                await refetchMember();
                close();
              }
            }}
          />

          {!proof && (
            <Text color="red500" m="8px 0 0" weight="light">
              Your address is not whitelisted to mint
            </Text>
          )}
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
