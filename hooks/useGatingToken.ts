import { Address, erc20Abi, erc721Abi, zeroAddress } from "viem";
import { useAccount, useReadContracts } from "wagmi";

import { DEFAULT_CHAIN_ID, GATING_TOKEN_TYPE } from "@/constants";
import { useClubData } from "@/hooks/useClubData";

export const useGatingToken = (clubAddress: Address) => {
  const { address } = useAccount();
  const { data: clubData } = useClubData(clubAddress);

  const {
    gatingTokenAddress,
    gatingTokenType,
  } = clubData;

  const tokenAbi = gatingTokenType === GATING_TOKEN_TYPE.ERC20
    ? erc20Abi
    : erc721Abi;

  const contracts = [
    {
      abi: tokenAbi,
      address: gatingTokenAddress,
      functionName: "balanceOf",
      args: [address],
    },
    {
      abi: tokenAbi,
      address: gatingTokenAddress,
      functionName: "name",
    },
    {
      abi: tokenAbi,
      address: gatingTokenAddress,
      functionName: "symbol",
    }
  ];

  const result = useReadContracts({
    // @ts-ignore
    contracts: contracts.map(c => ({
      ...c,
      chainId: DEFAULT_CHAIN_ID,
    })),
    query: {
      enabled: !!clubAddress && gatingTokenAddress !== zeroAddress,
    }
  });

  const [
    balance = 0n,
    name = "Unknown",
    symbol = "UNKNOWN"
  ] = result.data?.map(d => d.result as never) || [];

  const data = {
    balance,
    name,
    symbol,
    address: gatingTokenAddress,
    type: gatingTokenType,
    enabled: gatingTokenAddress !== zeroAddress,
    qualified: balance > 0n,
  };

  return { ...result, data };
};