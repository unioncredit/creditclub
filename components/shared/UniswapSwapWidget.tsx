"use client";

import React from "react";
import { defaultTheme, SwapWidget, Theme } from "@uniswap/widgets";
import { useEthersSigner } from "@/hooks/useEthersSigner";
import { Address } from "viem";

if (typeof window !== "undefined") {
  // @ts-ignore
  window.Browser = {
    T: () => {
    }
  };
}

const theme: Theme = {
  ...defaultTheme,
  accent: "#2A2736"
}

export const UniswapSwapWidget = ({
  inputTokenAddress,
  outputTokenAddress,
}: {
  inputTokenAddress: Address;
  outputTokenAddress: Address;
}) => {
  const signer = useEthersSigner();

  return (
    <SwapWidget
      width="100%"
      theme={theme}
      permit2={true}
      provider={signer?.provider}
      routerUrl="https://api.uniswap.org/v1/"
      tokenList="https://ipfs.io/ipns/tokens.uniswap.org"
      onError={(error) => console.log({ error })}
      hideConnectionUI={true}
      defaultInputTokenAddress={inputTokenAddress}
      defaultOutputTokenAddress={outputTokenAddress}
    />
  )
};
