import "./Header.scss";

// @ts-ignore
import { Button, ProfileIcon } from "@unioncredit/ui";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import CreditClubLogo from "@/assets/creditclub-logo.svg";
import { format } from "@/utils/format.ts";
import { useMember } from "@/providers/ConnectedMemberProvider.tsx";
import { useAccount } from "wagmi";
import cn from "classnames";

export const Header = () => {
  const { address, isConnected } = useAccount();
  const { data: member } = useMember();

  const { unionCreditLimit } = member;

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
              className="CreditButton mr-2 sm:hidden"
              label={
                <p className="inline-flex items-center">
                  Available Credit · <span className="ml-1 text-black">${format(unionCreditLimit)}</span>
                </p>
              }
              color="secondary"
              variant="light"
              onClick={() => open(`https://app.union.finance/`)}
            />

            <Button
              size="small"
              className="ProfileButton mr-2 md:hidden"
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
            chainStatus="none"
            accountStatus="avatar"
          />
        </div>
      </div>
    </header>
  );
};