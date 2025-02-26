import React, { createContext, useContext, useState } from "react";

import { REWARDS_RAFFLE_MODAL, RewardsRaffleModal } from "@/components/modals/RewardsRaffleModal";
import { FIXED_BID_MODAL, FixedBidModal } from "@/components/modals/FixedBidModal";
import { MINT_NFT_MODAL, MintNftModal } from "@/components/modals/MintNftModal";
import { MINT_REDEEM_MODAL, MintRedeemModal } from "@/components/modals/MintRedeemModal";
import { POST_MINT_NFT_MODAL, PostMintNftModal } from "@/components/modals/PostMintNftModal";
import { UNISWAP_SWAP_MODAL, UniswapSwapModal } from "@/components/modals/UniswapSwapModal";
import { BORROW_MODAL, BorrowModal } from "@/components/modals/BorrowModal";
import { REPAY_MODAL, RepayModal } from "@/components/modals/RepayModal";
import { BUY_INVITES_MODAL, BuyInvitesModal } from "@/components/modals/BuyInvitesModal";
import { INVITE_MODAL, InviteModal } from "@/components/modals/InviteModal";
import { POST_TX_MODAL, PostTxModal } from "@/components/modals/PostTxModal";
import { REWARDS_MODAL, RewardsModal } from "@/components/modals/RewardsModal";
import { UNION_REPAY_MODAL, UnionRepayModal } from "@/components/modals/UnionRepayModal";

interface IModalManagerContext {
  open: (key: string, props?: any) => void;
  close: () => void;
}

const ModalContext = createContext({} as IModalManagerContext);

export const useModals = () => useContext(ModalContext);

const modals: Record<string, any> = {
  [BORROW_MODAL]: BorrowModal,
  [BUY_INVITES_MODAL]: BuyInvitesModal,
  [FIXED_BID_MODAL]: FixedBidModal,
  [INVITE_MODAL]: InviteModal,
  [MINT_NFT_MODAL]: MintNftModal,
  [MINT_REDEEM_MODAL]: MintRedeemModal,
  [POST_MINT_NFT_MODAL]: PostMintNftModal,
  [POST_TX_MODAL]: PostTxModal,
  [REPAY_MODAL]: RepayModal,
  [REWARDS_MODAL]: RewardsModal,
  [REWARDS_RAFFLE_MODAL]: RewardsRaffleModal,
  [UNION_REPAY_MODAL]: UnionRepayModal,
  [UNISWAP_SWAP_MODAL]: UniswapSwapModal,
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
