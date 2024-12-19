import { Address } from "viem";
import { useReadContracts } from "wagmi";
import { useContract } from "@/hooks/useContract.ts";
import { DEFAULT_CHAIN_ID } from "@/constants.ts";

export const useContactCounts = (address: Address) => {
  const chainId = DEFAULT_CHAIN_ID;
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
    ].map(c => ({ ...c, chainId })),
  });

  const [
    voucherCount= 0,
    voucheeCount = 0n,
  ] = result.data?.map(d => d.result) || [];

  return {
    voucherCount,
    voucheeCount,
    refetch: result.refetch,
  };
};