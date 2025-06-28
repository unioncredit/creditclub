"use client";

import React from "react";
import { defaultTheme, SwapWidget, Theme } from "@uniswap/widgets";
import { useEthersSigner } from "@/hooks/useEthersSigner";
import { Address } from "viem";
import { useErc20Token } from "@/hooks/useErc20Token";
import { DEFAULT_CHAIN_ID } from "@/constants";

if (typeof window !== "undefined") {
  // @ts-ignore
  window.Browser = {
    T: () => {
    }
  };
}

const theme: Theme = {
  ...defaultTheme,
  accent: "#2A2736",
}

export const UniswapSwapWidget = ({
  inputTokenAddress,
  outputTokenAddress,
}: {
  inputTokenAddress: Address;
  outputTokenAddress: Address;
}) => {
  const signer = useEthersSigner();
  const { data: clubToken } = useErc20Token(outputTokenAddress);
  const { data: assetToken } = useErc20Token(inputTokenAddress);

  const { name: clubName, symbol: clubSymbol, decimals: clubDecimals } = clubToken;
  const { name: assetName, symbol: assetSymbol, decimals: assetDecimals } = assetToken;

  const tokenList = [
    {
      "name": assetName,
      "address": inputTokenAddress,
      "symbol": assetSymbol,
      "decimals": assetDecimals,
      "chainId": DEFAULT_CHAIN_ID,
    },
    {
      "name": clubName,
      "address": outputTokenAddress,
      "symbol": clubSymbol,
      "decimals": clubDecimals,
      "chainId": DEFAULT_CHAIN_ID,
    }
  ];

  return (
    <SwapWidget
      width="100%"
      theme={theme}
      permit2={true}
      provider={signer?.provider}
      routerUrl="https://api.uniswap.org/v1/"
      tokenList={tokenList}
              onError={(error) => {}}
      hideConnectionUI={false}
      // defaultInputTokenAddress={inputTokenAddress}
      defaultOutputTokenAddress={outputTokenAddress}
    />
  )
};
