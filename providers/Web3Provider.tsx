import { createConfig, WagmiProvider } from "@privy-io/wagmi";
import { base, baseSepolia } from "viem/chains";
import { http } from "viem";
import React from "react";
import { cookieStorage, createStorage } from "wagmi";

import { RPC_URL } from "@/constants";

export const config = createConfig({
  ssr: true,
  chains: [base, baseSepolia],
  transports: {
    [base.id]: http(RPC_URL(base.id)),
    [baseSepolia.id]: http(RPC_URL(baseSepolia.id)),
  },
  storage: createStorage({
    storage: cookieStorage,
  }),
});

export const Web3Provider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <WagmiProvider config={config}>
      {children}
    </WagmiProvider>
  )
};

