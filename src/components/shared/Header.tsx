import "./Header.scss";

// @ts-ignore
import { Button, ProfileIcon } from "@unioncredit/ui";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import CreditClubLogo from "@/assets/creditclub-logo.svg";
import { format, toPercent } from "@/utils/format.ts";
import { useAccount } from "wagmi";
import cn from "classnames";
import { useClubData } from "@/providers/CreditClubDataProvider.tsx";
import { formatUnits } from "viem";
import { BLOCKS_PER_YEAR } from "@/constants.ts";
import { useUnionMember } from "@/providers/UnionMemberProvider.tsx";
import { useModals } from "@/providers/ModalManagerProvider.tsx";
import { BORROW_MODAL } from "@/components/modals/BorrowModal.tsx";

export const Header = () => {
  const { address, isConnected } = useAccount();
  const { data: member } = useUnionMember();
  const { data: creditClub } = useClubData();
  const { open: openModal } = useModals();

  const { creditLimit } = member;
  const { borrowRatePerSecond } = creditClub;

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
                  Available Credit · <span className="ml-1 text-black">${format(creditLimit)}</span>
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
                  Rate · <span className="ml-1 text-black">{toPercent(formatUnits(borrowRatePerSecond * BLOCKS_PER_YEAR, 18))}</span>
                </p>
              }
              color="secondary"
              variant="light"
              onClick={() => open(`https://data.union.finance/optimism`)}
            />

            <Button
              size="small"
              className="ProfileButton mr-2 lg:hidden"
              icon={ProfileIcon}
              label="Your profile"
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