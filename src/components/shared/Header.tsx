import "./Header.scss";

// @ts-ignore
import { Button, VouchIcon, WalletIcon, RepayIcon, UnionIcon } from "@unioncredit/ui";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import CreditClubLogo from "@/assets/creditclub-logo.svg";
import MobileCreditClubLogo from "@/assets/creditclub-mobile-logo.svg";
import { format } from "@/utils/format.ts";
import { useAccount } from "wagmi";
import cn from "classnames";
import { useUnionMember } from "@/providers/UnionMemberProvider.tsx";
import { useModals } from "@/providers/ModalManagerProvider.tsx";
import { BORROW_MODAL } from "@/components/modals/BorrowModal.tsx";
import { REPAY_MODAL } from "@/components/modals/RepayModal.tsx";
import { INVITE_MODAL } from "@/components/modals/InviteModal.tsx";
import { REWARDS_MODAL } from "@/components/modals/RewardsModal.tsx";
import { useToken } from "@/hooks/useToken.ts";

export const Header = () => {
  const { isConnected } = useAccount();
  const { data: member } = useUnionMember();
  const { open: openModal } = useModals();
  const { token, wad } = useToken();

  const { creditLimit, owed, unionBalance } = member;

  return (
    <header className="Header w-full items-center flex justify-between">
      <div className="Header__logo Header__logo--desktop">
        <a href="/">
          <CreditClubLogo />
        </a>
      </div>
      <div className="Header__logo Header__logo--mobile">
        <a href="/">
          <MobileCreditClubLogo />
        </a>
      </div>

      <div className="flex">
        {isConnected && (
          <>
            <Button
              size="small"
              icon={WalletIcon}
              className="CreditButton mr-2 md:hidden lg:px-2"
              label={
                <p className="inline-flex items-center">
                  Borrow · <span className="ml-1 text-black">${format(creditLimit, token, creditLimit < wad ? 2 : 0)}</span>
                </p>
              }
              color="secondary"
              variant="light"
              onClick={() => openModal(BORROW_MODAL)}
            />

            <Button
              size="small"
              icon={RepayIcon}
              className="RepayButton mr-2 md:hidden lg:px-2"
              label={
                <p className="inline-flex items-center">
                  <>
                    Repay ·
                    <span className="text-black ml-1">${format(owed, token, owed < wad ? 2 : 0)} </span>
                  </>
                </p>
              }
              color="secondary"
              variant="light"
              onClick={() => openModal(REPAY_MODAL)}
            />

            <Button
              size="small"
              icon={UnionIcon}
              className="UnionButton mr-2 lg:px-2"
              label={format(unionBalance, token, 0)}
              color="secondary"
              variant="light"
              onClick={() => openModal(REWARDS_MODAL)}
            />

            <Button
              size="small"
              className="ProfileButton mr-2"
              label="Invites"
              icon={VouchIcon}
              color="secondary"
              variant="light"
              onClick={() => openModal(INVITE_MODAL)}
            />
          </>
        )}

        <div className={cn("ConnectButton", {
          "disconnected": !isConnected,
        })}>
          <ConnectButton
            showBalance={false}
            chainStatus="icon"
            accountStatus="avatar"
          />
        </div>
      </div>
    </header>
  );
};