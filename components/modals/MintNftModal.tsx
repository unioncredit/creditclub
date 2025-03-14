import {
  Modal,
  ModalOverlay,
  // @ts-ignore
} from "@unioncredit/ui";

import { useModals } from "@/providers/ModalManagerProvider";
import Image from "next/image";
import { StatGrid, StatGridRow } from "@/components/shared/StatGrid";
import { Address } from "viem";
import { useClubData } from "@/hooks/useClubData";
import { useAccount } from "wagmi";
import { useNewMemberData } from "@/hooks/useNewMemberData";
import { format, formatDecimals } from "@/lib/format";
import { useToken } from "@/hooks/useToken";
import { formatDuration } from "@/lib/utils";
import { useErc20Token } from "@/hooks/useErc20Token";
import { useClubMemberNft } from "@/hooks/useClubMemberNft";
import { createIpfsImageUrl } from "@/lib/links";
import { MintMemberNftMultichain } from "@/components/shared/MintMemberNftMultichain";

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
  const { data: clubMemberNftData } = useClubMemberNft(clubAddress);
  const { data: newMemberData } = useNewMemberData(address, clubAddress);
  const { data: assetToken } = useErc20Token(clubData.assetAddress);

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
  } = clubData;

  const {
    initialTrustAmount,
    totalTrustAmount,
    vestingDurationInSeconds,
    tokenId,
  } = newMemberData;

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

          <MintMemberNftMultichain clubAddress={clubAddress} rows={rows} />
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
