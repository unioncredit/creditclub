import {
  Modal,
  ModalOverlay,
  // @ts-ignore
} from "@unioncredit/ui";
import { useAccount } from "wagmi";
import { Address } from "viem";

import { useModals } from "@/providers/ModalManagerProvider";
import { StatGrid, StatGridRow } from "@/components/shared/StatGrid";
import { useClubData } from "@/hooks/useClubData";
import { useNewMemberData } from "@/hooks/useNewMemberData";
import { format, formatDecimals } from "@/lib/format";
import { useToken } from "@/hooks/useToken";
import { formatDuration } from "@/lib/utils";
import { useErc20Token } from "@/hooks/useErc20Token";
import { MintMemberNftMultichain } from "@/components/shared/MintMemberNftMultichain";
import { useClubMemberNft } from "@/hooks/useClubMemberNft";

export const MINT_NFT_MODAL = "mint-nft-modal";

export const MintNftModal = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const { close } = useModals();
  const { address } = useAccount();
  const { token } = useToken();
  const { data: clubData } = useClubData(clubAddress);
  const { data: clubMemberNft } = useClubMemberNft(clubAddress);
  const { data: newMemberData } = useNewMemberData(address, clubAddress);
  const { data: assetToken } = useErc20Token(clubData.assetAddress);

  const {
    symbol: assetTokenSymbol,
    decimals: assetTokenDecimals
  } = assetToken;

  const {
    name,
    image,
  } = clubData;

  const {
    membershipCost,
  } = clubMemberNft;

  const {
    initialTrustAmount,
    totalTrustAmount,
    vestingDurationInSeconds,
    tokenId,
  } = newMemberData;

  const rows: StatGridRow[] = [
    {
      name: "Cost to join",
      value: `${formatDecimals(membershipCost, assetTokenDecimals, 0)} ${assetTokenSymbol}`
    },
    {
      name: "Starting credit",
      value: `$${formatDecimals(initialTrustAmount, assetTokenDecimals)}`
    },
    {
      name: "Vesting Period",
      value: vestingDurationInSeconds <= BigInt(0)
        ? "No vesting"
        : formatDuration(Number(vestingDurationInSeconds))
    },
    ...(vestingDurationInSeconds > BigInt(0) ? [
      {
        name: "Credit after vesting",
        value: `$${formatDecimals(totalTrustAmount, assetTokenDecimals)}`
      }
    ] : [])
  ];

  return (
    <ModalOverlay onClick={close}>
      <Modal>
        <Modal.Header title={`Mint ${name} Membership`} onClose={close} />
        <Modal.Body>
          <div className="flex justify-center w-full">
            <img
              width={150}
              height={150}
              src={image}
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

          <MintMemberNftMultichain clubAddress={clubAddress} rows={rows} />
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
