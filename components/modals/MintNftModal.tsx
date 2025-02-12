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
import { Address } from "viem";
import { useWrite } from "@/hooks/useWrite";
import { useClubData } from "@/hooks/useClubData";
import { useAccount } from "wagmi";
import { useNewMemberData } from "@/hooks/useNewMemberData";
import { format } from "@/lib/format";
import { useToken } from "@/hooks/useToken";
import { formatDuration } from "@/lib/utils";
import { POST_MINT_NFT_MODAL } from "@/components/modals/PostMintNftModal";

export const MINT_NFT_MODAL = "mint-nft-modal";

export const MintNftModal = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const { open: openModal, close } = useModals();
  const { address } = useAccount();
  const { token } = useToken();
  const { data: clubData, refetch: refetchClubData } = useClubData(clubAddress);
  const { data: newMemberData } = useNewMemberData(address, clubAddress);

  const { name, costToCall } = clubData;
  const {
    initialTrustAmount,
    totalTrustAmount,
    vestingDurationInSeconds,
    tokenId,
  } = newMemberData;

  const creditVaultContract = useCreditVaultContract(clubAddress);

  const mintNftButtonProps = useWrite({
    ...creditVaultContract,
    functionName: "mintMemberNFT",
    value: costToCall,
    args: [address],
    onCompleted: async () => {
      refetchClubData();

      openModal(POST_MINT_NFT_MODAL, {
        clubName: name,
        tokenId,
        rows,
        startingCredit: initialTrustAmount,
      });
    }
  });

  const rows: StatGridRow[] = [
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
              src="/images/avatar.png"
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

          <Button
            fluid
            className="mt-4"
            label="Join Club"
            color="primary"
            size="large"
            {...mintNftButtonProps}
          />
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
