// @ts-ignore
import { WalletIcon, RepayIcon, UnionIcon } from "@unioncredit/ui";
import { useAccount } from "wagmi";
import cn from "classnames";

import CreditClubLogo from "@/assets/creditclub-logo.svg";
import MobileCreditClubLogo from "@/assets/creditclub-mobile-logo.svg";
import { ConnectButton } from "@/components/shared/ConnectButton";

export const Header = () => {
  const { isConnected } = useAccount();

  return (
    <header className="w-full items-center flex justify-between">
      <div>
        <a href="/">
          <CreditClubLogo className="w-[200px]" />
        </a>
      </div>
      <div className="hidden">
        <a href="/">
          <MobileCreditClubLogo />
        </a>
      </div>

      <div className="flex">
        <div className={cn("ConnectButton", {
          "disconnected": !isConnected,
        })}>
          <ConnectButton/>
        </div>
      </div>
    </header>
  );
};