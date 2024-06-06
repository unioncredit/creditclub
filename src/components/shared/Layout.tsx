// @ts-ignore
import { InfoBanner, WarningIcon } from "@unioncredit/ui";

import { Header } from "@/components/shared/Header.tsx";
import { useIsSupportedNetwork } from "@/hooks/useIsSupportedNetwork.ts";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const isSupported = useIsSupportedNetwork();

  return (
    <main className="pb-24">
      <Header />

      {!isSupported && (
        <InfoBanner
          align="center"
          variant="warning"
          icon={WarningIcon}
          label="You are on an unsupported network, please connect to Optimism."
        />
      )}

      {children}
    </main>
  );
};