import React from "react";
import { Hash } from "viem";
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  LinkOutIcon,
  // @ts-ignore
} from "@unioncredit/ui";

import { useModals } from "@/providers/ModalManagerProvider";

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
            <h2 className="font-mono text-2xl font-semibold">{title}</h2>
            {content}

            {action && (
              <Button
                fluid
                mt="24px"
                size="large"
                className="min-h-[64px]"
                label={action.label || ""}
                onClick={action.onClick}
                disabled={action.disabled}
                variant={action.variant}
                color={action.color}
              />
            )}

            <div className="flex items-center gap-2 w-full mt-4">
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
                  onClick={() => open(`https://basescan.org/tx/${hash}`)}
                />
              )}
            </div>
          </Box>
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
