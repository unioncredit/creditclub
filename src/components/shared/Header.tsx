import "./Header.scss";

// @ts-ignore
import { Button, VouchIcon, WalletIcon, RepayIcon, UnionIcon } from "@unioncredit/ui";

import CreditClubLogo from "@/assets/creditclub-logo.svg";
import { format } from "@/utils/format.ts";
import { useAccount } from "wagmi";
import cn from "classnames";
import { useUnionMember } from "@/providers/UnionMemberProvider.tsx";
import { useModals } from "@/providers/ModalManagerProvider.tsx";
import { BORROW_MODAL } from "@/components/modals/BorrowModal.tsx";
import { REPAY_MODAL } from "@/components/modals/RepayModal.tsx";
import { WAD } from "@/constants.ts";
import { INVITE_MODAL } from "@/components/modals/InviteModal.tsx";
import { REWARDS_MODAL } from "@/components/modals/RewardsModal.tsx";
import { usePrivy } from "@privy-io/react-auth";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const Header = () => {
  const { isConnected } = useAccount();
  const { data: member } = useUnionMember();
  const { open: openModal } = useModals();
  const { connectWallet } = usePrivy();

  const { creditLimit, owed, unionBalance } = member;

  return (
    <header className="Header w-full items-center flex justify-between">
      <div className="Header__logo">
        <a href="/">
          <CreditClubLogo />
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
                  Available · <span className="ml-1 text-black">${format(creditLimit, creditLimit < WAD ? 2 : 0)}</span>
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
                    Balance ·
                    <span className="text-black ml-1">${format(owed, owed < WAD ? 2 : 0)} </span>
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
              label={format(unionBalance, 0)}
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
          {isConnected ? (
            <ConnectButton
              showBalance={false}
              chainStatus="none"
              accountStatus={{
                largeScreen: "full",
                smallScreen: "avatar",
              }}
            />
          ) : (
            <Button
              label="Connect Wallet"
              className="PrivyConnectButton"
              icon={WalletIcon}
              color="secondary"
              variant="light"
              onClick={connectWallet}
            />
          )}
        </div>
      </div>
    </header>
  );
};