import React, { createContext, useContext, useState } from "react";

import { REWARDS_RAFFLE_MODAL, RewardsRaffleModal } from "@/components/modals/RewardsRaffleModal";
import { FIXED_BID_MODAL, FixedBidModal } from "@/components/modals/FixedBidModal";
import { MINT_NFT_MODAL, MintNftModal } from "@/components/modals/MintNftModal";
import { MINT_REDEEM_MODAL, MintRedeemModal } from "@/components/modals/MintRedeemModal";
import { POST_MINT_NFT_MODAL, PostMintNftModal } from "@/components/modals/PostMintNftModal";

interface IModalManagerContext {
  open: (key: string, props?: any) => void;
  close: () => void;
}

const ModalContext = createContext({} as IModalManagerContext);

export const useModals = () => useContext(ModalContext);

const modals: Record<string, any> = {
  [FIXED_BID_MODAL]: FixedBidModal,
  [MINT_NFT_MODAL]: MintNftModal,
  [MINT_REDEEM_MODAL]: MintRedeemModal,
  [POST_MINT_NFT_MODAL]: PostMintNftModal,
  [REWARDS_RAFFLE_MODAL]: RewardsRaffleModal,
};

export const ModalManagerProvider = ({ children }: { children: React.ReactNode; }) => {
  const [props, setProps] = useState<any>(null);
  const [modal, setModal] = useState<string>("");
  const [scrollPosition, setScrollPosition] = useState(0);

  const close = () => {
    document.body.classList.remove("no-scroll");
    document.body.style.top = "";
    window.scrollTo(0, scrollPosition);

    setModal("");
    setProps(null);
  };

  const open = (key: string, props?: any) => {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    setScrollPosition(scrollPosition);

    document.body.classList.add("no-scroll");
    document.body.style.top = `-${scrollPosition}px`;
    setModal(key);
    if (props) setProps(props);
  };

  const Modal = modals[modal];

  return (
    <ModalContext.Provider value={{ close, open }}>
      {children}
      {Modal && <Modal {...props} />}
    </ModalContext.Provider>
  );
}
