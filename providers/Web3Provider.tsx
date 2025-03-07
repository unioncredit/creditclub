import { createConfig, WagmiProvider } from "@privy-io/wagmi";
import { base, mainnet, optimism } from "viem/chains";
import { http } from "viem";
import React from "react";
import { cookieStorage, createStorage } from "wagmi";

export const config = createConfig({
  ssr: true,
  chains: [base, mainnet, optimism],
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
    [optimism.id]: http(),
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

