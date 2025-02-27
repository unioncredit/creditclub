"use client";

// @ts-ignore
import { Modal, ModalOverlay, } from "@unioncredit/ui";
import '@uniswap/widgets/fonts.css'
import { useAccount, useSwitchChain } from "wagmi";
import { Address } from "viem";

import { DEFAULT_CHAIN, DEFAULT_CHAIN_ID } from "@/constants";
import { useModals } from "@/providers/ModalManagerProvider";
import { UniswapSwapWidget } from "@/components/shared/UniswapSwapWidget";
import { RoundedButton } from "@/components/ui/RoundedButton";
import { useClubData } from "@/hooks/useClubData";

export const UNISWAP_SWAP_MODAL = "uniswap-swap-modal";

export const UniswapSwapModal = ({
  clubAddress,
}: {
  clubAddress: Address;
}) => {
  const { close } = useModals();
  const { chain: connectedChain } = useAccount();
  const { data: clubData } = useClubData(clubAddress);
  const { switchChain } = useSwitchChain();

  const { symbol, assetAddress } = clubData;
  
  return (
    <ModalOverlay onClick={close}>
      <Modal className="UniswapSwapModal">
        {!connectedChain || connectedChain.id !== DEFAULT_CHAIN_ID ? (
          <>
            <Modal.Header title="Incorrect network" onClose={close} />
            <Modal.Body>
              <div className="flex flex-col gap-4">
                <p className="text-center text-sm">You must be connected to {DEFAULT_CHAIN.name} to buy ${symbol}. Please switch network to continue.</p>
                <RoundedButton
                  variant="dark"
                  onClick={() => switchChain({ chainId: DEFAULT_CHAIN_ID })}
                >
                  Switch to {DEFAULT_CHAIN.name}
                </RoundedButton>
              </div>
            </Modal.Body>
          </>
        ) : (
          <UniswapSwapWidget
            inputTokenAddress={assetAddress}
            outputTokenAddress={clubAddress}
          />
        )}
      </Modal>
    </ModalOverlay>
  );
}
