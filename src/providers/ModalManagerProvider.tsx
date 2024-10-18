import React, { createContext, useContext, useState } from "react";

import { FEELING_LUCKY_MODAL, FeelingLuckyModal } from "@/components/modals/FeelingLuckyModal.tsx";
import { IModalManagerContext } from "@/providers/types.ts";
import { BID_BUCKET_MODAL, BidBucketModal } from "@/components/modals/BidBucketModal.tsx";
import { MINT_NFT_MODAL, MintNftModal } from "@/components/modals/MintNftModal.tsx";
import { FEELING_LUCKY_WINNER_MODAL, FeelingLuckyWinnerModal } from "@/components/modals/FeelingLuckyWinnerModal.tsx";
import { BORROW_MODAL, BorrowModal } from "@/components/modals/BorrowModal.tsx";
import { REPAY_MODAL, RepayModal } from "@/components/modals/RepayModal.tsx";
import { INVITE_MODAL, InviteModal } from "@/components/modals/InviteModal.tsx";
import { POST_MINT_NFT_MODAL, PostMintNftModal } from "@/components/modals/PostMintNftModal.tsx";
import { SHARE_LINK_MODAL, ShareLinkModal } from "@/components/modals/ShareLinkModal.tsx";

const ModalContext = createContext({} as IModalManagerContext);

export const useModals = () => useContext(ModalContext);

const modals: Record<string, any> = {
  [BID_BUCKET_MODAL]: BidBucketModal,
  [BORROW_MODAL]: BorrowModal,
  [FEELING_LUCKY_MODAL]: FeelingLuckyModal,
  [FEELING_LUCKY_WINNER_MODAL]: FeelingLuckyWinnerModal,
  [INVITE_MODAL]: InviteModal,
  [MINT_NFT_MODAL]: MintNftModal,
  [POST_MINT_NFT_MODAL]: PostMintNftModal,
  [REPAY_MODAL]: RepayModal,
  [SHARE_LINK_MODAL]: ShareLinkModal,
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
