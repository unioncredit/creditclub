// import "./Header.scss";

// @ts-ignore
import { WalletIcon, RepayIcon, UnionIcon } from "@unioncredit/ui";
import { useAccount } from "wagmi";
import cn from "classnames";

import CreditClubLogo from "@/assets/creditclub-logo.svg";
import MobileCreditClubLogo from "@/assets/creditclub-mobile-logo.svg";
import { ConnectButton } from "@/components/shared/ConnectButton";
import { RoundedButton } from "@/components/ui/RoundedButton";
import { useUnionMember } from "@/providers/UnionMemberProvider";
import { format } from "@/lib/format";
import { useToken } from "@/hooks/useToken";
import { useSupportedNetwork } from "@/hooks/useSupportedNetwork";

export const Header = () => {
  const { token, wad } = useToken();
  const { isConnected } = useAccount();
  const { data: unionMember } = useUnionMember();
  const { data: isSupported } = useSupportedNetwork();

  const { creditLimit, owed } = unionMember;

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
        {isSupported && (
          <>
            <RoundedButton
              className="mr-2"
              icon={<WalletIcon width={24} />}
              onClick={() => open("https://app.union.finance/")}
            >
              Borrow · ${format(creditLimit, token, creditLimit < wad ? 2 : 0)}
            </RoundedButton>

            <RoundedButton
              className="mr-2"
              icon={<RepayIcon width={24} />}
              onClick={() => open("https://app.union.finance/")}
            >
              Repay · ${format(owed, token, owed < wad ? 2 : 0)}
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