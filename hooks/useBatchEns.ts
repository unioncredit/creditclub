import { useReadContracts } from "wagmi";
import { Address } from "viem";
import { useMemo } from "react";
import { mainnet } from "wagmi/chains";

export interface EnsData {
  name: string | null;
  avatar: string | null;
}

export const useBatchEns = (addresses: Address[]) => {
  // Create a single batch of contracts for both name and avatar resolution
  const contracts = useMemo(() => 
    addresses.flatMap(address => [
      {
        address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e" as Address, // ENS contract
        abi: [
          {
            inputs: [{ internalType: "address", name: "addr", type: "address" }],
            name: "getEnsName",
            outputs: [{ internalType: "string", name: "", type: "string" }],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [{ internalType: "address", name: "addr", type: "address" }],
            name: "getEnsAvatar",
            outputs: [{ internalType: "string", name: "", type: "string" }],
            stateMutability: "view",
            type: "function",
          }
        ] as const,
        chainId: mainnet.id,
        functionName: "getEnsName",
        args: [address],
      },
      {
        address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e" as Address,
        abi: [
          {
            inputs: [{ internalType: "address", name: "addr", type: "address" }],
            name: "getEnsName",
            outputs: [{ internalType: "string", name: "", type: "string" }],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [{ internalType: "address", name: "addr", type: "address" }],
            name: "getEnsAvatar",
            outputs: [{ internalType: "string", name: "", type: "string" }],
            stateMutability: "view",
            type: "function",
          }
        ] as const,
        chainId: mainnet.id,
        functionName: "getEnsAvatar",
        args: [address],
      }
    ]),
    [addresses]
  );

  const results = useReadContracts({
    contracts,
    query: {
      enabled: addresses.length > 0,
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
    }
  });

  // Combine results into a map of address -> {name, avatar}
  const ensData = useMemo(() => {
    const data = new Map<Address, EnsData>();
    
    addresses.forEach((address, index) => {
      const name = results.data?.[index * 2]?.result as string || null;
      const avatar = results.data?.[index * 2 + 1]?.result as string || null;
      
      data.set(address, { name, avatar });
    });

    return data;
  }, [addresses, results.data]);

  return {
    data: ensData,
    isLoading: results.isLoading,
    isError: results.isError,
    refetch: results.refetch
  };
}; 