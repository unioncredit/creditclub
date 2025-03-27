// @ts-ignore
import { WalletIcon, RepayIcon, UnionIcon, BlogIcon, FarcasterIcon, TwitterIcon } from "@unioncredit/ui";
import { useAccount } from "wagmi";
import cn from "classnames";

import CreditClubLogo from "@/assets/creditclub-logo.svg";
import MobileCreditClubLogo from "@/assets/creditclub-mobile-logo.svg";
import { ConnectButton } from "@/components/shared/ConnectButton";
import Link from "next/link";

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
          <MobileCreditClubLogo className="h-[50px] max-w-[115px] -ml-6 scale-75" />
        </a>
      </div>

      <div className="flex items-center gap-8 md:gap-4 sm:gap-1">
        <Link href="/blog" className="flex items-center gap-2 text-xl font-mono hover:font-medium sm:text-base">
          <BlogIcon width={24} height={24} />
          Updates
        </Link>

        <div className={cn("ConnectButton", {
          "disconnected": !isConnected,
        })}>
          <ConnectButton/>
        </div>
      </div>
    </header>
  );
};