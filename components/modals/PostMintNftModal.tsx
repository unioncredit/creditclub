import {
  Button,
  Modal,
  ModalOverlay,
  InfoBanner,
  TwitterIcon,
  ButtonRow,
  LinkOutIcon,
  // @ts-ignore
} from "@unioncredit/ui";
import Image from "next/image";

import { useModals } from "@/providers/ModalManagerProvider";
import { Button as FlatButton } from "@/components/ui/Button";
import { StatGrid, StatGridRow } from "@/components/shared/StatGrid";

export const POST_MINT_NFT_MODAL = "post-mint-nft-modal";

export const PostMintNftModal = () => {
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
        <Modal.Header
          onClose={close}
          title="Welcome Member #226"
          className="bg-blue-600 text-white"
        />
        <Modal.Body>
          <InfoBanner
            align="left"
            variant="warning"
            label="Welcome! You are now an official member of the {club name}. You now have $354 in credit from {Club Name} and $5,000 in total credit on the Union credit network."
            className="text-xs p-3 bg-stone-100 text-black absolute top-[80px] left-0 right-0"
          />

          <div className="mt-16 flex justify-center w-full">
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

          <FlatButton
            size="large"
            variant="shadow"
            className="w-full"
            onClick={() => open("https://app.union.finance/")}
          >
            {'Use credit on Union ->'}
          </FlatButton>

          <ButtonRow className="mt-4 gap-2">
            <Button
              fluid
              label="Share"
              color="primary"
              icon={TwitterIcon}
            />
            <Button
              fluid
              label="Etherscan"
              color="secondary"
              variant="light"
              className="!border-black"
              icon={LinkOutIcon}
            />
          </ButtonRow>
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
