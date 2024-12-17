import React from "react";
import { http, WagmiProvider } from "wagmi";
import { merge } from "lodash";
import { base } from "viem/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  darkTheme,
  getDefaultConfig,
  RainbowKitProvider,
  Theme,
} from "@rainbow-me/rainbowkit";

import { RPC_URL, rpcChains } from "@/constants";

export const wagmiConfig = getDefaultConfig({
  chains: rpcChains,
  appName: "CreditClub",
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
  transports: rpcChains.reduce((acc, network) => ({
    ...acc,
    [network.id]: http(RPC_URL(network.id)),
  }), {}),
});

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
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={theme}
          modalSize="compact"
          initialChain={base}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
