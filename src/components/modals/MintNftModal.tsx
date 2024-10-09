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
import { useClubData } from "@/providers/CreditClubDataProvider.tsx";
import { format, formattedNumber } from "@/utils/format.ts";
import { ApprovalButton } from "@/components/shared/ApprovalButton.tsx";
import { useAccount } from "wagmi";
import { clubPluginContract, daiContract } from "@/contracts/optimism.ts";
import { useWhitelistProof } from "@/hooks/useWhitelistProof.ts";
import { useClubMember } from "@/providers/CreditClubMemberProvider.tsx";
import { useMemberCredit } from "@/hooks/useMemberCredit.ts";
import { useVesting } from "@/hooks/useVesting.ts";
import { useNftInfo } from "@/hooks/useNftInfo.ts";

export const MINT_NFT_MODAL = "mint-nft-modal";

export const MintNftModal = () => {
  const { close } = useModals();
  const { address, isConnected } = useAccount();
  const { data: creditClub, refetch: refetchCreditClub } = useClubData();
  const { new: creditPerMember } = useMemberCredit();
  const { refetch: refetchMember } = useClubMember();
  const { proof } = useWhitelistProof();
  const { name } = useNftInfo();

  const { costToMint } = creditClub;

  const { data: vestingData } = useVesting();
  const { startingPercentage, duration } = vestingData;

  return (
    <ModalOverlay onClick={close}>
      <Modal className="MintNftModal">
        <Modal.Header title={`Mint ${name} membership`} onClose={close} />

        <InfoBanner
          mb="12px"
          align="left"
          variant="warning"
          label="Your entry fee is added to the club stake to back yours and fellow members Credit."
        />

        <Modal.Body>
          <div className="mb-4">
            <StatRow
              title="Membership Fee"
              amount={format(costToMint, 0)}
              token={<Dai />}
            />

            <ArrowRightIcon className="ArrowRightIcon" />

            <StatRow
              title="Starting Credit Limit"
              content={`You start at ${startingPercentage * 100}% vested`}
              amount={(formattedNumber(creditPerMember) * startingPercentage).toFixed(2)}
              token={<Dai />}
            />

            <StatRow
              title="Full Membership"
              content={`Credit limit after ${duration} days`}
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
              args: proof.length > 0 ? [address, proof] : [address],
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
