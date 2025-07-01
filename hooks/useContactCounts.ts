import { Address } from "viem";
import { useReadContracts } from "wagmi";
import { useContract } from "@/hooks/useContract";
import { DEFAULT_CHAIN_ID } from "@/constants";

export const useContactCounts = (address: Address) => {
  const userManagerContract = useContract("userManager");

  const result = useReadContracts({
    contracts: [
      {
        ...userManagerContract,
        functionName: "getVoucherCount",
        args: [address],
      },
      {
        ...userManagerContract,
        functionName: "getVoucheeCount",
        args: [address],
      },
    ].map(c => ({ ...c, chainId: DEFAULT_CHAIN_ID })),
    query: {
      enabled: !!address,
      staleTime: Infinity,
    }
  });

  const [
    voucherCount= 0,
    voucheeCount = 0n,
  ] = result.data?.map((d: any) => {
    if (d?.status === 'success' && d?.result !== undefined) return d.result;
    if (d?.result !== undefined) return d.result;
    return null;
  }) || [];

  return {
    voucherCount,
    voucheeCount,
    refetch: result.refetch,
  };
};