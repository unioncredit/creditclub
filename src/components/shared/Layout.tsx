// @ts-ignore
import { InfoBanner, WarningIcon } from "@unioncredit/ui";

import { Header } from "@/components/shared/Header.tsx";
import { useIsSupportedNetwork } from "@/hooks/useIsSupportedNetwork.ts";
import { useAccount } from "wagmi";
import { EnableNotificationsBanner } from "@/components/shared/EnableNotificationsBanner.tsx";
import { MobileNav } from "@/components/shared/MobileNav.tsx";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isConnected } = useAccount();
  const isSupported = useIsSupportedNetwork();

  return (
    <main className="pb-24">
      <Header />
      <MobileNav />
      <EnableNotificationsBanner />

      {isConnected && !isSupported && (
        <InfoBanner
          align="center"
          variant="warning"
          icon={WarningIcon}
          label="You are on an unsupported network, please connect to a Optimism/Base."
        />
      )}

      {children}
    </main>
  );
};