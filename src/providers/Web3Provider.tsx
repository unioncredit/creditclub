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

import { RPC_URL, supportedChains } from "@/constants";

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();

  const config = getDefaultConfig({
    chains: supportedChains,
    appName: "CreditClub",
    projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
    transports: supportedChains.reduce((acc, network) => ({
      ...acc,
      [network.id]: http(RPC_URL(network.id)),
    })),
  });

  const theme = merge(
    darkTheme({
      borderRadius: "small",
      overlayBlur: "small",
    }),
    {
      colors: {},
    } as Theme,
  );

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={theme}
          modalSize="compact"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
