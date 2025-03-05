import {
  Button,
  Modal,
  ModalOverlay,
  // @ts-ignore
} from "@unioncredit/ui";

import { useModals } from "@/providers/ModalManagerProvider";
import Image from "next/image";
import { StatGrid, StatGridRow } from "@/components/shared/StatGrid";
import { useCreditVaultContract } from "@/hooks/useCreditVaultContract";
import { Address, erc20Abi } from "viem";
import { useClubData } from "@/hooks/useClubData";
import { useAccount } from "wagmi";
import { useNewMemberData } from "@/hooks/useNewMemberData";
import { format, formatDecimals } from "@/lib/format";
import { useToken } from "@/hooks/useToken";
import { formatDuration } from "@/lib/utils";
import { POST_MINT_NFT_MODAL } from "@/components/modals/PostMintNftModal";
import { useErc20Token } from "@/hooks/useErc20Token";
import { ApprovalButton } from "@/components/shared/ApprovalButton";
import { useClubMember } from "@/hooks/useClubMember";
import { useClubContacts } from "@/hooks/useClubContacts";
import { useClubMemberNft } from "@/hooks/useClubMemberNft";
import { createIpfsImageUrl } from "@/lib/links";
import { useIsQualified } from "@/hooks/useIsQualified";

export const MINT_NFT_MODAL = "mint-nft-modal";

export const MintNftModal = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const { open: openModal, close } = useModals();
  const { address } = useAccount();
  const { token } = useToken();
  const { refetch: refetchClubContacts } = useClubContacts(clubAddress);
  const { data: clubData, refetch: refetchClubData } = useClubData(clubAddress);
  const { data: clubMember, refetch: refetchClubMember } = useClubMember(address, clubAddress);
  const { data: clubMemberNftData } = useClubMemberNft(clubAddress);
  const { data: newMemberData } = useNewMemberData(address, clubAddress);
  const { data: assetToken } = useErc20Token(clubData.assetAddress);
  const { data: isQualified } = useIsQualified(clubAddress);

  const {
    assetBalance
  } = clubMember;

  const {
    image: ipfsImageLink,
  } = clubMemberNftData;

  const {
    symbol: assetTokenSymbol,
    decimals: assetTokenDecimals
  } = assetToken;

  const {
    name,
    costToMint,
    assetAddress,
  } = clubData;

  const {
    initialTrustAmount,
    totalTrustAmount,
    vestingDurationInSeconds,
    tokenId,
  } = newMemberData;

  const creditVaultContract = useCreditVaultContract(clubAddress);

  const rows: StatGridRow[] = [
    {
      name: "Cost to join",
      value: `${formatDecimals(costToMint, assetTokenDecimals, 0)} ${assetTokenSymbol}`
    },
    {
      name: "Starting credit",
      value: `$${format(initialTrustAmount, token)}`
    },
    {
      name: "Vesting Period",
      value: vestingDurationInSeconds <= 0n
        ? "No vesting"
        : formatDuration(Number(vestingDurationInSeconds))
    },
    ...(vestingDurationInSeconds > 0n ? [
      {
        name: "Credit after vesting",
        value: `$${format(totalTrustAmount, token)}`
      }
    ] : [])
  ];

  return (
    <ModalOverlay onClick={close}>
      <Modal>
        <Modal.Header title={`Mint ${name} Membership`} onClose={close} />
        <Modal.Body>
          <div className="flex justify-center w-full">
            <Image
              width={150}
              height={150}
              src={createIpfsImageUrl(ipfsImageLink)}
              alt="Fund Image"
              className="rounded-xl border border-stone-200"
            />
          </div>

          <StatGrid
            title={`${name} Member #${tokenId}`}
            className="my-4"
            size="small"
            rows={rows}
          />

          {isQualified ? (
            <ApprovalButton
              owner={address}
              amount={costToMint}
              disabled={assetBalance < costToMint}
              spender={clubAddress}
              tokenContract={{
                abi: erc20Abi,
                address: assetAddress,
              }}
              actionProps={{
                ...creditVaultContract,
                label: "Join Club",
                disabled: assetBalance < costToMint,
                functionName: "mintMemberNFT",
                args: [address],
                onComplete: async () => {
                  refetchClubData();
                  refetchClubMember();
                  refetchClubContacts();

                  openModal(POST_MINT_NFT_MODAL, {
                    clubName: name,
                    tokenId,
                    rows,
                    startingCredit: initialTrustAmount,
                    nftImageUrl: createIpfsImageUrl(ipfsImageLink),
                  });
                }
              }}
            />
          ) : (
            <Button
              fluid
              size="large"
              disabled={true}
              label="You do not qualify"
            />
          )}
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
