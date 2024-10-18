import "./ShareLinkModal.scss";

import {
  Box,
  Button,
  ButtonRow,
  Input,
  LinkIcon,
  Modal,
  ModalOverlay,
  TelegramIcon,
  TwitterIcon,
  // @ts-ignore
} from "@unioncredit/ui";

import { useCopyToClipboard } from "@/hooks/useCopyToClipboard.ts";
import { useModals } from "@/providers/ModalManagerProvider.tsx";
import { generateTelegramLink, generateTwitterLink } from "@/utils/links.ts";

export const SHARE_LINK_MODAL = "share-link-modal";

export const ShareLinkModal = ({
  url,
  title,
  text,
  onClose,
}: {
  url: string;
  title: string;
  text: string;
  onClose?: () => void;
}) => {
  const [copied, copy] = useCopyToClipboard();

  const { close } = useModals();

  return (
    <ModalOverlay onClick={onClose ? onClose : close}>
      <Modal>
        <Modal.Header onClose={onClose ? onClose : close} title="Share Link" />
        <Modal.Body>
          <Box align="center" justify="center" direction="vertical">
            <Box mt="8px" direction="vertical" align="center" fluid>
              <Input
                value={url}
                inputProps={{
                  onFocus: (e: any) => e.target.select(),
                }}
                readonly
              />
            </Box>

            <ButtonRow fluid mt="24px">
              <Button
                fluid
                size="large"
                icon={LinkIcon}
                variant="pill"
                onClick={() =>
                  navigator.share
                    ? navigator.share({
                      url,
                      title,
                      text,
                    })
                    // @ts-ignore
                    : copy(url)
                }
                // @ts-ignore
                label={navigator.share ? "Share link" : copied ? "Copied" : "Copy link"}
              />
              <Button
                size="large"
                color="secondary"
                variant="light"
                icon={TwitterIcon}
                href={generateTwitterLink(url, "Check out the highest ranking users on Union")}
                as="a"
                target="_blank"
                rel="noopener"
                className="ShareReferralModal__social"
              />
              <Button
                size="large"
                color="secondary"
                variant="light"
                icon={TelegramIcon}
                href={generateTelegramLink(url, "Check out the highest ranking users on Union")}
                as="a"
                target="_blank"
                rel="noopener"
                className="ShareReferralModal__social"
              />
            </ButtonRow>
          </Box>
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
