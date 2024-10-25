import "./PostTxModal.scss";

import React from "react";
import { Hash } from "viem";
import {
  Box,
  Button,
  ButtonRow,
  Modal,
  ModalOverlay,
  Heading,
  LinkOutIcon,
  // @ts-ignore
} from "@unioncredit/ui";
import { useModals } from "@/providers/ModalManagerProvider.tsx";

export const POST_TX_MODAL = "post-tx-modal";

export const PostTxModal = ({
  header,
  title,
  content,
  action,
  hash,
}: {
  header: string;
  title: string;
  content: React.ReactNode;
  action?: any;
  hash?: Hash;
}) => {
  const { close } = useModals();

  return (
    <ModalOverlay onClick={close}>
      <Modal className="PostTxModal">
        <Modal.Header title={header} onClose={close} />
        <Modal.Body>
          <Box direction="vertical" align="center">
            <Heading m="12px 0 32px" level={2} size="xlarge" weight="medium">{title}</Heading>
            {content}

            {action && (
              <Button
                fluid
                mt="24px"
                size="large"
                className="ActionButton"
                {...action}
              />
            )}

            <ButtonRow fluid mt="24px">
              <Button
                fluid
                color="secondary"
                variant="light"
                label="Close"
                onClick={close}
              />

              {hash && (
                <Button
                  fluid
                  icon={LinkOutIcon}
                  label="Etherscan"
                  onClick={() => open(`https://optimistic.etherscan.io/tx/${hash}`)}
                />
              )}
            </ButtonRow>
          </Box>
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
