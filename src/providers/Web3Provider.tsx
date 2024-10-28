import React from "react";
import { http, WagmiProvider } from "wagmi";
import { merge } from "lodash";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  darkTheme,
  getDefaultConfig,
  RainbowKitProvider,
  Theme,
} from "@rainbow-me/rainbowkit";

import { RPC_URL, rpcChains } from "@/constants";
import { optimism } from "viem/chains";
import { PrivyClientConfig, PrivyProvider } from "@privy-io/react-auth";

export const wagmiConfig = getDefaultConfig({
  chains: rpcChains,
  appName: "CreditClub",
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
  transports: rpcChains.reduce((acc, network) => ({
    ...acc,
    [network.id]: http(RPC_URL(network.id)),
  }), {}),
});

const privyConfig: PrivyClientConfig = {
  // Customize Privy's appearance in your app
  appearance: {
    theme: "light",
    accentColor: "#676FFF",
    logo: "https://beta.creditclub.cc/glasses.png",
  },
  // Create embedded wallets for users who don't have a wallet
  embeddedWallets: {
    createOnLogin: "users-without-wallets",
  },
};

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();

  const theme = merge(
    darkTheme({
      borderRadius: "large",
      overlayBlur: "small",
    }),
    {
      colors: {
        accentColor: "#2A2736",
        connectButtonBackground: "#2A2736",
      },
    } as Theme,
  );

  return (
    <PrivyProvider appId={import.meta.env.VITE_PRIVY_APP_ID} config={privyConfig}>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider
            theme={theme}
            modalSize="compact"
            initialChain={optimism}
          >
            {children}
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </PrivyProvider>
  );
};
