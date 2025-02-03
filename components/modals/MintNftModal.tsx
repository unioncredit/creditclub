import {
  Button,
  Modal,
  ModalOverlay,
  // @ts-ignore
} from "@unioncredit/ui";

import { useModals } from "@/providers/ModalManagerProvider";
import Image from "next/image";
import { StatGrid, StatGridRow } from "@/components/shared/StatGrid";

export const MINT_NFT_MODAL = "mint-nft-modal";

export const MintNftModal = () => {
  const { close } = useModals();

  const rows: StatGridRow[] = [
    {
      name: "Starting credit",
      value: "$100"
    },
    {
      name: "Vesting Period",
      value: "No vesting"
    },
    {
      name: "ProRata",
      value: "$100"
    },
    {
      name: "Referred by",
      value: "club.eth"
    },
  ];

  return (
    <ModalOverlay onClick={close}>
      <Modal>
        <Modal.Header title="Mint BC Membership" onClose={close} />
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
            title="Builder Credit Member #123"
            className="my-4"
            size="small"
            rows={rows}
          />

          <Button
            fluid
            className="mt-4"
            label="Approve 1 USDC"
            color="primary"
            size="large"
          />
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
