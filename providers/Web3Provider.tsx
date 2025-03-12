import { createConfig, WagmiProvider } from "@privy-io/wagmi";
import { base, Chain, mainnet, optimism } from "viem/chains";
import { http } from "viem";
import React from "react";
import { cookieStorage, createStorage } from "wagmi";

import { RPC_URL, rpcChains } from "@/constants";

export const config = createConfig({
  ssr: true,
  chains: [base, mainnet, optimism],
  transports: rpcChains.reduce((acc: any, network: Chain) => ({
    ...acc,
    [network.id]: http(RPC_URL(network.id)),
  }), {}),
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

