import React, { createContext, useContext, useState } from "react";

import { FEELING_LUCKY_MODAL, FeelingLuckyModal } from "@/components/modals/FeelingLuckyModal.tsx";
import { IModalManagerContext } from "@/providers/types.ts";
import { BID_BUCKET_MODAL, BidBucketModal } from "@/components/modals/BidBucketModal.tsx";
import { MINT_NFT_MODAL, MintNftModal } from "@/components/modals/MintNftModal.tsx";

const ModalContext = createContext({} as IModalManagerContext);

export const useModals = () => useContext(ModalContext);

const modals: Record<string, any> = {
  [BID_BUCKET_MODAL]: BidBucketModal,
  [FEELING_LUCKY_MODAL]: FeelingLuckyModal,
  [MINT_NFT_MODAL]: MintNftModal,
};

export const ModalManagerProvider = ({ children }: { children: React.ReactNode; }) => {
  const [props, setProps] = useState<any>(null);
  const [modal, setModal] = useState<string>("");

  const close = () => {
    document.body.classList.remove("no-scroll");
    setModal("");
    setProps(null);
  };

  const open = (key: string, props?: any) => {
    document.body.classList.add("no-scroll");
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
