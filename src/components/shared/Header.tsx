import "./Header.scss";

// @ts-ignore
import { Button, ProfileIcon } from "@unioncredit/ui";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import CreditClubLogo from "@/assets/creditclub-logo.svg";
import { format } from "@/utils/format.ts";
import { useAccount } from "wagmi";
import cn from "classnames";
import { useUnionMember } from "@/providers/UnionMemberProvider.tsx";
import { useModals } from "@/providers/ModalManagerProvider.tsx";
import { BORROW_MODAL } from "@/components/modals/BorrowModal.tsx";
import { REPAY_MODAL } from "@/components/modals/RepayModal.tsx";

export const Header = () => {
  const { address, isConnected } = useAccount();
  const { data: member } = useUnionMember();
  const { open: openModal } = useModals();

  const { creditLimit, owed } = member;

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
              className="CreditButton mr-2 md:hidden lg:px-2"
              label={
                <p className="inline-flex items-center">
                  Available · <span className="ml-1 text-black">${format(creditLimit)}</span>
                </p>
              }
              color="secondary"
              variant="light"
              onClick={() => openModal(BORROW_MODAL)}
            />

            <Button
              size="small"
              className="BorrowRateButton mr-2 md:hidden lg:px-2"
              label={
                <p className="inline-flex items-center">
                  {owed <= 0n ? (
                    "No payment due"
                  ) : (
                    <>
                      Payment Due ·
                      <span className="text-black ml-1">${format(owed)} </span>
                    </>
                  )}
                </p>
              }
              color="secondary"
              variant="light"
              onClick={() => openModal(REPAY_MODAL)}
            />

            <Button
              size="small"
              className="ProfileButton mr-2 lg:hidden"
              icon={ProfileIcon}
              label="Profile"
              color="secondary"
              variant="light"
              onClick={() => open(`https://app.union.finance/profile/opt:${address}`)}
            />
          </>
        )}

        <div className={cn("ConnectButton", {
          "disconnected": !isConnected,
        })}>
          <ConnectButton
            showBalance={false}
            chainStatus="icon"
            accountStatus={{
              largeScreen: "full",
              smallScreen: "avatar",
            }}
          />
        </div>
      </div>
    </header>
  );
};