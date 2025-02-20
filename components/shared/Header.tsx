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
      <div className="sm:hidden">
        <a href="/">
          <CreditClubLogo className="w-[200px]" />
        </a>
      </div>
      <div className="hidden sm:block">
        <a href="/">
          <MobileCreditClubLogo className="h-[50px] max-w-[115px] -ml-4 scale-90" />
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