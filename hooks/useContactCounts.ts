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

  const extractResult = (contractResult: any): any => {
    if (contractResult?.status === 'success' && contractResult?.result !== undefined) {
      return contractResult.result;
    }
    if (contractResult?.result !== undefined) {
      return contractResult.result;
    }
    return null;
  };

  const safeBigInt = (value: any): bigint => {
    if (typeof value === 'bigint') return value;
    if (typeof value === 'number') return BigInt(value);
    if (typeof value === 'string' && value !== '') {
      try {
        return BigInt(value);
      } catch {
        return 0n;
      }
    }
    return 0n;
  };

  const voucherCountResult = result.data?.[0] ? extractResult(result.data[0]) : null;
  const voucheeCountResult = result.data?.[1] ? extractResult(result.data[1]) : null;

  const voucherCount = safeBigInt(voucherCountResult);
  const voucheeCount = safeBigInt(voucheeCountResult);

  return {
    voucherCount,
    voucheeCount,
    refetch: result.refetch,
  };
};