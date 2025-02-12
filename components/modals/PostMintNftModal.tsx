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
import { ShadowButton as FlatButton } from "@/components/ui/ShadowButton";
import { StatGrid, StatGridRow } from "@/components/shared/StatGrid";
import { format } from "@/lib/format";
import { useToken } from "@/hooks/useToken";

export const POST_MINT_NFT_MODAL = "post-mint-nft-modal";

export const PostMintNftModal = ({
  clubName,
  tokenId,
  rows,
  startingCredit,
}: {
  clubName: string;
  tokenId: bigint;
  rows: StatGridRow[];
  startingCredit: bigint;
}) => {
  const { close } = useModals();
  const { token } = useToken();

  return (
    <ModalOverlay onClick={close}>
      <Modal>
        <Modal.Header
          onClose={close}
          title={`Congrats Member #${tokenId}`}
          className="bg-blue-600 text-white"
        />
        <Modal.Body>
          <InfoBanner
            align="left"
            variant="warning"
            label={`Welcome Member #${tokenId}! You are now an official member of ${clubName}. You now have $${format(startingCredit, token)} in credit from ${clubName} on the Union credit network.`}
            className="font-mono border-b border-black text-xs p-3 bg-stone-100 text-black absolute top-[80px] left-0 right-0"
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
            title={`${clubName} Member #${tokenId}`}
            className="my-4"
            size="small"
            rows={rows}
          />

          <FlatButton
            size="large"
            variant="light"
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
              className="!border-black border"
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
