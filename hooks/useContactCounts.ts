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

  // Extract results with proper destructuring
  const [
    voucherCountResult,
    voucheeCountResult,
  ] = result.data || [];

  const voucherCount: bigint = (voucherCountResult?.result as bigint) ?? 0n;
  const voucheeCount: bigint = (voucheeCountResult?.result as bigint) ?? 0n;

  return {
    voucherCount,
    voucheeCount,
    refetch: result.refetch,
  };
};