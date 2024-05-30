import CreditClubLogo from "@/assets/creditclub-logo.svg";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const Header = () => {
  return (
    <header className="w-full flex justify-between">
      <a href="/">
        <CreditClubLogo />
      </a>

      <ConnectButton chainStatus="none" showBalance={false} />
    </header>
  );
};