import { createConfig, WagmiProvider } from "@privy-io/wagmi";
import { baseSepolia } from "viem/chains";
import { http } from "viem";
import React from "react";
import { cookieStorage, createStorage } from "wagmi";

export const config = createConfig({
  ssr: true,
  chains: [baseSepolia], // Pass your required chains as an array
  transports: {
    [baseSepolia.id]: http(),
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

