import "./Header.scss";

import CreditClubLogo from "@/assets/creditclub-logo.svg";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const Header = () => {
  return (
    <header className="Header w-full items-center flex justify-between">
      <a href="/">
        <CreditClubLogo />
      </a>

      <ConnectButton chainStatus="none" showBalance={false} />
    </header>
  );
};