import { Address, erc20Abi } from "viem";
import { useReadContracts } from "wagmi";

import { DEFAULT_CHAIN_ID } from "@/constants";

export const useErc20Token = (tokenAddress: Address) => {
  const contracts = [
    {
      abi: erc20Abi,
      address: tokenAddress,
      functionName: "name",
    },
    {
      abi: erc20Abi,
      address: tokenAddress,
      functionName: "symbol",
    },
    {
      abi: erc20Abi,
      address: tokenAddress,
      functionName: "decimals",
    },
  ];

  const result = useReadContracts({
    contracts: contracts.map(c => ({
      ...c,
      chainId: DEFAULT_CHAIN_ID,
    })),
    query: {
      enabled: !!tokenAddress,
    }
  });

  const [
    name = "",
    symbol = "",
    decimals = 0,
  ] = result.data?.map(d => d.result as never) || [];

  const data = {
    address: tokenAddress,
    name,
    symbol,
    decimals,
  };

  return { ...result, data };
};