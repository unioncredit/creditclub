// import "./Header.scss";

// @ts-ignore
import { ArrowIcon, ProfileIcon } from "@unioncredit/ui";
import { useAccount } from "wagmi";
import cn from "classnames";

import CreditClubLogo from "@/assets/creditclub-logo.svg";
import MobileCreditClubLogo from "@/assets/creditclub-mobile-logo.svg";
import { ConnectButton } from "@/components/shared/ConnectButton";
import { RoundedButton } from "@/components/ui/RoundedButton";

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
        {isConnected && (
          <>
            <RoundedButton
              className="mr-2"
              icon={<ArrowIcon width={24} className="rotate-90" />}
              onClick={() => alert(0)}
            >
              Borrow Rate - X%
            </RoundedButton>

            <RoundedButton
              className="mr-2"
              onClick={() => alert(0)}
            >
              Treasury · $XXX,XXX.XX
            </RoundedButton>

            <RoundedButton
              className="mr-2"
              icon={<ProfileIcon width={24} />}
              onClick={() => alert(0)}
            >
              Your CC
            </RoundedButton>
          </>
        )}

        <div className={cn("ConnectButton", {
          "disconnected": !isConnected,
        })}>
          <ConnectButton/>
        </div>
      </div>
    </header>
  );
};